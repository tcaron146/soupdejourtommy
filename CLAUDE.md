# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoupDeJourTommy is a personal storytelling and food review platform. It has two content pillars: "Chronicles" (personal narratives) and food reviews. Users can create posts with images, follow each other, and subscribe to a newsletter.

## Repository Structure

The source code lives at the repo root, but the build tooling (package.json, next.config.js) lives inside `.firebase/soupdejourtommy-ba24e/functions/`. This is the Firebase frameworks deployment directory.

```
/                                         ← git root (source files)
├── app/                                  ← Next.js App Router source
│   ├── components/                       ← React components
│   ├── context/AuthContext.js            ← Auth state & Firebase auth methods
│   ├── firebase.js                       ← Firebase SDK init (client-only)
│   ├── admin/                            ← Admin-only post creation routes
│   ├── stories/[id]/                     ← Dynamic story pages
│   ├── reviews/[id]/                     ← Dynamic review pages
│   ├── profile/[userId]/                 ← Dynamic user profiles
│   ├── layout.jsx                        ← Root layout (wraps with AuthContextProvider)
│   └── utils/followActions.js            ← Follow/unfollow Firestore helpers
├── constants/index.ts                    ← Nav link definitions
├── data/reviews.json                     ← Static review data
├── dist/                                 ← GitHub Pages build output
└── .firebase/soupdejourtommy-ba24e/functions/  ← Firebase deploy dir
    ├── package.json                      ← npm dependencies & scripts
    ├── next.config.js                    ← Next.js config
    ├── server.js                         ← Firebase Functions entry
    └── public/                           ← Static assets (images, SVGs)
```

## Development Commands

All npm commands must be run from `.firebase/soupdejourtommy-ba24e/functions/`:

```bash
cd .firebase/soupdejourtommy-ba24e/functions

npm install          # Install dependencies
npx next dev         # Start dev server
npx next build       # Production build
```

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Backend/DB**: Firebase — Auth, Firestore, Cloud Storage
- **Styling**: Tailwind CSS
- **Hosting**: Firebase Hosting + Cloud Functions (deployed via `firebase-frameworks`)
- **CI/CD**: GitHub Actions → GitHub Pages (builds from repo root, deploys `./dist`)

## Architecture

### Authentication

`app/context/AuthContext.js` is the central auth layer. It wraps the app in `AuthContextProvider` and exposes the `UserAuth()` hook. It supports email/password and Google OAuth sign-in. On auth state change, it opens a real-time `onSnapshot` listener on the user's Firestore document, so `user` state always reflects the latest profile data.

### Firebase Initialization

`app/firebase.js` initializes Firebase only on the client (`typeof window !== 'undefined'`). It exports `auth`, `db`, and `storage`. All Firestore/Storage operations in components import from this file.

### Admin Access

`/admin/post` and `/admin/reviews` check against a hardcoded `ADMIN_UID` constant to restrict access. Only that UID can submit posts.

### Firestore Data Model

```
users/{uid}
  ├── username, birthday, avatarUrl, bio, createdAt
  ├── following/{targetUid} → { followedAt }
  └── followers/{followerUid} → { followedAt }

posts/{postId}
  └── userId, username, avatarUrl, text, imageUrl, createdAt

stories/{storyId}   (Chronicles content)
reviews/{reviewId}  (Food review content)
```

### Follow System

`app/utils/followActions.js` exports `followUser` and `unfollowUser`. Each follow writes to both the current user's `following` subcollection and the target's `followers` subcollection atomically via two `setDoc`/`deleteDoc` calls.

## Environment Variables

Required in `.firebase/soupdejourtommy-ba24e/functions/.env.local`:

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
