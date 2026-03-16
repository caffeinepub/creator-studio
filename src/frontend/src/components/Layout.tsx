import type { ReactNode } from "react";
import AppFooter from "./AppFooter";
import NavigationBar from "./NavigationBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      <NavigationBar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
