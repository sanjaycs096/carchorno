'use server';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { initializeFirebase } from '@/firebase/index';

// In a real app, you would use Supabase Auth. For this prototype,
// we'll use a simple cookie-based session.
const AUTH_COOKIE_NAME = 'carchrono-auth';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const { auth } = initializeFirebase();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    cookies().set(AUTH_COOKIE_NAME, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    redirect('/admin/dashboard');
  } catch (error) {
    return { error: 'Invalid email or password' };
  }
}

export async function logout() {
  const { auth } = initializeFirebase();
  await signOut(auth);
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
