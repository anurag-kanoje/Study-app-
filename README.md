# StudyBuddy - AI-Powered Study Companion

StudyBuddy is a modern study application that leverages AI to help students learn more effectively. It features smart notes, AI summaries, file analysis, and more.

## Features

- 📝 Smart Notes with AI-powered organization
- 🤖 AI Chatbot for study assistance
- 📚 File Analysis and OCR
- 📊 Progress Tracking
- 🎯 Study Planning
- 🔔 Smart Notifications
- 🌙 Dark/Light Mode
- 📱 Responsive Design

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Supabase account
- OneSignal account (for notifications)
- OpenAI API key (for AI features)
- Google Cloud account (for OCR)
- AWS account (for file storage)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/studybuddy.git
   cd studybuddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your actual credentials.

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations`
   - Update the Supabase URL and anon key in your `.env.local`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
studybuddy/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
├── contexts/             # React contexts
├── lib/                  # Utility functions and hooks
├── public/              # Static assets
└── styles/              # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@studybuddy.com or join our Discord server.

