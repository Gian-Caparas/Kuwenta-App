# Kuewenta

Ang digital na listahan ng utang para sa tindahan mo. A digital *utang* (credit) ledger for sari-sari stores.

**Stack:** React 19 · Vite · JavaScript (no TypeScript) · React Router · Supabase (Auth + Postgres)

## 1. Run it locally

```bash
npm install
cp .env.example .env      # then fill in your Supabase values (step 2)
npm run dev               # http://localhost:5173
```

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the *Project URL* and the public key (*anon* or *publishable*) into `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-key
   ```
   Never use the `service_role` / secret key in this app.
3. **SQL Editor → New query**: paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates the `customers` and `transactions` tables with Row Level Security, so each store owner can only see their own data.
4. **Authentication → URL Configuration**
   - Site URL: `http://localhost:5173`
   - Redirect URLs: add `http://localhost:5173/**` (and your deployed URL later)
5. **Authentication → Sign In / Providers → Email**: keep sign-ups enabled.
   While developing, turn **off** "Confirm email" so signup logs you in right away and doesn't hit Supabase's low email limit. Turn it back on (and add a custom SMTP provider) before launch.
6. Restart `npm run dev` after any `.env` change.

Google login is wired up in the code but only works after you enable the Google provider in Supabase.

## 3. Deploy (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add the two `VITE_SUPABASE_*` environment variables in the Vercel project settings.
3. `vercel.json` already contains the rewrite that makes deep links (like `/customers/123`) work on refresh.
4. Add your Vercel URL to the Supabase Site URL / Redirect URLs.

## Project structure

```
src/
  main.jsx, App.jsx        Entry point and routes
  pages/                   One file per screen
  components/
    ui/                    Button, Header, Icon, Keypad, ...
    auth/                  Login, Signup, Forgot password forms
    customers/             CustomerRow, AmountEntry
    layout/                AppLayout, BottomNav, CustomerLayout
  auth/                    AuthContext, ProtectedRoute, onboarding flag
  context/                 CustomersContext (Supabase data), ToastContext
  hooks/                   useCustomer, useProfile, useGoBack, ...
  lib/                     supabase client, ledger math, formatting, errors
supabase/schema.sql        Database tables + security policies
```

## How the numbers work

- A customer's **balance** = all their debts minus all their payments (computed from `transactions`, never stored, so it can't go out of sync).
- A balance is **"Lampas na"** (overdue) once it has been unpaid for `OVERDUE_DAYS` (default 14, set in `src/config.js`).
- Reports show the last 6 months and the customers who have owed the longest.

## Styling

All styles live in `src/styles.css` (plain CSS, no framework). If you have the original Figma Make stylesheet, you can paste it over this file: the class names are the same. Keep these classes, which are new: `.auth-error`, `.state-screen`, `.spinner`, `.spinner-dark`, `.toast-error`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check the code with ESLint |

## Not built yet

- Working offline (the app needs internet to save; an offline banner is shown)
- Editing or deleting customers and transactions
- Real SMS sending (the SMS button opens the phone's messaging app)
- PWA install support
