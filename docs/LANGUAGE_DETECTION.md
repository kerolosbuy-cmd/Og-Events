# Language Detection in the Application

This document explains how language detection and management works in the application.

## Overview

The application automatically detects the user's system language when they first visit the page and saves it locally. This information can then be used to display content in the user's preferred language.

## Implementation

### Core Components

1. **Language Utility** (`lib/language.ts`)
   - Detects the browser language
   - Saves and retrieves language preference from local storage
   - Initializes language detection on first visit

2. **Language Hook** (`hooks/useLanguage.ts`)
   - Provides a React hook for managing language state
   - Exposes methods to change the language

3. **Language Context** (`contexts/LanguageContext.tsx`)
   - Provides a React context to make language available throughout the app
   - Wrapped around the entire application in `layout.tsx`

4. **Language Selector Component** (`components/LanguageSelector.tsx`)
   - A UI component that allows users to change their language preference
   - Displays a dropdown with common language options

## How It Works

1. When a user first visits the application, the `initializeLanguage` function is called
2. This function checks if a language preference is already saved in local storage
3. If not found, it detects the browser language using `getBrowserLanguage`
4. The detected language is saved to local storage for future visits
5. The language is made available throughout the application via the `LanguageContext`

## Usage in Components

To use the language in a component:

```tsx
import { useLanguageContext } from '@/contexts/LanguageContext';

function MyComponent() {
  const { language, changeLanguage, isInitialized } = useLanguageContext();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Current language: {language}</p>
      <button onClick={() => changeLanguage('es')}>Switch to Spanish</button>
    </div>
  );
}
```

To add the language selector to a component:

```tsx
import { LanguageSelector } from '@/components/LanguageSelector';

function Header() {
  return (
    <header>
      <div className="logo">My App</div>
      <LanguageSelector className="ml-auto" />
    </header>
  );
}
```

## Supported Languages

The language selector includes the following languages by default:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)

You can extend this list by modifying the `languages` array in `components/LanguageSelector.tsx`.

## Notes

- The language preference is stored in the browser's local storage
- If local storage is not available, the application will fall back to the browser language
- The language detection only runs on the client side
