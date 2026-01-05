'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { initializeFirebase } from '@/firebase';
import type { Car } from './types';

// In a real app, this would be a database call.
// For this prototype, we're reading from a JSON file.
async function getCarsData(): Promise<Car[]> {
  const { firestore } = initializeFirebase();
  const carsCollection = collection(firestore, 'cars');
  const carSnapshot = await getDocs(carsCollection);
  const carList = carSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Car[];
  return carList;
}

const carSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Invalid URL'),
  imageHint: z.string().min(2, 'Image hint must be at least 2 characters'),
});

export async function getCars(): Promise<Car[]> {
  try {
    const cars = await getCarsData();
    // sort alphabetically by name
    cars.sort((a, b) => a.name.localeCompare(b.name));
    return cars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export async function getCarById(id: string) {
  const { firestore } = initializeFirebase();
  const docRef = doc(firestore, 'cars', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Car;
  } else {
    return null;
  }
}

export async function addCarAction(prevState: any, formData: FormData) {
  const validatedFields = carSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the fields.',
    };
  }

  try {
    const { firestore } = initializeFirebase();
    await addDoc(collection(firestore, 'cars'), {
      ...validatedFields.data,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Add car error:', error);
    return { message: 'Error: Failed to add car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  redirect('/admin/dashboard');
}

export async function updateCarAction(
  id: string,
  prevState: any,
  formData: FormData
) {
  const validatedFields = carSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the fields.',
    };
  }

  try {
    const { firestore } = initializeFirebase();
    const docRef = doc(firestore, 'cars', id);
    await updateDoc(docRef, validatedFields.data);
  } catch (error) {
    console.error('Update car error:', error);
    return { message: 'Error: Failed to update car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  revalidatePath(`/admin/dashboard/edit/${id}`);
  redirect('/admin/dashboard');
}

export async function deleteCarAction(id: string) {
  try {
    const { firestore } = initializeFirebase();
    await deleteDoc(doc(firestore, 'cars', id));
  } catch (error) {
    console.error('Delete car error:', error);
    return { message: 'Failed to delete car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { message: 'Deleted car successfully.' };
}
