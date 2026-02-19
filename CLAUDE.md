# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoupDeJourTommy is a personal storytelling and food review platform. Content pillars: "Chronicles" (personal narratives) and food reviews. Users can create posts with images, follow each other, and subscribe to a newsletter.

**Firebase project:** `soupdejourtommy-ba24e` (region: `us-west1`)

## Commands

All commands run from the repo root:

```bash
npm run dev       # Start dev server (Next.js)
npm run build     # Production build
npm run start     # Run production server locally
npm run lint      # ESLint (next/core-web-vitals)
```

**Deploy to Firebase:**
```bash
firebase deploy
```

## Tech Stack

- **Framework**: Next.js 14.0.4 (App Router), React 18.2.0, TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.x with class-based dark mode
- **Backend/DB**: Firebase — Auth, Firestore, Cloud Storage
- **Hosting**: Firebase Hosting + Cloud Functions via `firebase-frameworks` (Next.js SSR)
- **Email**: Mailchimp via `react-mailchimp-subscribe`; newsletter API route at `app/api/subscribeUser.js`

> Note: `package-Toms.json` is an experimental version pinned to Next 16 / React 19. The canonical dependencies are in `package.json`.

## Path Alias

`@/*` resolves to the repo root (`./`), configured in `tsconfig.json`. Example: `import { auth } from "@/app/firebase"`.

## Repository Structure

```
/
├── app/
│   ├── admin/post/         ← Admin post creation (UID-gated)
│   ├── admin/reviews/      ← Admin reviews management
│   ├── api/subscribeUser.js ← Newsletter subscription API route
│   ├── components/         ← All React components
│   ├── context/AuthContext.js ← Auth state + Firebase auth methods
│   ├── firebase.js         ← Firebase SDK init (client-only guard)
│   ├── login/              ← Login page (.tsx)
│   ├── signup/             ← Signup page
│   ├── stories/[id]/       ← Dynamic story pages
│   ├── reviews/[id]/       ← Dynamic review pages
│   ├── profile/[userId]/   ← Dynamic user profiles
│   ├── utils/followActions.js ← Follow/unfollow Firestore helpers
│   ├── layout.jsx          ← Root layout (AuthContextProvider + Navbar)
│   └── globals.css         ← Tailwind base + CSS custom properties
├── constants/index.ts      ← Nav link definitions
├── data/reviews.json       ← Static review data (188 entries)
├── public/                 ← Static assets (images, SVGs)
├── firebase.json           ← Firebase hosting config (source: ".", frameworksBackend)
├── firestore.rules         ← Firestore security rules
├── firestore.indexes.json  ← Firestore composite indexes
├── next.config.js          ← images.unoptimized: true, undici external for SSR
├── tailwind.config.js      ← Custom design tokens + dark mode
└── tsconfig.json           ← strict: true, @/* alias → ./
```

## Architecture

### Authentication

`app/context/AuthContext.js` is the central auth layer, wrapping the app in `AuthContextProvider` and exposing the `UserAuth()` hook. Supports email/password and Google OAuth. On auth state change it opens a real-time `onSnapshot` on the user's Firestore document, so the `user` object always reflects the latest profile.

Available from `UserAuth()`: `{ user, emailSignIn, emailSignUp, googleSignIn, logOut }`.

### Firebase Initialization

`app/firebase.js` initializes Firebase **client-side only** (`typeof window !== 'undefined'`). Exports `auth`, `db`, `storage`. All components import from this file.

### Admin Access

`/admin/post` and `/admin/reviews` check a hardcoded `ADMIN_UID` constant in the component. This is client-side only — no server-side enforcement currently exists.

### Firestore Data Model

```
users/{uid}
  ├── username, birthday, avatarUrl, bio, createdAt
  ├── following/{targetUid}  → { followedAt }
  └── followers/{followerUid} → { followedAt }

posts/{postId}    → userId, username, avatarUrl, text, imageUrl, createdAt
stories/{storyId} → (Chronicles content)
reviews/{reviewId} → (Food review content)
```

### Follow System

`app/utils/followActions.js` exports `followUser` / `unfollowUser`. Each operation writes to both the current user's `following` subcollection and the target's `followers` subcollection via two separate writes (no transaction — a known gap).

## Tailwind Design Tokens

All colors are driven by CSS custom properties defined in `globals.css` and mapped in `tailwind.config.js`. Use these tokens rather than arbitrary colors:

| Token | Usage |
|---|---|
| `primary` | Primary brand color |
| `secondary` | Page background |
| `btns` | Button backgrounds |
| `btnText` | Button text |
| `bkg2` | Secondary background |
| `tertiary` | Tertiary UI elements |
| `highlights` | Accent/highlight |
| `input` | Input field backgrounds |
| `pinkish` | Pink accent |
| `permblack` | Always-black (ignores dark mode) |
| `mellowblue` / `darkmellowblue` | Mellow blue pair |
| `mellowgreen` / `darkmellowgreen` | Mellow green pair |
| `mellowpurple` / `darkmellowpurple` | Mellow purple pair |
| `mellowred` / `darkmellowred` | Mellow red pair |
| `mellowturquoise` / `darkmellowturquoise` | Mellow turquoise pair |

Custom breakpoints: `xs` (400px), `3xl` (1680px), `4xl` (2200px).
Dark mode strategy: `class` (toggle by adding `dark` class to `<html>`).

## Firestore Security Rules

**Current state:** `firestore.rules` is set to `allow read, write: if false` — a complete lockdown placeholder. The app relies on client-side Firebase SDK with permissive rules in the Firebase console (not yet committed to this file). Before deploying rules changes, verify the console rules match what the app needs.

## Environment Variables

Required in `.env.local` (root):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_MAILCHIMP_URL
```
