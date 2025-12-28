# DreamWeave Tales

AI-powered interactive storytelling platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies (use legacy-peer-deps if needed due to React 19 RC)
npm install --legacy-peer-deps
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your API keys:
   - `GEMINI_API_KEY`: Get from Google AI Studio.
   - `NEXT_PUBLIC_SUPABASE_*`: Get from Supabase (optional for UI demo, required for auth/saving).

### Running Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or 3001 if port is busy).

## 🏗️ Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`:
  - `layout/`: Navbar, Providers.
  - `views/`: Main page views (Library, Landing, etc).
  - `reader/`: Story reading experience.
  - `shared/`: Reusable UI components.
- `services/`: Business logic (AI, DB, etc).
- `types/`: TypeScript definitions.

## 🧪 Testing

The architecture is designed for Playwright testing.
- URLs are accessible via standard routes.
- External services (Supabase) in `lib/supabaseClient` handle missing keys gracefully.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS, React 19
- **AI**: Google Gemini
- **Database**: Supabase
- **VR**: React Three Fiber
