import { Video } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Eye } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface VideoCardProps {
  video: Video;
}

function formatViewCount(count: bigint): string {
  return new Intl.NumberFormat('en-US').format(count);
}

function viewLabel(count: bigint): string {
  return count === 1n ? '1 view' : `${formatViewCount(count)} views`;
}

export default function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/video/$id', params: { id: video.id } });
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const thumbnailSrc = video.thumbnail
    ? video.thumbnail.getDirectURL()
    : '/assets/generated/video-placeholder.dim_400x600.png';

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] bg-muted overflow-hidden">
          <img 
            src={thumbnailSrc}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-primary rounded-full p-4">
              <Play className="h-8 w-8 text-primary-foreground fill-current" />
            </div>
          </div>
          {/* View count badge overlay */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <Eye className="h-3 w-3" />
            <span>{formatViewCount(video.viewCount)}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{video.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{formatDate(video.uploadTimestamp)}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{viewLabel(video.viewCount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
