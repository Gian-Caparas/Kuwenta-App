# Kuwenta

> **Ang digital na listahan ng utang para sa tindahan mo.**  
> A digital *utang* (credit) ledger for sari-sari stores.

**Stack:** React 19 · Vite · JavaScript (no TypeScript) · React Router · Supabase (Auth + Postgres)

---

## ✨ Features

- **Customer ledger** — Add customers, record debts (*utang*) and payments (*bayad*)
- **Real-time balance** — Computed from transactions, never stored, so it can't go out of sync
- **Overdue tracking** — Automatic "Lampas na" flag after 14 days (configurable)
- **Reports** — 6-month summary + customers who have owed the longest
- **Bilingual** — English / Tagalog (Filipino) with one-tap language switch
- **Dark mode** — System-aware with manual toggle
- **Google login** — OAuth via Supabase (enable in Supabase dashboard)
- **SMS reminders** — Opens phone's messaging app with pre-filled reminder text
- **Offline banner** — Warns when network is unavailable (data still needs internet to save)
- **PWA-ready** — Installable on mobile (add to home screen)

> **Live demo:** *Add your deployed URL here*  
> **Screenshots:** *Add screenshots here (drag & drop into the repo or use a `/docs/screenshots` folder)*

---

## 📋 Requirements

| Tool | Version |
|------|---------|
| Node.js | **18+** (Vite 8 requires Node 18+) |
| npm | **9+** (bundled with Node 18+) |

> The project uses **React 19** and **Vite 8**, which both require Node 18 or higher.

---

## 1. Run it locally

```bash
npm install
cp .env.example .env      # then fill in your Supabase values (step 2)
npm run dev               # http://localhost:5173
```

If you don't have `.env.example`, create `.env` with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the *Project URL* and the public key (*anon* / *publishable*) into `.env`.
   > Never use the `service_role` / secret key in this app.
3. **SQL Editor → New query**: paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it.  
   This creates `customers` and `transactions` tables with Row Level Security (each store owner sees only their data).
4. **Authentication → URL Configuration**
   - Site URL: `http://localhost:5173`
   - Redirect URLs: add `http://localhost:5173/**` (and your deployed URL later)
5. **Authentication → Sign In / Providers → Email**: keep sign-ups enabled.  
   While developing, turn **off** "Confirm email" so signup logs you in right away and doesn't hit Supabase's low email limit. Turn it back on (and add a custom SMTP provider) before launch.
6. Restart `npm run dev` after any `.env` change.

> Google login is wired up in the code but only works after you enable the Google provider in **Supabase → Authentication → Providers → Google**.

---

## 3. Deploy (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add the two `VITE_SUPABASE_*` environment variables in the Vercel project settings.
3. `vercel.json` already contains the rewrite that makes deep links (like `/customers/123`) work on refresh.
4. Add your Vercel URL to the Supabase Site URL / Redirect URLs.

---

## 🛠 Troubleshooting

### "Invalid API key" / "JWT expired"
- Ensure `VITE_SUPABASE_ANON_KEY` is the **anon/publishable** key, not the service role key.
- Restart the dev server after changing `.env` (`npm run dev`).

### "Email not confirmed" on login
- In Supabase: **Authentication → Providers → Email** → disable "Confirm email" for dev.
- For production: enable it and configure a custom SMTP provider.

### "Redirect URL not allowed" on OAuth
- Add your exact URL (e.g. `http://localhost:5173/**`, `https://your-app.vercel.app/**`) to **Supabase → Authentication → URL Configuration → Redirect URLs**.

### RLS policy errors ("new row violates row-level security policy")
- Ensure the user is authenticated (`supabase.auth.getUser()` returns a user).
- The schema expects `user_id` to match `auth.uid()`. Don't insert rows manually without the correct `user_id`.

### "Failed to fetch" / network errors
- Check internet connection (the app shows an offline banner).
- Verify Supabase project is not paused (free tier pauses after 1 week of inactivity).

---

## ✅ Testing & Contribution

### Testing status
- **Unit tests:** Not yet configured (Vitest recommended)
- **E2E tests:** Not yet configured (Playwright or Cypress recommended)
- **Linting:** `npm run lint` (ESLint + React hooks plugin)

### Contributing
1. Fork the repo and create a feature branch.
2. Run `npm run lint` before committing.
3. Keep PRs focused — one feature/fix per PR.
4. Update the README if you add new scripts, env vars, or change the project structure.
5. For UI changes, consider adding a screenshot to the PR description.

---

## Project structure (high-level)

```
src/
  main.jsx, App.jsx        Entry point & routes
  config.js                App constants (OVERDUE_DAYS, etc.)
  styles.css               Global styles (plain CSS)
  pages/                   15 screen components (Home, Customers, CustomerDetail, Auth, Settings, Reports, …)
  components/
    ui/                    Reusable primitives (Button, Header, Icon, Keypad, Avatar, EmptyState, StateScreen)
    auth/                  Auth forms (Login, Signup, Forgot, PasswordField, AuthIntro, AuthSuccess)
    customers/             CustomerRow, AmountEntry
    layout/                AppLayout, BottomNav, CustomerLayout
  auth/                    AuthContext, ProtectedRoute, onboarding flag
  context/                 CustomersContext, ToastContext, LanguageContext, ThemeContext
  hooks/                   useCustomer, useGoBack, useOnlineStatus, useProfile, useTranslation
  lib/                     supabase client, ledger math, formatting, authErrors, translations, validation
supabase/schema.sql        Database tables + RLS policies
```

> The detailed file-by-file listing was moved to keep this section maintainable. See the `src/` folder for the full tree.

---

## How the numbers work

- A customer's **balance** = all their debts minus all their payments (computed from `transactions`, never stored, so it can't go out of sync).
- A balance is **"Lampas na"** (overdue) once it has been unpaid for `OVERDUE_DAYS` (default 14, set in `src/config.js`).
- Reports show the last 6 months and the customers who have owed the longest.

---

## Styling

All styles live in `src/styles.css` (plain CSS, no framework). If you have the original Figma Make stylesheet, you can paste it over this file: the class names are the same. Keep these classes, which are new: `.auth-error`, `.state-screen`, `.spinner`, `.spinner-dark`, `.toast-error`.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check the code with ESLint |

---

## 📝 Naming note

| Name | Where it appears |
|------|------------------|
| **Kuwenta** | Repository name (`Kuwenta-App`), README title, user-facing brand |
| **Kuewenta** | `package.json` `"name"` field, internal code references |
| **kuewenta** | Lowercase variant in some configs |

All three refer to the same project. The repo is **Kuwenta-App**; the npm package name is **kuewenta** (lowercase, no hyphen, valid for npm). The user-facing brand is **Kuwenta**.

---

## Not built yet

- Working offline (the app needs internet to save; an offline banner is shown)
- Editing or deleting customers and transactions
- Real SMS sending (the SMS button opens the phone's messaging app)
- PWA install support (manifest + service worker)
- Unit / E2E test suite