import { getCarById, updateCarAction } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CarForm } from '@/components/admin/CarForm';
import { notFound } from 'next/navigation';

export default async function EditCarPage({ params }: { params: { id: string } }) {
  const car = await getCarById(params.id);

  if (!car) {
    notFound();
  }

  const updateCarActionWithId = updateCarAction.bind(null, car.id);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Edit Car</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Details for {car.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CarForm car={car} action={updateCarActionWithId} />
        </CardContent>
      </Card>
    </div>
  );
}
