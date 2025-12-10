'use client';

import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-12 bg-white text-zinc-800">
      <header className="col-span-12 md:hidden flex items-center justify-between px-4 py-4 border-b border-zinc-200">
        <Button
          id="openSidebarBtn"
          variant="outline"
          onClick={() => setSidebarOpen(true)}
        >
          Menu
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-zinc-900"></div>
          <div className="font-semibold">Pelcutron</div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      {sidebarOpen && (
        <div
          id="backdrop"
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        id="sidebar"
        className={`col-span-12 md:col-span-2 border-r border-zinc-200 bg-zinc-50 p-4 ${
          sidebarOpen ? 'block' : 'hidden'
        } fixed inset-y-0 left-0 w-72 z-40 md:static md:w-auto md:block`}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 rounded bg-zinc-900"></div>
          <div className="font-semibold">Pelcutron</div>
        </div>

        <nav className="space-y-1 text-sm">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-lg bg-white border border-zinc-200 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/history"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:border border-transparent hover:border-zinc-200"
          >
            Histori Data
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <div className="text-xs uppercase text-zinc-500 tracking-wide mb-1">
            Other
          </div>
          <a
            href="#"
            className="block px-3 py-2 rounded-lg hover:bg-white hover:border border-transparent hover:border-zinc-200 text-sm"
          >
            Profil
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-2 rounded-lg hover:bg-white hover:border border-transparent hover:border-zinc-200 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="col-span-12 md:col-span-10 p-4 sm:p-6 md:ml-0">
        {children}
      </main>
    </div>
  );
}
