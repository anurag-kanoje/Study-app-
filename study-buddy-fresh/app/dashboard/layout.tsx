import { Metadata } from 'next';
import { SideNav } from '@/app/components/layout/side-nav';
import { TopBar } from '@/app/components/layout/top-bar';

export const metadata: Metadata = {
  title: 'Dashboard - StudyBuddy',
  description: 'Your AI-powered study companion',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav className="hidden lg:block w-64 border-r" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
