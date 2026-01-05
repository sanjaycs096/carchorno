'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Car } from './types';
import placeholderData from './placeholder-images.json';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

// In a real app, this would be a database call.
// For this prototype, we're reading from a JSON file.
async function getCarsData(): Promise<Car[]> {
  // The data has an extra wrapper object, so we access it here.
  return placeholderData.placeholderImages as Car[];
}

// In a real app, this would write to a database.
// For this prototype, we're writing to a JSON file.
async function setCarsData(cars: Car[]) {
  const filePath = resolve(process.cwd(), 'src/lib/placeholder-images.json');
  const updatedData = { placeholderImages: cars };
  await writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
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
  const cars = await getCarsData();
  const car = cars.find((car) => car.id === id);
  return car || null;
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
    const cars = await getCarsData();
    const newCar: Car = {
      id: (Math.random() + 1).toString(36).substring(2), // simple unique id
      ...validatedFields.data,
      created_at: new Date().toISOString(),
    };
    const updatedCars = [...cars, newCar];
    await setCarsData(updatedCars);
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
    const cars = await getCarsData();
    const updatedCars = cars.map((car) => {
      if (car.id === id) {
        return { ...car, ...validatedFields.data };
      }
      return car;
    });
    await setCarsData(updatedCars);
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
    const cars = await getCarsData();
    const updatedCars = cars.filter((car) => car.id !== id);
    await setCarsData(updatedCars);
  } catch (error) {
    console.error('Delete car error:', error);
    return { message: 'Failed to delete car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { message: 'Deleted car successfully.' };
}
