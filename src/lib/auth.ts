'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAME = 'carchrono-auth';

// In a real app, you would verify credentials against a database (e.g., Supabase/Firebase).
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin/dashboard');
  }

  return { error: 'Invalid email or password' };
}

export async function logout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/login');
}

export async function isAuthenticated() {
  return cookies().has(AUTH_COOKIE_NAME);
}

export async function protectRoute() {
  if (!(await isAuthenticated())) {
    redirect('/login');
  }
}
