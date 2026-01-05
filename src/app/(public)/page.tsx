import { getCars } from '@/lib/actions';
import { CarList } from '@/components/cars/CarList';
import { AlphabetNav } from '@/components/cars/AlphabetNav';
import type { Car } from '@/lib/types';

export default async function HomePage() {
  const cars = await getCars();

  const groupedCars = cars.reduce((acc, car) => {
    const firstLetter = car.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(car);
    return acc;
  }, {} as Record<string, Car[]>);

  const sortedLetters = Object.keys(groupedCars).sort();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          The CarChrono Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore a curated selection of iconic cars, from timeless classics to
          modern marvels.
        </p>
      </div>

      <AlphabetNav letters={sortedLetters} />
      <CarList groupedCars={groupedCars} sortedLetters={sortedLetters} />
    </div>
  );
}
