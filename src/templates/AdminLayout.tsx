import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {(title || subtitle) && (
          <header className="mb-8">
            {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </header>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
