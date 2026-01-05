'use client';
import { useActionState } from 'react';
import { useEffect, useRef } from 'react';
import type { Car } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

type CarFormProps = {
  car?: Car | null;
  action: (
    prevState: any,
    formData: FormData
  ) => Promise<{ errors?: any; message: string }>;
};

export function CarForm({ car, action }: CarFormProps) {
  const [state, formAction] = useActionState(action, { message: '', errors: {} });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith('Error')) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
      // Success case is handled by redirect, so no toast needed here
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Car Name</Label>
        <Input id="name" name="name" defaultValue={car?.name} />
        {state?.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" name="brand" defaultValue={car?.brand} />
        {state?.errors?.brand && (
          <p className="text-sm text-destructive">{state.errors.brand[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={car?.description}
          rows={5}
        />
        {state?.errors?.description && (
          <p className="text-sm text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={car?.imageUrl} />
        {state?.errors?.imageUrl && (
          <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageHint">Image Hint (for AI search)</Label>
        <Input
          id="imageHint"
          name="imageHint"
          defaultValue={car?.imageHint}
          placeholder="e.g. red car"
        />
        {state?.errors?.imageHint && (
          <p className="text-sm text-destructive">
            {state.errors.imageHint[0]}
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="transition-transform duration-200 hover:scale-105"
        >
          <Save className="mr-2 h-4 w-4" />
          {car ? 'Update Car' : 'Add Car'}
        </Button>
      </div>
    </form>
  );
}
