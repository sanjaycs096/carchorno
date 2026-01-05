import Link from 'next/link';
import { Car, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary"
        >
          <Car className="h-6 w-6" />
          <span className="font-headline">CarChrono</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
