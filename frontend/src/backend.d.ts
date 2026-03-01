import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    title: string;
    duration: bigint;
    thumbnail?: ExternalBlob;
    file: ExternalBlob;
    description: string;
    uploadTimestamp: Time;
    viewCount: bigint;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export type UploadResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "error";
    error: string;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    followUser(target: Principal): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFollowerCount(user: Principal): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(id: string): Promise<Video | null>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(target: Principal): Promise<boolean>;
    listVideos(): Promise<Array<Video>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unfollowUser(target: Principal): Promise<boolean>;
    uploadThumbnail(videoId: string, thumbnail: ExternalBlob): Promise<void>;
    uploadVideo(id: string, title: string, description: string, duration: bigint, file: ExternalBlob, thumbnail: ExternalBlob | null): Promise<UploadResult>;
}
