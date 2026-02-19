# SAT Connect - Mission Control

The central operating system for SAT Mexico's tour and activity providers.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in the required values for Clerk, Prisma, and Google APIs.

   ```bash
   cp .env.example .env
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

## Infrastructure

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: Clerk
- **UI**: Tailwind CSS + Lucide Icons + "Things 3" Inspiration
- **Status**: Phase 3 (Production Ready)

## Deployment (Vercel)

This project is optimized for deployment on Vercel.

1. **Push to GitHub/GitLab**.
2. **Import project in Vercel**.
3. **Configure Environment Variables**:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. **Deploy**.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npx prisma studio`: Open database GUI
