# Getting Your Supabase Keys

To fix the authentication issues, you need to get the correct API keys from your Supabase project.

## 1. Find Your Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (mmdzysyuazaoyuymjjqu)

## 2. Get Your API Keys

1. In the left sidebar, go to "Project Settings" (gear icon)
2. Click on "API" in the settings menu
3. You'll find two important keys:
   - **Project URL** (already correct): https://mmdzysyuazaoyuymjjqu.supabase.co
   - **anon public** key - This is what you need for NEXT_PUBLIC_SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   - **service_role** key - This is what you need for SUPABASE_SERVICE_ROLE_KEY

## 3. Update Your Environment Variables

1. Open your `.env.local` file
2. Replace the keys with the actual values from your Supabase project:

```
NEXT_PUBLIC_SUPABASE_URL=https://mmdzysyuazaoyuymjjqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

## 4. Important Notes

1. The Supabase keys should be in their raw format, not with the "sb*publishable*" prefix
2. The anon key and publishable key should be the same value
3. The service role key is different and has elevated permissions
4. Never expose your service role key in client-side code

## 5. Restart Your Development Server

After updating the environment variables, you must restart your development server for the changes to take effect:

```bash
npm run dev
```

## 6. Test the Authentication

1. Try logging in again
2. If you still get errors, check the browser console and terminal for specific error messages
3. Make sure the user you're trying to log in with exists in your Supabase authentication table

## 7. Create Admin Users

If you don't have any users yet:

1. In your Supabase project, go to "Authentication" > "Users"
2. Click "Add user"
3. Enter the email and password for your admin account
4. Make sure to add this email to the authorizedAdmins array in your admin page
