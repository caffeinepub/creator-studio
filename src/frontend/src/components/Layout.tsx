import type { ReactNode } from "react";
import NavigationBar from "./NavigationBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <NavigationBar />
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
      <footer className="mt-16 py-6 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© Florida Dave Network</span>
            <nav className="flex items-center gap-5">
              <a
                href="mailto:contact@floridadave.network"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
              <a
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
