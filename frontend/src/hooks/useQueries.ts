import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, Video, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useListVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideo(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Video | null>({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVideo(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      duration,
      file,
    }: {
      id: string;
      title: string;
      description: string;
      duration: bigint;
      file: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.uploadVideo(id, title, description, duration, file);
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Follow / Unfollow hooks ──────────────────────────────────────────────────

export function useFollowerCount(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['followerCount', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return BigInt(0);
      return actor.getFollowerCount(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useIsFollowing(targetPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isFollowing', targetPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !targetPrincipal) return false;
      return actor.isFollowing(targetPrincipal);
    },
    enabled: !!actor && !isFetching && !!targetPrincipal,
  });
}

export function useFollowCreator() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.followUser(target);
    },
    onSuccess: (_data, target) => {
      queryClient.invalidateQueries({ queryKey: ['followerCount', target.toString()] });
      queryClient.invalidateQueries({ queryKey: ['isFollowing', target.toString()] });
    },
  });
}

export function useUnfollowCreator() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unfollowUser(target);
    },
    onSuccess: (_data, target) => {
      queryClient.invalidateQueries({ queryKey: ['followerCount', target.toString()] });
      queryClient.invalidateQueries({ queryKey: ['isFollowing', target.toString()] });
    },
  });
}
