'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AlphabetNavProps {
  letters: string[];
}

export function AlphabetNav({ letters }: AlphabetNavProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="sticky top-16 bg-background/95 backdrop-blur-sm z-30 py-4 mb-4 -mx-4 px-4 border-b">
      <div className="flex flex-wrap justify-center gap-1">
        {alphabet.map((letter) => {
          const isDisabled = !letters.includes(letter);
          return (
            <Button
              key={letter}
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sm md:h-10 md:w-10 md:text-base rounded-full"
              disabled={isDisabled}
              aria-disabled={isDisabled}
            >
              <Link href={`#section-${letter}`}>{letter}</Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
