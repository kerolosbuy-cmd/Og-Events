import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and merges Tailwind classes
 *
 * @param inputs - Class names, objects, or arrays to combine
 * @returns Merged className string with resolved Tailwind conflicts
 *
 * @example
 * ```typescript
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', isActive && 'text-blue-500') // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if required Supabase environment variables are set
 *
 * @returns true if both SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are defined
 *
 * @example
 * ```typescript
 * if (!hasEnvVars) {
 *   console.error('Missing Supabase configuration');
 * }
 * ```
 */
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
