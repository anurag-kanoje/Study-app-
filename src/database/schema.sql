-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables with CASCADE to handle dependencies
drop table if exists study_material_tags cascade;
drop table if exists study_materials cascade;
drop table if exists study_group_members cascade;
drop table if exists study_groups cascade;
drop table if exists video_generations cascade;
drop table if exists tags cascade;
drop table if exists profiles cascade;

-- Create profiles table
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique not null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_groups table
create table study_groups (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    created_by uuid references profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_group_members junction table
create table study_group_members (
    group_id uuid references study_groups(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (group_id, user_id)
);

-- Create study_materials table
create table study_materials (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    content text,
    created_by uuid references profiles(id) on delete cascade not null,
    group_id uuid references study_groups(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tags table
create table tags (
    id uuid default uuid_generate_v4() primary key,
    name text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_material_tags junction table
create table study_material_tags (
    material_id uuid references study_materials(id) on delete cascade,
    tag_id uuid references tags(id) on delete cascade,
    primary key (material_id, tag_id)
);

-- Create video_generations table
create table video_generations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade not null,
    prompt text not null,
    script text,
    video_url text,
    status text check (status in ('pending', 'completed', 'failed')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table study_groups enable row level security;
alter table study_group_members enable row level security;
alter table study_materials enable row level security;
alter table tags enable row level security;
alter table study_material_tags enable row level security;
alter table video_generations enable row level security;

-- Create RLS policies
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using (true);

create policy "Users can insert their own profile"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

create policy "Study groups are viewable by members"
    on study_groups for select
    using (
        exists (
            select 1 from study_group_members
            where group_id = study_groups.id
            and user_id = auth.uid()
        )
    );

create policy "Users can create study groups"
    on study_groups for insert
    with check (auth.uid() = created_by);

create policy "Group creators can update their groups"
    on study_groups for update
    using (auth.uid() = created_by);

create policy "Study materials are viewable by group members"
    on study_materials for select
    using (
        exists (
            select 1 from study_group_members
            where group_id = study_materials.group_id
            and user_id = auth.uid()
        )
    );

create policy "Users can create study materials"
    on study_materials for insert
    with check (auth.uid() = created_by);

create policy "Users can update their own study materials"
    on study_materials for update
    using (auth.uid() = created_by);

create policy "Users can view their own video generations"
    on video_generations for select
    using (auth.uid() = user_id);

create policy "Users can create video generations"
    on video_generations for insert
    with check (auth.uid() = user_id);

create policy "Users can view their group memberships"
    on study_group_members for select
    using (auth.uid() = user_id);

create policy "Users can join groups"
    on study_group_members for insert
    with check (auth.uid() = user_id);

create policy "Users can leave groups"
    on study_group_members for delete
    using (auth.uid() = user_id);

create policy "Tags are viewable by everyone"
    on tags for select
    using (true);

create policy "Authenticated users can create tags"
    on tags for insert
    with check (auth.role() = 'authenticated');

create policy "Study material tags are viewable by group members"
    on study_material_tags for select
    using (
        exists (
            select 1 from study_materials sm
            join study_group_members sgm on sm.group_id = sgm.group_id
            where sm.id = study_material_tags.material_id
            and sgm.user_id = auth.uid()
        )
    );

create policy "Material creators can manage tags"
    on study_material_tags for all
    using (
        exists (
            select 1 from study_materials
            where id = study_material_tags.material_id
            and created_by = auth.uid()
        )
    );

-- Create function for updating timestamps
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_profiles_updated_at
    before update on profiles
    for each row
    execute procedure handle_updated_at();

create trigger handle_study_groups_updated_at
    before update on study_groups
    for each row
    execute procedure handle_updated_at();

create trigger handle_study_materials_updated_at
    before update on study_materials
    for each row
    execute procedure handle_updated_at();

create trigger handle_video_generations_updated_at
    before update on video_generations
    for each row
    execute procedure handle_updated_at();

-- Create or replace storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set name = 'avatars',
    public = true;

-- Create storage policies for avatars
create policy "Give public access to avatars"
    on storage.objects for select
    using (bucket_id = 'avatars');

create policy "Allow authenticated uploads"
    on storage.objects for insert
    with check (
        bucket_id = 'avatars' AND
        auth.role() = 'authenticated'
    );

-- Enable real-time for tables
alter publication supabase_realtime add table study_materials;
alter publication supabase_realtime add table video_generations;
alter publication supabase_realtime add table study_groups;

-- Create indexes for better performance
create index idx_study_groups_created_by on study_groups(created_by);
create index idx_study_materials_created_by on study_materials(created_by);
create index idx_study_materials_group_id on study_materials(group_id);
create index idx_video_generations_user_id on video_generations(user_id);
create index idx_study_group_members_user_id on study_group_members(user_id);
create index idx_study_group_members_group_id on study_group_members(group_id);
create index idx_study_material_tags_material_id on study_material_tags(material_id);
create index idx_study_material_tags_tag_id on study_material_tags(tag_id); 