import { ReactNode } from 'react';
import { Sidebar } from './Sidebar.tsx';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}