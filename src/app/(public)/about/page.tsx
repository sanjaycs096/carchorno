import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary text-center mb-8">
          About CarChrono
        </h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              Our Passion for Timeless Automobiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to CarChrono, your digital sanctuary for the world&apos;s most
              iconic and breathtaking automobiles. Our collection is more than
              just a list of cars; it&apos;s a curated gallery of history,
              engineering, and art on wheels.
            </p>
            <p>
              Founded by a group of passionate enthusiasts, CarChrono was born
              from a simple desire: to create a single place to admire, learn
              about, and appreciate the finest cars ever made. From the raw
              power of American muscle to the refined elegance of European
              sports cars and the innovative spirit of modern hypercars, our
              collection spans decades and continents.
            </p>
            <p>
              Each vehicle in our collection is meticulously documented,
              showcasing its unique story, design philosophy, and technical
              prowess. We believe that every car has a soul, and our mission is
              to share its narrative with you.
            </p>
            <p>
              Thank you for visiting. We invite you to explore the collection,
              discover new favorites, and share in our passion for a timeless
              automotive legacy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
