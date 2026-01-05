import { getCars } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Car as CarIcon } from 'lucide-react';
import { CarDataTable } from '@/components/admin/CarDataTable';

export default async function DashboardPage() {
  const cars = await getCars();
  const totalCars = cars.length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <CarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCars}</div>
            <p className="text-xs text-muted-foreground">in the collection</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Manage Cars</h2>
        <CarDataTable cars={cars} />
      </div>
    </div>
  );
}
