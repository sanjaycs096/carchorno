export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CarChrono. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
