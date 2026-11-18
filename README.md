# Visitor Hub

<<<<<<< HEAD
Visitor Hub is a React single-page web application for browsing events, registering attendees, managing event passes, and viewing registration tickets. This README documents the **client application only**.
=======
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules...
>>>>>>> 1e7b66ba5b6bd837f71481e7df1033db121d2aba

The client sends HTTP requests to an API service for user, event, registration, payment, and QR-verification data. The API base address is configured in `src/lib/api.js`.

## Contents

- [Client structure](#client-structure)
- [Features](#features)
- [Routes](#routes)
- [Technology](#technology)
- [Requirements](#requirements)
- [Install and run](#install-and-run)
- [API address and client integration](#api-address-and-client-integration)
- [Authentication in the client](#authentication-in-the-client)
- [Development scripts](#development-scripts)
- [Troubleshooting](#troubleshooting)
- [Client deployment checklist](#client-deployment-checklist)

## Client structure

```text
client/my-app/
  index.html                HTML document and app mount point
  vite.config.js            Vite, React, Tailwind plugin, and @ alias setup
  package.json              Dependencies and npm scripts
  public/
    favicon.svg             Browser icon
    icons.svg               Shared SVG icons
    images/                 Images used by the pages
  src/
    main.jsx                React entry point and BrowserRouter
    App.jsx                 Route definitions and shared navbar
    App.css                 Application styles
    index.css               Tailwind imports, theme, and global styles
    Component/              Pages and feature components
    Identify/               Identity-verification UI components
    components/ui/          Shared button, card, and carousel components
    lib/
      api.js                API base URL
      auth.js               JWT role and expiration parsing
      utils.js              Shared helpers
```

### Main components

All page components are in `src/Component/`.

| Component | Client-side responsibility |
| --- | --- |
| `Mainpage.jsx` | Composes the public home page. |
| `Firstpage.jsx`, `Carousel.jsx`, `Secondpage.jsx`, `Footer.jsx` | Home-page sections, including featured content and event browsing. |
| `Navbar.jsx` | Main navigation, user information, and sign-out controls. |
| `Login.jsx`, `Register.jsx`, `Verifyemail.jsx` | Sign-in, account-registration, and email-verification screens. |
| `Forgetpassword.jsx`, `Resetpassw.jsx` | Password recovery and reset screens. |
| `Profile.jsx`, `Registrations.jsx`, `View.jsx` | Profile, a user's registrations, and an individual registration/ticket view. |
| `Registrationform.jsx`, `Payment.jsx` | Event registration and payment-review UI. |
| `Adminpnanel.jsx` | Admin dashboard and event management. The filename spelling matches the source. |
| `Passes.jsx` | Pass management for an event. |
| `Registreduser.jsx`, `TotalregUser.jsx`, `Viewregs.jsx` | Event attendees, all registrations, and individual registration details. |
| `Scanqr.jsx` | QR scanning and manual code entry for registration verification. |
| `Deletedthings.jsx`, `Deletedevents.jsx`, `Deletedpass.jsx`, `Deletedregs.jsx` | Admin archive screens for events, passes, and registrations. |
| `Aboutus.jsx`, `Contact.jsx` | About and contact pages. |
| `Protectedroute.jsx`, `Unauthorized.jsx` | Client route checks and the access-denied screen. |
| `Identity.jsx` and `src/Identify/` | Additional identity-verification UI; routes are not currently registered in `App.jsx`. |

## Features

### Visitor and attendee workflows

- Browse featured and upcoming events from the home page.
- Create an account, complete the verification UI, sign in, and use password-recovery screens.
- Select an event pass and submit an event registration.
- Review a registration in the payment screen.
- View profile details and the user's registrations.
- Open registration details and display a QR-code ticket when the API response includes a QR token.
- Browse the About and Contact pages.

### Admin workflows

- View event dashboard information and search/filter events.
- Create, edit, and delete events.
- Open pass management for an event.
- Browse attendees for a selected event or search all registrations.
- View registration details and manage deleted records.
- Restore or permanently delete archived events, passes, and registrations.
- Scan a QR code with a camera or enter a code manually.

The event and registration screens include responsive layouts. Registration lists support paging, and some admin lists include search and filtering.

## Routes

Routes are declared in `src/App.jsx`. The paths below reflect the current source, including legacy spellings.

| Path | Client screen / access |
| --- | --- |
| `/` | Public home page |
| `/verifyemail` | Email-verification screen |
| `/login` | Sign-in |
| `/register` | Account registration |
| `/forgetpass` | Forgot password |
| `/resetpassw` | Reset password |
| `/aboutus` | About page |
| `/contactus` | Contact page |
| `/admin` | Admin-only dashboard |
| `/passes/:id` | Admin-only pass management for an event |
| `/registrations/:id` | Admin-only attendee list for an event |
| `/allreguser` | Admin-only all-registrations list |
| `/deletedthings` | Admin-only archive; redirects to its Events section |
| `/deletedthings/events` | Admin-only deleted events |
| `/deletedthings/passes` | Admin-only deleted passes |
| `/deletedthings/registrations` | Admin-only deleted registrations |
| `/regstrationform/:id` | User/admin event-registration form |
| `/reguser/:id` | Admin-only registration details |
| `/view/:id` | User/admin registration or ticket view |
| `/scanqr` | Admin-only QR scanner |
| `/unauthorized` | Access-denied screen |
| `/profile` | Profile |
| `/registraions` | User registrations (route spelling as implemented) |
| `/payment/:id` | Payment screen |

The navbar is hidden on selected admin, profile, scanner, and archive screens. A few identity-verification routes and older route alternatives are commented out or not connected in `App.jsx`.

## Technology

- **React 19** and React DOM
- **Vite 8** for development and production builds
- **React Router 7** for client-side navigation
- **Tailwind CSS 4** and `tw-animate-css` for styling
- **Axios** for HTTP requests
- **Lucide React** and **React Icons** for icons
- **Embla Carousel** for carousel behavior
- **html5-qrcode** for camera-based QR scanning
- **qrcode.react** for QR rendering
- **Base UI**, **Material UI**, and shared shadcn-style UI primitives
- **Geist Variable** font

The Vite configuration provides the `@` alias for `src/`, React support, and Tailwind's Vite plugin. Global styles and theme tokens are in `src/index.css`.

## Requirements

- Node.js and npm compatible with the versions in `package.json`.
- An API service reachable from the browser for data and account workflows.
- Camera permission and a secure browser context (HTTPS or localhost) for camera QR scanning. Manual code entry is available on the scanner screen.

## Install and run

Run these commands from `client/my-app/`:

```sh
npm install
npm run dev
```

Vite prints the development URL in the terminal (normally `http://localhost:5173`). Open it in a browser.

## API address and client integration

The API base URL is exported from `src/lib/api.js` and used by the client components. It is currently a hard-coded local-network address on port `3000`; the client does not currently load it from an environment variable. Change it to the base URL reachable from the browser before running the application in another environment.

The client code makes requests for routes in these areas:

- Events and event detail: `/events`, `/events/:id`
- Event passes: `/events/:id/passes`
- Event registration: `/events/:id/register`
- Registration lists, details, deletion, archive, restoration, and QR verification: `/events/registrations...`
- Authentication and verification: `/auth/...`
- User profile and registered events: `/user/...`
- Payment information and actions: `/payment/...`

The service configured in `API_URL` must support the specific paths, HTTP methods, authorization headers, and response shapes used by the corresponding component. The frontend package contains the user interface and API calls, not the implementation of those services.

## Authentication in the client

- The client stores the sign-in token in browser `localStorage` under `token`.
- Registration/verification UI uses a separate `registerToken`.
- `src/lib/auth.js` decodes the token to read the role and expiration.
- `Protectedroute.jsx` checks token presence/validity and, for restricted routes, whether the role is allowed.
- The client recognizes `user` and `admin`; admin routes require the `admin` role.
- Client-side checks only control what the UI displays. The API service must independently authorize requests.

## Development scripts

Run from `client/my-app/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the optimized production bundle in `dist/`. |
| `npm run preview` | Preview a production build locally; run `npm run build` first. |
| `npm run lint` | Run ESLint across the client source. |

There is no frontend test script configured in `package.json`.

## Troubleshooting

### API or network error

Check `src/lib/api.js`, make sure the configured address is reachable from the browser, and confirm the API supports the exact route and response format requested by the screen.

### Login or protected page does not work

Check that sign-in returned a token and that it is stored in `localStorage` under `token`. Admin pages require a token whose role claim is `admin`. The API service must also allow the authenticated request.

### QR scanner cannot open the camera

Allow camera access in the browser and open the application from localhost or HTTPS. If camera access is unavailable, use manual code entry where offered.

### Images or icons are missing

Check paths under `public/` (referenced from the site root) and imports from `src/assets/`. Vite serves files in `public/` without including the `public` directory in the URL.

## Client deployment checklist

- Set the API base URL for the target environment; avoid relying on a developer's local-network address.
- Build and preview the client with `npm run build` and `npm run preview`.
- Serve the app over HTTPS when deployed and confirm camera access works on the target domain.
- Verify that all required API calls work from the deployed origin and that the API permits that origin.
- Ensure the API enforces authorization independently of client route checks.
- Confirm payment processing, QR verification, and password recovery are backed by the appropriate API services; the corresponding client screens alone do not provide those services.
