import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="dark:bg-slate-800 bg-white dark:text-white">
      <div className="relative max-w-[600px] mx-auto border-l-slate-100 border-r-slate-100 dark:border-l-slate-600 dark:border-r-slate-600 border-x-[1px] min-h-screen">
        {children}
      </div>
    </div>
  );
};
