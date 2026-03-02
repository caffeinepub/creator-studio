import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetVideo } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useRef } from 'react';

function formatViewCount(count: bigint): string {
  return new Intl.NumberFormat('en-US').format(count);
}

function viewLabel(count: bigint): string {
  return count === 1n ? '1 view' : `${formatViewCount(count)} views`;
}

function getPosterUrl(video: { thumbnail?: { getDirectURL?: () => string } } | null): string | undefined {
  if (!video?.thumbnail) return undefined;
  try {
    if (typeof video.thumbnail.getDirectURL === 'function') {
      return video.thumbnail.getDirectURL();
    }
  } catch {
    // no poster
  }
  return undefined;
}

export default function VideoPlayerPage() {
  const { id } = useParams({ from: '/video/$id' });
  const navigate = useNavigate();
  const { data: video, isLoading } = useGetVideo(id);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="aspect-video w-full rounded-lg mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <p className="text-muted-foreground mb-6">The video you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </div>
    );
  }

  let videoUrl: string | undefined;
  try {
    videoUrl = video.file.getDirectURL();
  } catch {
    videoUrl = undefined;
  }

  const posterUrl = getPosterUrl(video);

  return (
    <div className="max-w-5xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Feed
      </Button>

      <div className="bg-card rounded-lg overflow-hidden shadow-lg border-2 border-border">
        <div className="aspect-video bg-black relative">
          {videoError || !videoUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-lg font-semibold">Unable to load video</p>
              <p className="text-sm text-white/70 text-center px-4">
                The video could not be loaded. It may still be processing or the file may be unavailable.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  setVideoError(false);
                  setVideoLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <div className="flex flex-col items-center gap-3 text-white">
                    <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-white/70">Loading video…</p>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                key={videoUrl}
                src={videoUrl}
                controls
                preload="auto"
                playsInline
                className="w-full h-full"
                {...(posterUrl ? { poster: posterUrl } : {})}
                onCanPlay={() => setVideoLoading(false)}
                onLoadedData={() => setVideoLoading(false)}
                onError={() => {
                  setVideoError(true);
                  setVideoLoading(false);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(video.uploadTimestamp)}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
              <Eye className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{viewLabel(video.viewCount)}</span>
            </div>
          </div>

          {video.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{video.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
