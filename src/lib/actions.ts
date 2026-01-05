'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

import type { Car } from './types';

const dataFilePath = path.join(
  process.cwd(),
  'src/lib/placeholder-images.json'
);

// Helper function to read the JSON data file
async function getCarsData(): Promise<{ placeholderImages: Car[] }> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { placeholderImages: [] };
  }
}

// Helper function to write to the JSON data file
async function writeCarsData(data: { placeholderImages: Car[] }) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
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
    const data = await getCarsData();
    const cars = data.placeholderImages || [];
    // sort alphabetically by name
    cars.sort((a, b) => (a.name || a.car_name).localeCompare(b.name || b.car_name));
    return cars.map(car => ({...car, name: car.name || car.car_name}));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export async function getCarById(id: string) {
  const data = await getCarsData();
  const cars = data.placeholderImages || [];
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

  try {
    const data = await getCarsData();
    const newCar: Car = {
      id: crypto.randomBytes(8).toString('hex'), // Generate a unique ID
      ...validatedFields.data,
      created_at: new Date().toISOString(),
    };

    data.placeholderImages.push(newCar);
    await writeCarsData(data);

  } catch (error) {
    console.error('Failed to add car:', error);
    return {
      message: 'Error: Failed to add car data.'
    }
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
    const data = await getCarsData();
    const carIndex = data.placeholderImages.findIndex((car) => car.id === id);

    if (carIndex === -1) {
      return { message: 'Error: Car not found.' };
    }

    const carToUpdate = data.placeholderImages[carIndex];

    data.placeholderImages[carIndex] = {
      ...carToUpdate,
      ...validatedFields.data,
    };

    await writeCarsData(data);

  } catch (error) {
    console.error('Failed to update car:', error);
    return {
      message: 'Error: Failed to update car data.'
    }
  }


  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  revalidatePath(`/admin/dashboard/edit/${id}`);
  redirect('/admin/dashboard');
}

export async function deleteCarAction(id: string) {
  try {
    const data = await getCarsData();
    const initialCount = data.placeholderImages.length;
    data.placeholderImages = data.placeholderImages.filter(
      (car) => car.id !== id
    );

    if (data.placeholderImages.length === initialCount) {
       console.log('Failed to delete car with ID:', id, 'Car not found.');
       return { message: 'Failed to delete car. Car not found.' };
    }
    
    await writeCarsData(data);
    
  } catch (error) {
    console.error('Failed to delete car:', error);
    return { message: 'Failed to delete car.' };
  }


  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { message: 'Deleted car successfully.' };
}
