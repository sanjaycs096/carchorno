import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CarForm } from '@/components/admin/CarForm';
import { addCarAction } from '@/lib/actions';

export default function AddCarPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Add New Car</h1>
      <Card>
        <CardHeader>
          <CardTitle>Car Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* @ts-expect-error Server Action */}
          <CarForm action={addCarAction} />
        </CardContent>
      </Card>
    </div>
  );
}
