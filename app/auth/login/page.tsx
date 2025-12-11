import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Suspense } from 'react';

async function handleLogin(formData: FormData) {
  'use server';
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('Attempting login with email:', email);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error logging in:', error.message);
    console.error('Error details:', error);
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log('Login successful, user:', data.user);
  redirect('/auth/login?success=true');
}

async function LoginContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is already logged in, redirect to admin page
  if (user) {
    redirect('/og-admin');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          {(() => {
            const searchParams = new URLSearchParams(
              typeof window !== 'undefined' ? window.location.search : ''
            );
            const error = searchParams.get('error');
            return (
              error && (
                <p className="mt-4 text-sm text-red-500 text-center">{decodeURIComponent(error)}</p>
              )
            );
          })()}
          {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get(
            'success'
          ) && (
            <>
              <p className="mt-4 text-sm text-green-500 text-center">
                Login successful! Redirecting to dashboard...
              </p>
              {typeof window !== 'undefined' &&
                setTimeout(() => (window.location.href = '/og-admin'), 1500)}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default async function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
    >
      <LoginContent />
    </Suspense>
  );
}
