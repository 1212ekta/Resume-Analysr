# Resume AI - AI-Powered Resume Analysis Tool

## Overview

Resume AI is a comprehensive web application that provides AI-powered resume analysis and career enhancement tools. The platform allows users to upload PDF resumes or paste text directly, then leverages Google Gemini AI to deliver professional feedback, job matching scores, cover letter generation, LinkedIn summaries, and interview question preparation. The application features a modern dark-themed interface that's fully responsive across desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming, configured for dark mode as default
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **File Handling**: React Dropzone for drag-and-drop PDF uploads

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints with structured error handling
- **File Processing**: Multer for multipart file uploads, pdf-parse for PDF text extraction
- **Development**: Vite for fast development server with HMR (Hot Module Replacement)

### Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing
- **Tables**: Users table for potential authentication, resume_analyses table for storing analysis results

### AI Integration
- **Primary AI Service**: Google Gemini AI (gemini-2.5-flash model) for resume analysis
- **Analysis Features**: 
  - Professional summary generation
  - Resume rating (1-10 scale) with detailed explanations
  - Skills extraction and highlighting
  - Job matching scores when job descriptions provided
  - Missing keywords identification
  - Improvement suggestions
  - Cover letter generation
  - LinkedIn summary creation
  - Interview questions preparation

### Authentication & Security
- **File Security**: 10MB file size limit, PDF-only file type validation
- **API Security**: Environment variable management for sensitive API keys
- **CORS**: Configured for cross-origin requests in development

## External Dependencies

### Core AI Services
- **Google Gemini AI**: Primary AI engine for resume analysis and content generation
- **API Key**: Requires GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable

### Database Services
- **PostgreSQL**: Primary database (configurable via DATABASE_URL)
- **Neon Database**: Serverless PostgreSQL provider integration via @neondatabase/serverless

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **Replit Integration**: Development environment plugins for cartographer and dev banner
- **VS Code**: Optimized workspace with recommended extensions for TypeScript, Tailwind, and React development

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### File Processing
- **pdf-parse**: Server-side PDF text extraction
- **multer**: Multipart form data handling for file uploads

### Utility Libraries
- **class-variance-authority**: Type-safe component variants
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation