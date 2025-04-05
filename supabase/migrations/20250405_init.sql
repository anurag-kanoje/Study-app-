-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher');

-- Create users table extensions
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'student';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES auth.users(id);

-- App usage tracking
CREATE TABLE app_usage (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    app_name text NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    duration interval GENERATED ALWAYS AS (end_time - start_time) STORED,
    created_at timestamp with time zone DEFAULT now()
);

-- Study sessions
CREATE TABLE study_sessions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    subject text NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    duration interval GENERATED ALWAYS AS (end_time - start_time) STORED,
    focus_score int CHECK (focus_score BETWEEN 0 AND 100),
    created_at timestamp with time zone DEFAULT now()
);

-- Parental controls
CREATE TABLE parental_controls (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_id uuid REFERENCES auth.users(id) NOT NULL,
    student_id uuid REFERENCES auth.users(id) NOT NULL,
    app_name text NOT NULL,
    daily_limit interval,
    is_blocked boolean DEFAULT false,
    block_schedule jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(student_id, app_name)
);

-- AI chat history
CREATE TABLE chat_history (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    message text NOT NULL,
    response text NOT NULL,
    subject text,
    created_at timestamp with time zone DEFAULT now()
);

-- Document summaries
CREATE TABLE document_summaries (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    summary text NOT NULL,
    key_points jsonb,
    document_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Study groups
CREATE TABLE study_groups (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    owner_id uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE group_members (
    group_id uuid REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text DEFAULT 'member',
    joined_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (group_id, user_id)
);

-- Create RLS policies
ALTER TABLE app_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own app usage"
    ON app_usage FOR SELECT
    USING (auth.uid() = user_id OR 
           auth.uid() IN (
               SELECT parent_id FROM auth.users WHERE id = user_id
           ));

CREATE POLICY "Parents can view their children's study sessions"
    ON study_sessions FOR SELECT
    USING (auth.uid() = user_id OR 
           auth.uid() IN (
               SELECT parent_id FROM auth.users WHERE id = user_id
           ));

CREATE POLICY "Parents can manage controls"
    ON parental_controls FOR ALL
    USING (auth.uid() = parent_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parental_controls_updated_at
    BEFORE UPDATE ON parental_controls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_document_summaries_updated_at
    BEFORE UPDATE ON document_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
