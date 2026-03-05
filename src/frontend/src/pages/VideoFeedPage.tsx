import { Skeleton } from "@/components/ui/skeleton";
import { Video as VideoIcon } from "lucide-react";
import AboutSection from "../components/AboutSection";
import CameoSection from "../components/CameoSection";
import DomainsSection from "../components/DomainsSection";
import VideoCard from "../components/VideoCard";
import WaveDivider from "../components/WaveDivider";
import { useListVideos } from "../hooks/useQueries";

export default function VideoFeedPage() {
  const { data: videos, isLoading } = useListVideos();

  if (isLoading) {
    return (
      <div>
        <AboutSection />
        <CameoSection />
        <WaveDivider />
        <DomainsSection />
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <div key={k} className="space-y-3">
              <Skeleton className="aspect-[9/16] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div>
        <AboutSection />
        <CameoSection />
        <WaveDivider />
        <DomainsSection />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted rounded-full p-6 mb-6">
            <VideoIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Videos Yet</h2>
          <p className="text-muted-foreground max-w-md">
            Check back soon! New videos will appear here once they're uploaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AboutSection />
      <CameoSection />
      <WaveDivider />
      <DomainsSection />
      <WaveDivider />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Video Feed</h1>
        <p className="text-muted-foreground">
          Discover amazing content from our creator
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
