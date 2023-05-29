import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className="relative max-w-[600px] mx-auto border-l-slate-100 border-r-slate-100 px-4 border-x-[1px] min-h-screen">{children}</div>;
};
