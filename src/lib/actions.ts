'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from './supabase';
import { Car } from './types';

const carSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Invalid URL'),
  imageHint: z.string().min(2, 'Image hint must be at least 2 characters'),
});

export async function getCars(): Promise<Car[]> {
  const supabase = getSupabaseServerClient();
  const { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
  return cars || [];
}

export async function getCarById(id: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching car by id:', error);
    return null;
  }
  return data;
}

export async function addCarAction(prevState: any, formData: FormData) {
  const supabase = getSupabaseServerClient();
  const validatedFields = carSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the fields.',
    };
  }

  const { error } = await supabase.from('cars').insert([validatedFields.data]);

  if (error) {
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
  const supabase = getSupabaseServerClient();
  const validatedFields = carSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the fields.',
    };
  }

  const { error } = await supabase
    .from('cars')
    .update(validatedFields.data)
    .eq('id', id);

  if (error) {
    console.error('Update car error:', error);
    return { message: 'Error: Failed to update car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  revalidatePath(`/admin/dashboard/edit/${id}`);
  redirect('/admin/dashboard');
}

export async function deleteCarAction(id: string) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('cars').delete().eq('id', id);

  if (error) {
    console.error('Delete car error:', error);
    return { message: 'Failed to delete car.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { message: 'Deleted car successfully.' };
}
