# Contributing to OG Event

Thank you for your interest in contributing to OG Event! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Commit Guidelines](#commit-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Project Structure](#project-structure)
7. [Testing](#testing)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** - For database and auth
- **Git** - Version control

### Setup

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd og-event
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run development server**:

   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch (if used)
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches
- `docs/*` - Documentation updates

### Creating a Feature

1. **Create a branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**:
   - Write code
   - Add tests (if applicable)
   - Update documentation

3. **Test locally**:

   ```bash
   npm run dev      # Test functionality
   npm run lint     # Check linting
   npm run format   # Format code
   ```

4. **Commit changes**:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Coding Standards

### TypeScript

✅ **Do**:

```typescript
// Use proper types from /types
import { Seat, Booking } from '@/types';

function processSeat(seat: Seat): void {
  // ...
}
```

❌ **Don't**:

```typescript
// Avoid 'any' types
function processSeat(seat: any) {
  // ...
}
```

### React Components

✅ **Do**:

```typescript
// Use proper TypeScript interfaces
interface SeatMapProps {
  seats: Seat[];
  onSelect: (seat: Seat) => void;
}

export function SeatMap({ seats, onSelect }: SeatMapProps) {
  // ...
}
```

❌ **Don't**:

```typescript
// Don't skip prop types
export function SeatMap({ seats, onSelect }) {
  // ...
}
```

### File Naming

- **Components**: PascalCase (`SeatMap.tsx`)
- **Utilities**: camelCase (`seatHelpers.ts`)
- **Types**: camelCase (`seat.ts`)
- **Constants**: UPPER_CASE (`API_ROUTES.ts`)

### Import Order

```typescript
// 1. External imports
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal types
import { Seat, Zone } from '@/types';

// 3. Internal components
import { Button } from '@/components/ui/button';

// 4. Internal utilities
import { calculatePrice } from '@/lib/utils';

// 5. Styles (if any)
import './styles.css';
```

### Code Formatting

- **Use Prettier**: All code must be formatted

  ```bash
  npm run format
  ```

- **Follow ESLint rules**: Fix all linting errors
  ```bash
  npm run lint
  ```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(seat-map): add zoom controls"

# Bug fix
git commit -m "fix(booking): prevent double booking"

# Documentation
git commit -m "docs(readme): update setup instructions"

# Refactor
git commit -m "refactor(api): consolidate error handling"
```

### Scope

Use the affected component or area:

- `seat-map`
- `booking`
- `admin`
- `api`
- `types`
- `docs`

---

## Pull Request Process

### Before Creating PR

✅ **Checklist**:

- [ ] Code is formatted (`npm run format`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run build`)
- [ ] Tested locally
- [ ] Documentation updated (if needed)
- [ ] Types added/updated (if needed)

### PR Title

Follow the same format as commit messages:

```
feat(seat-map): add zoom controls
```

### PR Description Template

```markdown
## What

Brief description of what this PR does.

## Why

Why is this change needed?

## How

How does it work? Any implementation details.

## Testing

How to test this change?

## Screenshots (if applicable)

Add screenshots for UI changes.

## Checklist

- [ ] Code formatted with Prettier
- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] Tested locally
- [ ] Documentation updated
```

### Review Process

1. **Create PR** with clear description
2. **Request review** from maintainers
3. **Address feedback** from reviewers
4. **Get approval** (1+ approvals required)
5. **Merge** (squash and merge preferred)

---

## Project Structure

### Key Directories

```
/app              # Next.js pages and API routes
/components       # React components
  /seat-map      # Seat selection system
  /ui            # Reusable UI components
/lib              # Utilities and helpers
/types            # TypeScript type definitions
/sql              # Database scripts
```

### Where to Add Code

**New Component**:

- Add to `/components` or feature-specific subfolder
- Import types from `/types`
- Export from component file

**New Type**:

- Add to appropriate file in `/types`
- Export from `/types/index.ts`

**New Utility**:

- Add to `/lib` or `/lib/utils.ts`
- Use TypeScript for type safety

**New API Route**:

- Add to `/app/api`
- Follow Next.js route handler pattern
- Use proper error handling

---

## Testing

### Current Status

- **Testing framework**: Not yet implemented
- **Future**: Jest + React Testing Library

### When Implemented

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { SeatMap } from './SeatMap';

describe('SeatMap', () => {
  it('renders seats correctly', () => {
    render(<SeatMap seats={mockSeats} onSelect={jest.fn()} />);
    expect(screen.getByText('Zone A')).toBeInTheDocument();
  });
});
```

---

## Code Review Guidelines

### For Reviewers

✅ **Check for**:

- Code quality and readability
- Proper TypeScript typing
- Component structure
- Performance considerations
- Security issues

❌ **Avoid**:

- Nitpicking minor style issues (Prettier handles this)
- Blocking on personal preferences
- Requesting changes without explanation

### For Contributors

✅ **Be open to**:

- Constructive feedback
- Suggestions for improvement
- Learning opportunities

❌ **Don't**:

- Take feedback personally
- Argue without understanding
- Rush to merge

---

## Getting Help

### Resources

- **README.md** - Project overview and setup
- **ARCHITECTURE.md** - System design and structure
- **REFACTOR_PLAN.md** - Ongoing improvements

### Communication

- **Issues** - Report bugs or request features
- **Discussions** - Ask questions or propose ideas
- **Pull Requests** - Submit code changes

---

## Code of Conduct

### Our Standards

✅ **Positive**:

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

❌ **Unacceptable**:

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing private information

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## Questions?

If you have questions not covered here:

1. Check existing documentation
2. Search issues and discussions
3. Create a new issue with the "question" label

Thank you for contributing! 🎉
