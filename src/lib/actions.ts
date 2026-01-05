'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';

import type { Car } from './types';

// In a real app, this would be a database call.
// For this prototype, we're reading from a JSON file.
async function getCarsData(): Promise<Car[]> {
  const filePath = path.join(
    process.cwd(),
    'src/lib/placeholder-images.json'
  );
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(jsonData);
  return data.placeholderImages;
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
    cars.sort((a, b) => (a.name || a.car_name).localeCompare(b.name || b.car_name));
    return cars.map(car => ({...car, name: car.name || car.car_name}));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export async function getCarById(id: string) {
  const cars = await getCarsData();
  const car = cars.find((car) => car.id === id);
  if (car) {
    return {...car, name: car.name || car.car_name};
  }
  return null;
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

  // This is a prototype, so we won't actually save to the JSON file.
  // In a real app, you would add the new car to the database here.
  console.log('New car data:', validatedFields.data);

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

  // This is a prototype, so we won't actually update the JSON file.
  // In a real app, you would update the car in the database here.
  console.log('Updated car data for ID', id, ':', validatedFields.data);


  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  revalidatePath(`/admin/dashboard/edit/${id}`);
  redirect('/admin/dashboard');
}

export async function deleteCarAction(id: string) {
  // This is a prototype, so we won't actually delete from the JSON file.
  // In a real app, you would delete the car from the database here.
  console.log('Deleted car with ID:', id);

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { message: 'Deleted car successfully.' };
}
