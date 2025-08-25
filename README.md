# Renasis - AI-Powered Customer Review Analysis

A modern Progressive Web App (PWA) for analyzing customer reviews using Google AI, built with Next.js 15 and TypeScript.

## 🚀 Features

- **Multi-Format File Support**: Upload reviews in TXT, CSV, XLSX, and DOCX formats
- **AI-Powered Analysis**: Sentiment analysis, issue identification, and actionable suggestions
- **Local API Key Management**: Secure client-side storage of Google AI API keys
- **Terms & Privacy Compliance**: Mandatory terms acceptance with local storage
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **PWA Ready**: Installable web app with offline capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash)
- **File Processing**: XLSX, Mammoth (DOCX), React Dropzone
- **Charts**: Recharts
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API Key (users provide their own)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd renasis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🔧 Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment to Vercel

1. **Connect to Vercel**
   - Import project to Vercel
   - No environment variables required

2. **Deploy**
   - Automatic deployment on git push
   - Optimized for Vercel Edge Functions

## 🔑 API Key Setup

Users need to provide their own Google AI API keys:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add key through the app's "Add API Key" interface
4. Keys are stored locally in browser storage

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── privacy/        # Privacy policy page
│   └── terms/          # Terms of service page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature components
├── lib/               # Utility functions
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
```

## 🔒 Privacy & Security

- **No Server-Side API Keys**: All API keys stored locally
- **Client-Side Processing**: Secure file processing
- **Terms Compliance**: Mandatory acceptance of terms and privacy policy
- **Local Storage**: All user data stored on device

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.
