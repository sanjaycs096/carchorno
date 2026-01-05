'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Car } from './types';
import carData from './placeholder-images.json';

// In-memory store, initialized from the JSON file.
// In a real app, this would be a database like Supabase or Firebase.
let cars: Car[] = carData.placeholderImages;

const carSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Invalid URL'),
  imageHint: z.string().min(2, 'Image hint must be at least 2 characters'),
});

export async function getCars() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return cars.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCarById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return cars.find((car) => car.id === id);
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
    const newCar = {
      id: `${Date.now()}`,
      ...validatedFields.data,
    };
    cars.unshift(newCar);
  } catch (e) {
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
    const carIndex = cars.findIndex((car) => car.id === id);
    if (carIndex === -1) throw new Error('Car not found');

    cars[carIndex] = {
      ...cars[carIndex],
      ...validatedFields.data,
    };
  } catch (e) {
    return { message: 'Error: Failed to update car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  revalidatePath(`/admin/dashboard/edit/${id}`);
  redirect('/admin/dashboard');
}

export async function deleteCarAction(id: string) {
  try {
    cars = cars.filter((car) => car.id !== id);
    revalidatePath('/admin/dashboard');
    revalidatePath('/');
    return { message: 'Deleted car successfully.' };
  } catch (e) {
    return { message: 'Failed to delete car.' };
  }
}
