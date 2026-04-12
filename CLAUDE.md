# UNLON — Solo No More

## Project Overview
Social connection app for Gen Z India. Dating + community + audio rooms + anonymous confessions + late night mode. Built with Next.js 14 + Supabase + Vercel.

## Live URLs
- **App**: https://unlon-app.vercel.app
- **GitHub**: https://github.com/atulbachhraj-ctrl/unlon-app
- **Supabase**: https://supabase.com/dashboard/project/sywlkwryqzekyuszlbwk
- **Vercel**: https://vercel.com/atulbachhraj-1875s-projects/unlon-app

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel (free tier)
- **PWA**: Service Worker + Manifest (installable)

## Project Structure
```
src/
├── lib/
│   ├── supabase.ts          # Supabase client (single instance)
│   ├── auth-context.tsx      # AuthProvider: user, profile, loading, signOut, refreshProfile
│   ├── register-sw.ts        # Service worker registration
│   └── sw-register-client.tsx
├── components/
│   ├── BottomNav.tsx         # 5-tab nav: Home, Discover, Rooms, Confess, Me
│   ├── InstallPrompt.tsx     # PWA install banner
│   └── ui/Toast.tsx          # ToastProvider + useToast hook
└── app/
    ├── layout.tsx            # Root: AuthProvider > ToastProvider
    ├── page.tsx              # Splash (auto-redirect if logged in)
    ├── (auth)/               # Unauthenticated routes
    │   ├── layout.tsx        # Redirects logged-in users away
    │   ├── signup/page.tsx
    │   ├── login/page.tsx
    │   ├── verify/page.tsx
    │   └── setup/page.tsx    # 4-step onboarding
    ├── auth/callback/route.ts # Email verification handler
    └── (main)/               # Authenticated routes (auth guard in layout)
        ├── layout.tsx        # Auth protection + profile completion check
        ├── home/page.tsx     # Feed with real profiles from DB
        ├── discover/page.tsx # Swipe matching (saves to matches table)
        ├── rooms/page.tsx    # Vibe rooms (UI, hardcoded data)
        ├── confess/page.tsx  # Real-time confessions (Supabase realtime)
        ├── night/page.tsx    # Night mode with real sessions + realtime
        ├── chats/page.tsx    # Chat list (real matches + last messages)
        ├── chats/[id]/page.tsx # Real-time chat messaging
        ├── profile/page.tsx  # Profile view/edit + real stats
        └── premium/page.tsx  # Premium upsell (UI only)
```

## Database Schema (Supabase)
8 tables with Row Level Security:
- **profiles** — id (FK→auth.users), username, display_name, avatar_emoji, bio, age, city, vibes[], is_premium, is_online
- **matches** — user_a, user_b, status (pending/matched/rejected), matched_at
- **messages** — match_id, sender_id, content, message_type, is_read
- **confessions** — user_id, content, is_anonymous, hearts/hugs/sads/wows
- **confession_reactions** — confession_id, user_id, reaction_type
- **night_sessions** — user_id, mood_emoji, status_text, is_active
- **night_questions** — question, active_date
- **daily_challenges** — question, active_date

Trigger: `on_auth_user_created` auto-creates profile row on signup.
Realtime enabled on: messages, confessions, night_sessions.

## Auth Flow
Signup → Email verify (Supabase link) → /auth/callback checks vibes → /setup (4 steps) or /home
- Auth layout redirects logged-in users away from auth pages
- Main layout redirects unauthenticated users to /login
- Main layout redirects incomplete profiles (no vibes) to /setup

## Design Tokens
```
Backgrounds: #060104 (bg), #0D0509 (screen), #130709 (card)
Primary: #FF5020 (sunset), #FF7040 (coral), #FFA040 (peach), #FFD000 (gold)
Accent: #FF3070 (rose), #FF8098 (blush), #8B5CF6 (violet), #7B61FF (night)
Text: #FFF3EC (warm), rgba(255,243,236,0.35) (muted)
Fonts: Syne (headings 700-800), DM Sans (body 300-600)
Radius: buttons 50px, cards 18px, inputs 14px, pills 22px
Gradients: sunset (#FF5020→#FFD000), rose (#FF3070→#FF7040), night (#2D1B69→#7B61FF)
```

## Key Patterns
- All pages use `"use client"` (client components with hooks)
- Toast system: `useToast()` from `@/components/ui/Toast` — never use alert()
- Auth: `useAuth()` from `@/lib/auth-context` — provides user, profile, loading, signOut, refreshProfile
- Profile updates: use `refreshProfile()` instead of `window.location.reload()`
- Supabase queries always have fallback to hardcoded data if DB returns empty
- Mobile-first: max-w-[430px] mx-auto container on all main pages

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://sywlkwryqzekyuszlbwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_OE3k0oUdNfthN3d8FJKhhA_b2RkBF_G
```

## Deploy
```bash
git add -A && git commit -m "message" && git push origin master
npx vercel deploy --prod
```

## Seed Data
- 25 realistic Indian profiles (diverse cities, ages, vibes)
- 8 anonymous confessions with reactions
- 5 active night sessions
- SQL at: seed-profiles.sql

## What's UI-Only (Not yet backend)
- Vibe Rooms (no rooms table — hardcoded data, filter works)
- Premium (no payment integration — shows "coming soon" toast)
- Social login (Google/Apple — shows "coming soon" toast)
- Voice messages, video calls — show "coming soon" toast

## Owner
- GitHub: atulbachhraj-ctrl
- Email: atulbachhraj@gmail.com
- Supabase project: atulbachhraj@gmail.com's Project
