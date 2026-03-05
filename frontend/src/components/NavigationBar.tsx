import { Link } from '@tanstack/react-router';
import { Video, User, Upload } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function NavigationBar() {
  const { identity } = useInternetIdentity();
  
  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="/assets/generated/app-logo.dim_300x100.png" 
            alt="Florida Dave Network" 
            className="h-12 w-auto"
          />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </Link>
          
          <Link 
            to="/profile" 
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          
          {isAuthenticated && (
            <Link 
              to="/upload" 
              className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Video</span>
            </Link>
          )}
          
          <LoginButton />
        </div>
      </nav>
    </header>
  );
}
