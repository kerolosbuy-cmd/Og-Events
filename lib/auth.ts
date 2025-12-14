import { User } from '@supabase/supabase-js';

/**
 * A list of authorized admin emails.
 * If you want to allow any authenticated user to access admin pages,
 * leave this array empty.
 */
export const authorizedAdmins = [
  'kerolos4work@gmail.com',
  'miraphilip2012@gmail.com',
  // Add more admin email(s) here
];

/**
 * Checks if a user is an authorized admin.
 * @param user The user object from Supabase.
 * @returns True if the user is an admin, false otherwise.
 */
export function isUserAdmin(user: User | null): boolean {
  if (!user?.email) {
    return false;
  }
  // If the authorizedAdmins array is empty, allow any authenticated user.
  return authorizedAdmins.length === 0 || authorizedAdmins.includes(user.email);
}