import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import {
  useGetCallerUserProfile,
  useListVideos,
  useIsCallerAdmin,
  useFollowerCount,
  useIsFollowing,
  useFollowCreator,
  useUnfollowCreator,
} from '../hooks/useQueries';
import { Loader2, Users, Video, Heart, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// localStorage key for persisting the creator's principal
const CREATOR_PRINCIPAL_KEY = 'floridadave_creator_principal';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: videos, isLoading: videosLoading } = useListVideos();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const callerPrincipal = identity?.getPrincipal();

  // ── Creator principal management ──────────────────────────────────────────
  // When the creator (admin) visits their profile, store their principal so
  // fans can use it to follow them.
  const [creatorPrincipal, setCreatorPrincipal] = useState<Principal | null>(() => {
    try {
      const stored = localStorage.getItem(CREATOR_PRINCIPAL_KEY);
      return stored ? Principal.fromText(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (isAdmin && callerPrincipal) {
      const principalText = callerPrincipal.toString();
      localStorage.setItem(CREATOR_PRINCIPAL_KEY, principalText);
      setCreatorPrincipal(callerPrincipal);
    }
  }, [isAdmin, callerPrincipal]);

  // ── Determine if the current viewer is the creator ────────────────────────
  const isCreator = isAdmin === true;

  // ── Follow data ───────────────────────────────────────────────────────────
  const { data: followerCount, isLoading: followerCountLoading } = useFollowerCount(creatorPrincipal);
  const { data: isFollowingCreator, isLoading: isFollowingLoading } = useIsFollowing(
    !isCreator && isAuthenticated ? creatorPrincipal : null
  );

  const followMutation = useFollowCreator();
  const unfollowMutation = useUnfollowCreator();

  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowToggle = () => {
    if (!creatorPrincipal) return;
    if (isFollowingCreator) {
      unfollowMutation.mutate(creatorPrincipal);
    } else {
      followMutation.mutate(creatorPrincipal);
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
  const displayFollowerCount = followerCount !== undefined ? Number(followerCount) : 0;

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
                  src="/assets/generated/profile-avatar.dim_200x200.png"
                  alt="Creator avatar"
                  className="w-24 h-24 rounded-full border-4 border-card object-cover shadow-lg"
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
                          <Button variant="outline" disabled className="gap-2 cursor-not-allowed opacity-70">
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Log in to follow</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : !creatorPrincipal ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button variant="outline" disabled className="gap-2 cursor-not-allowed opacity-70">
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
                {userProfile?.name ?? 'FloridaDave'}
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
                  <span className="font-semibold text-foreground">{videoCount}</span>
                )}
                <span className="text-muted-foreground">
                  {videoCount === 1 ? 'Video' : 'Videos'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                {followerCountLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : (
                  <span className="font-semibold text-foreground">{displayFollowerCount}</span>
                )}
                <span className="text-muted-foreground">
                  {displayFollowerCount === 1 ? 'Follower' : 'Followers'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">
                  {videoCount * 12}
                </span>
                <span className="text-muted-foreground">Likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Follow success / error feedback */}
        {followMutation.isError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {(followMutation.error as Error)?.message ?? 'Failed to follow. Please try again.'}
          </div>
        )}
        {unfollowMutation.isError && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {(unfollowMutation.error as Error)?.message ?? 'Failed to unfollow. Please try again.'}
          </div>
        )}

        {/* Videos Section */}
        <div className="mt-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Videos</h2>
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
                    src="/assets/generated/video-placeholder.dim_400x600.png"
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                    <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
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
