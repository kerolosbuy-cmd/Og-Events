import { redirect } from 'next/navigation';

export async function goToSettings() {
  'use server';
  redirect('/og-admin/settings');
}

export async function logout() {
  'use server';
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
