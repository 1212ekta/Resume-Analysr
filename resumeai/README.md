# Resume AI - AI-Powered Resume Analysis Tool

A comprehensive resume analysis application that uses Google Gemini AI to provide professional feedback, job matching scores, and career enhancement suggestions.

## Features

- **AI-Powered Analysis**: Comprehensive resume evaluation using Google Gemini AI
- **Job Matching**: Get compatibility scores against specific job descriptions  
- **Professional Feedback**: Detailed rating with actionable improvement suggestions
- **Career Tools**: Generate cover letters, LinkedIn summaries, and interview questions
- **PDF Processing**: Direct PDF upload with text extraction
- **Dark Theme**: Modern, eye-friendly dark interface as default
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Google Gemini API key (get one free at [https://ai.google.dev/](https://ai.google.dev/))

## VS Code Setup

1. **Install VS Code Extensions**:
   The project includes recommended extensions in `.vscode/extensions.json`. VS Code will prompt you to install them when you open the project.

2. **Open the Project**:
   ```bash
   code resume-ai
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start Development**:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking

## How to Use

1. **Upload Resume**: Drag and drop a PDF file or paste resume text
2. **Add Job Description** (Optional): Include a job posting for tailored analysis
3. **Get Analysis**: Click "Analyze Resume" and receive comprehensive feedback
4. **Review Results**: Get ratings, suggestions, cover letters, and more

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js
- **AI Service**: Google Gemini AI
- **Build Tool**: Vite
- **UI Components**: Radix UI, Shadcn/UI
- **PDF Processing**: pdf-parse

## Project Structure

```
├── client/src/          # Frontend React application
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts (theme)
│   └── lib/           # Utilities and API calls
├── server/            # Backend Express server
│   ├── services/      # AI service integration
│   └── routes.ts      # API endpoints
├── shared/            # Shared types and schemas
└── .vscode/          # VS Code settings and extensions
```

## Dark Theme

The application uses a modern dark theme by default with:
- Carefully chosen color palette for optimal readability
- Enhanced contrast ratios for accessibility
- Smooth transitions and hover effects
- Professional appearance suitable for career tools

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details