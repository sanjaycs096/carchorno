import Link from 'next/link';
import { Car, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-card border-r flex flex-col hidden md:flex">
      <div className="p-4 border-b">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary"
        >
          <Car className="h-6 w-6" />
          <span className="font-headline">CarChrono</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/admin/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/admin/dashboard/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Link>
        </Button>
      </nav>
      <div className="p-4 border-t mt-auto">
        <form action={logout}>
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
