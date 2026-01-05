import type { Car } from '@/lib/types';
import { CarCard } from './CarCard';

interface CarListProps {
  groupedCars: Record<string, Car[]>;
  sortedLetters: string[];
}

export function CarList({ groupedCars, sortedLetters }: CarListProps) {
  return (
    <div className="mt-8">
      {sortedLetters.map((letter) => (
        <section
          key={letter}
          id={`section-${letter}`}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold font-headline mb-6 pb-2 border-b-2 border-primary">
            {letter}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedCars[letter].map((car, index) => (
              <div
                key={car.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
