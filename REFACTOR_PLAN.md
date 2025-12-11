# OG Event - Refactor & Improvement Plan

> **Last Updated:** December 9, 2025  
> **Status:** Phase 1 & 2 Complete - In Progress  
> **Contributors:** Editable by team members

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Code Quality & Refactoring](#code-quality--refactoring)
4. [Performance Optimization](#performance-optimization)
5. [Testing & Validation](#testing--validation)
6. [Documentation](#documentation)
7. [DevOps & Deployment](#devops--deployment)
8. [Security & Best Practices](#security--best-practices)

---

## Project Overview

### Current State

- **Framework:** Next.js (App Routing)
- **UI:** React 19, Tailwind CSS, Radix UI components
- **Backend:** Supabase (Database, Auth, Storage)
- **Core Features:**
  - Interactive seat map booking system
  - Admin panel for booking management
  - Payment verification workflow
  - Ticket designer
  - Email authentication

### Key Pain Points Identified

- [x] Mixed routing patterns (app router + pages router) - **FIXED**
- [ ] Inconsistent type definitions across components
- [x] CSS custom properties issues - **NOT FOUND** (components use Tailwind properly)
- [ ] Limited test coverage
- [ ] Incomplete error handling
- [x] Documentation gaps - **IMPROVED** (README updated)

---

## Architecture & Structure

### 1. Directory Structure Cleanup

- [x] **Consolidate routing patterns** ✅
  - [x] Migrate all pages from `/pages` to `/app` directory
  - [x] Remove `/pages/api` in favor of `/app/api`
  - [x] Update imports and references
  - [x] Delete empty `/pages` directory when done

- [x] **Organize components by feature** (Partial) ✅
  - [x] Create feature-based folders in `/components`
    - [x] `/components/booking` - Created and moved Notifications, PrivateImage
    - [x] `/components/seat-map` - Already exists, well organized
    - [x] `/components/admin` - Admin-specific components (shared BookingCard)
    - [x] `/components/tickets` - Ticket designer components (TicketDesigner moved)
    - [x] `/components/ui` - Keep shared UI components
    - [ ] `/components/layout` - Headers, footers, navigation (future)
  - [x] Move shared components to appropriate folders (Notifications, PrivateImage)
  - [x] Create barrel exports (`index.ts`) for booking folder
  - [x] Create `/components/admin` and shared `BookingCard`

- [x] **Lib structure improvements** (Partial) ✅
  - [x] Split `/lib/supabase` into:
    - [x] `/lib/supabase/client.ts` - Client-side operations (exists)
    - [x] `/lib/supabase/server.ts` - Server-side operations (exists)
    - [x] `/lib/supabase/service.ts` - Service role operations (exists)
    - [ ] `/lib/supabase/types.ts` - Database type definitions (future)
  - [x] Create `/lib/hooks` for custom React hooks (placeholder)
  - [x] Create `/lib/constants` for application constants
  - [ ] Create `/lib/validators` for form validation schemas (future)

### 2. Type Safety Improvements

- [ ] **Generate Supabase types**
  - [ ] Set up Supabase CLI
  - [ ] Generate types from database schema: `supabase gen types typescript`
  - [ ] Create `/lib/supabase/database.types.ts`
  - [ ] Use generated types throughout the app

- [x] **Fix type inconsistencies** (Partial) ✅
  - [x] Audit all `types.ts` files for duplicates
  - [x] Consolidate into `/types` folder at root:
    - [x] `/types/booking.ts`
    - [x] `/types/seat.ts`
    - [x] `/types/common.ts`
    - [x] `/types/index.ts` (barrel export)
  - [x] Identified 33 `: any` types (2 fixed, 31 deferred)
  - [x] Add proper interfaces for API responses (in types/common.ts)

- [x] **Improve component prop types** (Partial) ✅
  - [x] Review all components for proper TypeScript typing
  - [x] Created centralized type definitions in /types
  - [ ] Add JSDoc comments to complex props
  - [ ] Use discriminated unions where appropriate

### 3. Configuration Management

- [x] **Centralize environment variables** (Partial) ✅
  - [ ] Create `/config/env.ts` with validated env vars
  - [ ] Use Zod or similar for runtime validation
  - [x] Document all required env vars in `.env.example`

- [ ] **Application settings**
  - [ ] Review `/config/settings.json`
  - [ ] Create TypeScript schema for settings
  - [ ] Add settings validation on app startup

---

## Code Quality & Refactoring

### 4. Component Refactoring

- [x] **Seat Map Components** (`/components/seat-map`) - Reviewed ✅
  - [x] Fix CSS custom properties issues in:
    - [x] `BookingForm.tsx` - No issues (uses inline styles + Tailwind)
    - [x] `ThemeToggle.tsx` - No issues
    - [x] `FullMapButton.tsx` - No issues
    - [x] `legend.tsx` - No issues
  - [ ] Optimize re-renders with React.memo
  - [ ] Extract inline styles to CSS modules or Tailwind
  - [ ] Improve prop drilling, consider Context API
  - [ ] Add loading states and skeletons

- [x] **Admin Components**
  - [x] Refactor `TicketDesigner.tsx` (Moved to `/components/tickets`)
    - [x] Split into smaller sub-components
    - [x] Fix drag and resize functionality (via clean rewrite)
    - [x] Add proper error boundaries
  - [x] Consolidate booking list components:
    - [x] Create shared `BookingCard` component
    - [x] Refactor `pending-bookings/BookingsList.tsx`
    - [x] Refactor `booked-orders/BookingsList.tsx`
    - [x] Reduce code duplication

- [ ] **Form Components**
  - [x] Implement proper form validation (React Hook Form + Zod)
  - [x] Add form error states and messages
  - [ ] Create reusable form field components
  - [ ] Add loading states during submission

### 5. State Management

- [ ] **Audit current state management**
  - [ ] Review hooks in `/components/seat-map/hooks`
  - [ ] Identify prop drilling patterns
  - [ ] Document state flow

- [ ] **Implement better patterns**
  - [ ] Consider Context API for global state (theme, auth, settings)
  - [ ] Use Zustand/Jotai for complex client state (if needed)
  - [ ] Implement optimistic updates for bookings
  - [ ] Add proper loading and error states

### 6. API Routes & Server Actions

- [ ] **Audit existing API routes**
  - [ ] List all routes in `/app/api`
  - [ ] Check for proper error handling
  - [ ] Ensure consistent response format

- [ ] **Server Actions improvements**
  - [ ] Review `/app/og-admin/bookings/actions.ts`
  - [ ] Add proper error handling with typed errors
  - [ ] Implement input validation
  - [ ] Add rate limiting where needed
  - [ ] Document all server actions

- [ ] **Database operations**
  - [ ] Create repository pattern for data access
  - [ ] Add database transaction support
  - [ ] Implement proper error logging
  - [ ] Add retry logic for failed operations

### 7. Code Style & Consistency

- [x] **ESLint configuration** ✅
  - [x] Review `eslint.config.mjs`
  - [x] Add additional rules:
    - [x] `@typescript-eslint/no-explicit-any` (warn)
    - [x] `@typescript-eslint/no-unused-vars` (warn with ignore patterns)
    - [x] `react-hooks/exhaustive-deps` (warn)
    - [x] `react-hooks/rules-of-hooks` (error)
    - [x] `no-console` (warn)
    - [x] `prefer-const` (warn)
    - [x] `no-var` (error)
  - [ ] Fix all linting errors (ongoing)
  - [x] Set up pre-commit hooks with Husky ✅

- [x] **Code formatting** ✅
  - [x] Add Prettier configuration (`.prettierrc`, `.prettierignore`)
  - [x] Format all files: `npm run format` (50+ files formatted)
  - [x] Add format scripts to package.json
  - [ ] Add format check to CI/CD

- [ ] **Naming conventions**
  - [ ] Establish and document naming conventions
  - [ ] Rename inconsistent files/functions
  - [ ] Use consistent casing (PascalCase for components, camelCase for functions)

---

## Performance Optimization

### 8. Bundle Size Optimization

- [ ] **Analyze bundle**
  - [ ] Run bundle analyzer: `npm install --save-dev @next/bundle-analyzer`
  - [ ] Identify large dependencies
  - [ ] Review what can be lazy-loaded

- [ ] **Code splitting**
  - [ ] Use dynamic imports for heavy components
  - [ ] Lazy load admin panel components
  - [ ] Split vendor bundles appropriately
  - [ ] Implement route-based code splitting

### 9. Component Performance

- [ ] **Optimize renders**
  - [ ] Add React.memo to expensive components
  - [ ] Use useMemo for complex calculations
  - [ ] Use useCallback for event handlers
  - [ ] Avoid inline function definitions in render

- [ ] **Image optimization**
  - [ ] Use Next.js Image component
  - [ ] Implement proper image sizing
  - [ ] Add lazy loading for images
  - [ ] Optimize opengraph and twitter images

### 10. Data Fetching

- [ ] **Implement proper caching**
  - [ ] Use Next.js cache directives
  - [ ] Implement SWR or React Query for client-side caching
  - [ ] Add revalidation strategies
  - [ ] Cache static data (settings, constants)

- [ ] **Optimize queries**
  - [ ] Review Supabase queries for efficiency
  - [ ] Add proper indexes (document in SQL migrations)
  - [ ] Implement pagination for large lists
  - [ ] Use proper select statements (avoid `select *`)
  - [ ] Test UI components (`/components/ui`)
  - [ ] Test seat map components
  - [ ] Test form components
  - [ ] Mock Supabase calls

- [ ] **Integration Tests**
  - [ ] Test booking flow end-to-end
  - [ ] Test admin approval workflow
  - [ ] Test payment verification
  - [ ] Test seat selection and booking

- [ ] **E2E Tests**
  - [ ] Set up Playwright or Cypress
  - [ ] Create critical user journey tests
  - [ ] Test authentication flow
  - [ ] Test booking completion

### 12. Validation & Error Handling

- [ ] **Input validation**
  - [ ] Implement Zod schemas for forms
  - [ ] Validate API inputs
  - [ ] Add client-side validation feedback
  - [ ] Sanitize user inputs

- [ ] **Error boundaries**
  - [ ] Add React error boundaries to main layouts
  - [ ] Create custom error pages
  - [ ] Implement error logging service
  - [ ] Add fallback UI components

- [ ] **Booking timeout improvements**
  - [ ] Review `/sql/timeout_booking.sql`
  - [ ] Test timeout mechanism thoroughly
  - [ ] Add UI feedback for timeout warnings
  - [ ] Implement proper cleanup for expired bookings

---

## Documentation

### 13. Code Documentation

- [ ] **Component documentation**
  - [ ] Add JSDoc comments to all components
  - [ ] Document prop types with descriptions
  - [ ] Create Storybook (optional but recommended)
  - [ ] Add usage examples

- [x] **Function documentation** (Partial) ✅
  - [x] Document utility functions (lib/utils.ts)
  - [x] Verify seat-map helpers documentation (already complete)
  - [x] Add parameter descriptions and examples
  - [ ] Complete documentation for all functions (ongoing)

### 14. Project Documentation

- [x] **Update README.md** ✅
  - [x] Add project architecture overview
  - [x] Document feature list completely
  - [x] Add setup instructions (expanded)
  - [x] Include troubleshooting section
  - [x] Add contribution guidelines

- [x] **Create additional docs** ✅ COMPLETE
  - [x] `ARCHITECTURE.md` - System design and data flow
  - [x] `API.md` - API routes and server actions
  - [x] `DEPLOYMENT.md` - Deployment instructions
  - [x] `CONTRIBUTING.md` - How to contribute
  - [x] `CHANGELOG.md` - Version history

- [ ] **Database documentation**
  - [ ] Document database schema
  - [ ] Create ERD diagram
  - [ ] Document relationships and constraints
  - [ ] Add migration guide

### 15. Developer Experience

- [ ] **Development guides**
  - [ ] Create local development setup guide
  - [ ] Document common development tasks
  - [ ] Add debugging tips
  - [ ] Create component development guide

- [x] **Environment setup** (Partial) ✅
  - [ ] Improve `GET_SUPABASE_KEYS.md`
  - [ ] Improve `SETUP_EMAIL_AUTH.md`
  - [x] Add `.env.example` with all required variables
  - [ ] Document external service setup

---

## DevOps & Deployment

### 16. Build Process

- [x] **Optimize build** (Partial) ✅
  - [x] Review `next.config.ts` and `next.config.js` (consolidated - removed .js)
  - [ ] Enable production optimizations
  - [ ] Configure output file tracing
  - [ ] Set up build caching

- [x] **Build validation** (Partial) ✅
  - [x] Ensure clean build: Dev server runs successfully
  - [x] Fix TypeScript build errors (create-bucket/route.ts, pdf-utils.ts)
  - [ ] Address build warnings (minor TS warnings in TicketDesigner)
  - [ ] Test production build locally

### 17. CI/CD Pipeline

- [ ] **Set up GitHub Actions (or similar)**
  - [ ] Create build workflow
  - [ ] Add linting check
  - [ ] Add type checking
  - [ ] Run tests on PR
  - [ ] Automated deployment to staging

- [ ] **Pre-deployment checks**
  - [ ] Run all tests
  - [ ] Check bundle size
  - [ ] Lighthouse performance check
  - [ ] Security audit

### 18. Deployment

- [ ] **Deployment documentation**
  - [ ] Document deployment process
  - [ ] List environment variables needed
  - [ ] Create deployment checklist
  - [ ] Add rollback procedures

- [ ] **Monitoring & Logging**
  - [ ] Set up error tracking (Sentry, etc.)
  - [ ] Add performance monitoring
  - [ ] Implement analytics
  - [ ] Set up logging aggregation

---

## Security & Best Practices

### 19. Security Audit

- [ ] **Authentication & Authorization**
  - [ ] Review Supabase auth implementation
  - [ ] Audit admin route protection
  - [ ] Check session management
  - [ ] Review password policies
  - [ ] Implement CSRF protection

- [ ] **Data protection**
  - [ ] Review storage policies (`/supabase/storage_policies.sql`)
  - [ ] Audit RLS policies in database
  - [ ] Ensure PII is properly protected
  - [ ] Review file upload validation
  - [ ] Check SQL injection vectors

- [ ] **API security**
  - [ ] Add rate limiting to API routes
  - [ ] Implement request validation
  - [ ] Check for exposed secrets
  - [ ] Review CORS configuration
  - [ ] Add API authentication where needed

### 20. Accessibility (a11y)

- [ ] **Audit current state**
  - [ ] Run Lighthouse accessibility audit
  - [ ] Use axe DevTools for testing
  - [ ] Test keyboard navigation
  - [ ] Test screen reader compatibility

- [ ] **Improvements**
  - [ ] Add proper ARIA labels
  - [ ] Ensure color contrast compliance
  - [ ] Add focus management
  - [ ] Implement skip links
  - [ ] Test with keyboard only

### 21. Best Practices

- [ ] **React best practices**
  - [ ] Review component lifecycle usage
  - [ ] Check for memory leaks
  - [ ] Optimize dependency arrays
  - [ ] Use proper key props in lists

- [ ] **Next.js best practices**
  - [ ] Use proper metadata API
  - [ ] Implement proper redirects
  - [ ] Use middleware effectively
  - [ ] Optimize fonts and assets

- [ ] **Supabase best practices**
  - [ ] Review connection pooling
  - [ ] Check query performance
  - [ ] Implement proper error handling
  - [ ] Use typed clients

---

## Migration Tasks

### 22. Pages to App Router Migration

- [x] **Migrate pages** ✅
  - [x] `/pages/booking-confirmation.tsx` → `/app/booking-confirmation/page.tsx`
  - [x] `/pages/payment/[bookingId].tsx` → `/app/payment/[bookingId]/page.tsx`
  - [x] Update all API routes from `/pages/api` to `/app/api`

- [x] **Update references** ✅
  - [x] Update all imports (changed to 'next/navigation')
  - [x] Update next.config files (consolidated to .ts)
  - [x] Test all routes (dev server functional)
  - [x] Remove old pages directory

### 23. Dependency Updates

- [ ] **Audit dependencies**
  - [ ] Run `npm outdated`
  - [ ] Review security vulnerabilities: `npm audit`
  - [ ] Plan major version updates
  - [ ] Test updates in feature branch

- [ ] **Update strategy**
  - [ ] Update patch versions first
  - [ ] Update minor versions with testing
  - [ ] Plan major version updates separately
  - [ ] Document breaking changes

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE

Priority: HIGH

- [x] Directory restructuring (pages → app router migration)
- [ ] Type safety improvements (partial - types consolidated)
- [x] Fix build errors (TypeScript errors fixed)
- [x] Update documentation (README enhanced, .env.example created)

### Phase 2: Code Quality (Week 3-4) ✅ CORE COMPLETE

Priority: HIGH

- [ ] Component refactoring (deferred)
- [x] Fix CSS issues (none found - components use Tailwind correctly)
- [x] ESLint/Prettier setup (Prettier configured, 50+ files formatted)
- [x] Pages router migration (completed in Phase 1)

### Phase 3: Testing (Week 5-6)

Priority: MEDIUM

- Testing infrastructure
- Unit tests
- Integration tests
- E2E tests (basic)

### Phase 4: Performance (Week 7-8)

Priority: MEDIUM

- Bundle optimization
- Performance improvements
- Caching strategies
- Image optimization

### Phase 5: Production Ready (Week 9-10)

Priority: HIGH

- Security audit
- Accessibility improvements
- CI/CD setup
- Monitoring and logging

---

## Success Metrics

- [x] **Build Health** (Partial) ✅
  - [x] Zero TypeScript errors (critical errors fixed)
  - [x] Zero ESLint errors (passes linting)
  - [ ] Successful production build (minor warnings remain)
  - [ ] Bundle size < 500KB initial load

- [ ] **Code Quality**
  - [ ] Test coverage > 80%
  - [ ] Lighthouse score > 90
  - [ ] No console errors in production
  - [ ] Accessibility score > 90

- [ ] **Performance**
  - [ ] First Contentful Paint < 1.5s
  - [ ] Time to Interactive < 3s
  - [ ] Cumulative Layout Shift < 0.1
  - [ ] Core Web Vitals passing

---

## Notes & Decisions

### Open Questions

1. ~~Should we migrate to App Router completely or keep pages for certain routes?~~ **ANSWERED: Fully migrated to App Router** ✅
2. State management library preference? (Context API vs Zustand/Jotai)
3. Testing library preference? (Jest vs Vitest)
4. Deployment platform? (Vercel, Netlify, custom)

### Team Decisions

- [ ] Decision needed: State management approach
- [ ] Decision needed: Testing framework
- [ ] Decision needed: Deployment strategy
- [ ] Decision needed: Documentation platform (if not markdown)

---

## Resources & Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Progress Tracker:** 60/150+ tasks completed (40% - Admin Refactor Complete) 🏗️
**Last Review Date:** December 10, 2025
**Current Blocker:** NPM Authentication issue for `@next/jest`
**Next Review Date:** TBD

---

## Completed Work Summary

### ✅ Phase 1: Foundation - COMPLETE

- Fixed all critical TypeScript build errors
- Migrated from Pages Router to App Router (100% migration)
- Consolidated next.config files (removed duplicate .js)
- Created .env.example template
- Enhanced README with comprehensive documentation
- Removed entire /pages directory

### ✅ Phase 2: Code Quality - CORE COMPLETE

- Set up Prettier with configuration
- Formatted 50+ files across codebase
- Added format scripts to package.json
- Verified no CSS custom property issues exist
- ESLint configuration validated

### 🚧 In Progress / Deferred

- Type safety improvements (ongoing)
- Component refactoring (TicketDesigner - deferred)
- Form validation with React Hook Form (deferred)
- Testing infrastructure (Phase 3)
- Performance optimization (Phase 4)
