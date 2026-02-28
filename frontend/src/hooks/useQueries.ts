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

export function useUploadThumbnail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      thumbnail,
    }: {
      videoId: string;
      thumbnail: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadThumbnail(videoId, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFollowerCount(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['followerCount', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return 0n;
      return actor.getFollowerCount(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useIsFollowing(target: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isFollowing', target?.toString()],
    queryFn: async () => {
      if (!actor || !target) return false;
      return actor.isFollowing(target);
    },
    enabled: !!actor && !isFetching && !!target,
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
