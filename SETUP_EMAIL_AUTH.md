# Setting Up Email Authentication for Supabase

To enable email/password authentication for your admin page, you need to configure it in your Supabase project. Follow these steps:

## 1. Configure Email Authentication in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. In the left sidebar, go to "Authentication" > "Providers"
4. Make sure "Email" is enabled (it should be enabled by default)
5. You can optionally configure additional settings like:
   - Enable email confirmations
   - Set up email templates
   - Configure SMTP settings (for production)

## 2. Create Admin Users

You have two options to create admin users:

### Option 1: Through the Supabase Dashboard

1. In your Supabase project, go to "Authentication" > "Users"
2. Click "Add user"
3. Enter the admin email and password
4. Click "Save"

### Option 2: Programmatically (Recommended for initial setup)

1. Create a temporary script or API endpoint to create your first admin user
2. Use the Supabase client to sign up a user:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

async function createAdminUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@example.com',
    password: 'secure-password',
    email_confirm: true, // Skip email confirmation for initial setup
  });

  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created:', data);
  }
}

createAdminUser();
```

## 3. Update Authorized Admins

In `app/og-admin/page.tsx`, update the authorized admin emails:

```typescript
const authorizedAdmins = ['admin@example.com']; // Replace with actual admin emails
```

## 4. Test the Authentication

1. Restart your development server
2. Navigate to `/og-admin`
3. Enter your admin email and password
4. Click "Sign In"
5. You should be redirected to the admin dashboard if your credentials are correct

## Security Considerations

1. Use strong passwords for admin accounts
2. Consider implementing two-factor authentication for additional security
3. Regularly rotate admin passwords
4. Use environment variables for sensitive configuration
5. Consider implementing rate limiting to prevent brute force attacks
6. For production, use HTTPS and secure cookies

## Troubleshooting

If you encounter issues:

1. Check that email authentication is enabled in your Supabase project
2. Verify that the admin user exists in the "Authentication" > "Users" table
3. Ensure the user's email is confirmed (if confirmation is required)
4. Check the browser console for any error messages
5. Review the Supabase logs for authentication attempts
6. Make sure your environment variables are correctly set
