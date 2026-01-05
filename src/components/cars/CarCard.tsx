import Image from 'next/image';
import type { Car } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={car.imageUrl}
            alt={car.name}
            fill
            className="object-cover"
            data-ai-hint={car.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-xl font-headline mb-2">{car.name}</CardTitle>
        <CardDescription>{car.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge variant="secondary">{car.brand}</Badge>
      </CardFooter>
    </Card>
  );
}
