import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Heart,
  Loader2,
  UserCheck,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAdminPrincipal,
  useFollowCreator,
  useFollowerCount,
  useGetCallerUserProfile,
  useIsAdmin,
  useIsFollowing,
  useListVideos,
  useUnfollowCreator,
} from "../hooks/useQueries";

const PLACEHOLDER = "/assets/generated/video-placeholder.dim_400x600.png";

function getSafeThumbnailUrl(
  thumbnail: { getDirectURL?: () => string } | undefined | null,
): string {
  if (!thumbnail) return PLACEHOLDER;
  try {
    if (typeof thumbnail.getDirectURL === "function") {
      return thumbnail.getDirectURL();
    }
  } catch {
    // fall through
  }
  return PLACEHOLDER;
}

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: videos, isLoading: videosLoading } = useListVideos();
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  // ── Creator principal from backend ────────────────────────────────────────
  // Fetches the admin's principal directly from the canister so any fan
  // can follow without needing the creator to visit first.
  const { data: creatorPrincipal } = useAdminPrincipal();

  // ── Determine if the current viewer is the creator ────────────────────────
  const isCreator = isAdmin === true;

  // ── Follow data ───────────────────────────────────────────────────────────
  const resolvedCreatorPrincipal = creatorPrincipal ?? null;
  const { data: followerCount, isLoading: followerCountLoading } =
    useFollowerCount(resolvedCreatorPrincipal);
  const { data: isFollowingCreator, isLoading: isFollowingLoading } =
    useIsFollowing(
      !isCreator && isAuthenticated ? resolvedCreatorPrincipal : null,
    );

  const followMutation = useFollowCreator();
  const unfollowMutation = useUnfollowCreator();

  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowToggle = () => {
    if (!resolvedCreatorPrincipal) return;
    if (isFollowingCreator) {
      unfollowMutation.mutate(resolvedCreatorPrincipal);
    } else {
      followMutation.mutate(resolvedCreatorPrincipal);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const videoCount = videos?.length ?? 0;
  const displayFollowerCount =
    followerCount !== undefined ? Number(followerCount) : 0;
  // Sum up total views across all videos
  const totalViews =
    videos?.reduce((sum, v) => sum + Number(v.viewCount), 0) ?? 0;

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-primary/80 via-accent/60 to-secondary/80" />

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                <img
                  src="/assets/uploads/Florida-Dave-Network-logo-1-1.png"
                  alt="Florida Dave Network logo"
                  className="w-24 h-24 rounded-full border-4 border-card object-cover shadow-lg bg-white"
                />
                {isCreator && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Creator
                  </span>
                )}
              </div>

              {/* Follow / Following button for fans */}
              {!isCreator && (
                <div className="mt-14">
                  {!isAuthenticated ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="outline"
                            disabled
                            className="gap-2 cursor-not-allowed opacity-70"
                          >
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Log in to follow</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : !resolvedCreatorPrincipal ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="outline"
                            disabled
                            className="gap-2 cursor-not-allowed opacity-70"
                          >
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Creator hasn't set up their profile yet</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : isFollowingLoading ? (
                    <Button variant="outline" disabled className="gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading…
                    </Button>
                  ) : isFollowingCreator ? (
                    <Button
                      variant="secondary"
                      onClick={handleFollowToggle}
                      disabled={isMutating}
                      className="gap-2 min-w-[110px]"
                    >
                      {isMutating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                      Following
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={handleFollowToggle}
                      disabled={isMutating}
                      className="gap-2 min-w-[110px]"
                    >
                      {isMutating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      Follow
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Name & Bio */}
            <div className="mb-5">
              <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
                {userProfile?.name ?? "FloridaDave"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Short-form video creator 🌴 Florida vibes only
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Video className="w-4 h-4 text-primary" />
                {videosLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : (
                  <span className="font-semibold text-foreground">
                    {videoCount}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {videoCount === 1 ? "Video" : "Videos"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                {followerCountLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : (
                  <span className="font-semibold text-foreground">
                    {displayFollowerCount}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {displayFollowerCount === 1 ? "Follower" : "Followers"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-primary" />
                {videosLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : (
                  <span className="font-semibold text-foreground">
                    {new Intl.NumberFormat("en-US").format(totalViews)}
                  </span>
                )}
                <span className="text-muted-foreground">Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Follow success / error feedback */}
        {followMutation.isError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {(followMutation.error as Error)?.message ??
              "Failed to follow. Please try again."}
          </div>
        )}
        {unfollowMutation.isError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {(unfollowMutation.error as Error)?.message ??
              "Failed to unfollow. Please try again."}
          </div>
        )}

        {/* Videos Section */}
        <div className="mt-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Videos
          </h2>
          {videosLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : videoCount === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Video className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No videos uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {videos?.map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] rounded-xl overflow-hidden bg-muted relative group cursor-pointer"
                >
                  <img
                    src={getSafeThumbnailUrl(video.thumbnail)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                    <p className="text-white text-xs font-medium line-clamp-2">
                      {video.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
