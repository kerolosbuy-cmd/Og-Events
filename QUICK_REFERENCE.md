# OG Event - Quick Reference Guide

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Run production build

# Code Quality
npm run lint             # Check linting
npm run format           # Format all files
npm run format:check     # Check formatting without changes

# Git
git commit -m "feat: ..."  # Pre-commit hook runs automatically
```

## 📁 Import Patterns

```typescript
// Types (centralized)
import { Seat, Booking, ApiResponse } from '@/types';

// Components
import { PrivateImage } from '@/components/booking';
import { Button } from '@/components/ui/button';

// Constants
import { BOOKING_STATUSES, API_ROUTES } from '@/lib/constants';

// Utilities
import { cn } from '@/lib/utils';
```

## 🗂️ Project Structure

```
/app              - Next.js App Router (pages & API routes)
/components
  /booking        - Booking-related components
  /seat-map       - Seat selection system
  /ui             - Shared UI components
/types            - Centralized TypeScript types
/lib
  /constants      - App constants
  /hooks          - Custom React hooks
  /supabase       - Supabase clients
/sql              - Database scripts
```

## 🔑 Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📝 Coding Standards

- **TypeScript**: Use types from `@/types`, avoid `any`
- **Components**: Use PascalCase, add prop types
- **Functions**: Use camelCase, add JSDoc comments
- **Commits**: Follow conventional commits (`feat:`, `fix:`, etc.)
- **Formatting**: Prettier runs on pre-commit automatically

## 🔗 Quick Links

- [Architecture Documentation](./ARCHITECTURE.md) - System design
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Refactor Plan](./REFACTOR_PLAN.md) - Improvement roadmap

## 🐛 Common Issues

**Build errors?**

```bash
npm install
rm -rf .next
npm run build
```

**Environment issues?**

```bash
cp .env.example .env.local
# Add your Supabase credentials
```

**Type errors?**

- Check imports use `@/types`
- Run `npm run build` to see all errors

## 💡 Tips

- Pre-commit hooks auto-format and lint
- Use `cn()` for conditional Tailwind classes
- Import constants instead of magic strings
- Add JSDoc to complex functions
- Check ARCHITECTURE.md for system design
