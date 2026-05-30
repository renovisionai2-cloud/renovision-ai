# RenoVision AI

Premium AI interior visualization app built with Next.js 16, Supabase Auth, and Fal.ai.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

### Supabase (required for auth)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** and **anon public key** from **Settings → API**.
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. In **Authentication → URL Configuration**, set:
   - **Site URL:** `http://localhost:3000` (or your Vercel URL)
   - **Redirect URLs:** `http://localhost:3000/auth/callback`, `https://your-app.vercel.app/auth/callback`

5. Enable **Email** provider under **Authentication → Providers** (Google optional).

### Fal.ai (optional — AI generation)

See `.env.example` for `FAL_KEY` and render settings.

## Auth routes

| Route | Description |
|-------|-------------|
| `/sign-in` | Email/password login |
| `/sign-up` | Create account |
| `/auth/callback` | OAuth & email confirmation handler |
| `/dashboard` | Protected workspace (middleware + server layout) |

## Deploy to Vercel

```bash
npx vercel --prod
```

Set these in **Vercel → Project → Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `FAL_KEY` (if using real AI generation)
- `RENDER_PROVIDER=fal`
- `NEXT_PUBLIC_RENDER_PROVIDER=fal`

Update Supabase redirect URLs with your production domain after the first deploy.
