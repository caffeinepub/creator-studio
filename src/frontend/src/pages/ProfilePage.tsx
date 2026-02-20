import { useGetCallerUserProfile, useListVideos } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Video, User } from 'lucide-react';

export default function ProfilePage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: videos, isLoading: videosLoading } = useListVideos();

  const videoCount = videos?.length || 0;

  if (profileLoading || videosLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center py-12">
          <Skeleton className="h-32 w-32 rounded-full mb-6" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-20 w-full max-w-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center py-12">
        <div className="relative mb-6">
          <img 
            src="/assets/generated/profile-avatar.dim_200x200.png" 
            alt="Creator Profile"
            className="h-32 w-32 rounded-full border-4 border-primary shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold mb-2">
          {userProfile?.name || 'Creator'}
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md">
          Welcome to my channel! Here you'll find all my latest videos and content. 
          Thanks for being part of this journey! 🎥✨
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
          <div className="bg-card border-2 border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Video className="h-6 w-6 text-primary" />
              <span className="text-3xl font-bold">{videoCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {videoCount === 1 ? 'Video' : 'Videos'}
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-3 mb-2">
              <User className="h-6 w-6 text-primary" />
              <span className="text-3xl font-bold">∞</span>
            </div>
            <p className="text-sm text-muted-foreground">Fans</p>
          </div>
        </div>
      </div>
    </div>
  );
}
