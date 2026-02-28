import { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUploadVideo, useUploadThumbnail } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Video, AlertCircle, Clock, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import UploadSuccessModal from '../components/UploadSuccessModal';
import { useNavigate } from '@tanstack/react-router';

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { mutate: uploadVideo, isPending: isVideoUploading } = useUploadVideo();
  const { mutateAsync: uploadThumbnail, isPending: isThumbnailUploading } = useUploadThumbnail();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Thumbnail state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const isPending = isVideoUploading || isThumbnailUploading;
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-destructive/10 rounded-full p-6 inline-block mb-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please log in to upload videos.
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          Go to Video Feed
        </Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    setDurationError(null);
    setVideoDuration(null);
    setVideoFile(null);
    setUploadProgress(0);

    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const dur = tempVideo.duration;
      setVideoDuration(dur);

      if (dur < 10) {
        setDurationError(
          `Video is too short (${dur.toFixed(1)}s). Videos must be between 10 and 20 seconds long.`
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else if (dur > 20) {
        setDurationError(
          `Video is too long (${dur.toFixed(1)}s). Videos must be between 10 and 20 seconds long.`
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setDurationError(null);
        setVideoFile(file);
      }
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error('Could not read video metadata. Please try a different file.');
    };

    tempVideo.src = url;
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a JPEG, PNG, or WebP image');
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      return;
    }

    // Revoke previous preview URL
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setThumbnailFile(file);
    setThumbnailPreview(previewUrl);
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a video title');
      return;
    }

    if (!videoFile) {
      toast.error('Please select a valid video file');
      return;
    }

    if (durationError) {
      toast.error('Please select a video with a valid duration');
      return;
    }

    try {
      const arrayBuffer = await videoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const durationSeconds = BigInt(Math.round(videoDuration ?? 0));

      uploadVideo(
        {
          id: videoId,
          title: title.trim(),
          description: description.trim(),
          duration: durationSeconds,
          file: blob,
        },
        {
          onSuccess: async () => {
            // Upload thumbnail if one was selected
            if (thumbnailFile) {
              try {
                const thumbBuffer = await thumbnailFile.arrayBuffer();
                const thumbUint8 = new Uint8Array(thumbBuffer);
                const thumbBlob = ExternalBlob.fromBytes(thumbUint8);
                await uploadThumbnail({ videoId, thumbnail: thumbBlob });
              } catch {
                toast.error('Video uploaded but thumbnail upload failed');
              }
            }

            setShowSuccessModal(true);
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setVideoDuration(null);
            setDurationError(null);
            setUploadProgress(0);
            handleRemoveThumbnail();
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          },
          onError: (error) => {
            toast.error('Upload failed: ' + error.message);
            setUploadProgress(0);
          },
        }
      );
    } catch {
      toast.error('Failed to process video file');
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Upload Video</h1>
        <p className="text-muted-foreground">Share your content with your fans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>
            Fill in the information about your video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                disabled={isPending}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your fans about this video..."
                rows={4}
                disabled={isPending}
                maxLength={500}
              />
            </div>

            {/* Thumbnail upload */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail (optional)</Label>
              <input
                ref={thumbnailInputRef}
                id="thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailChange}
                disabled={isPending}
                className="hidden"
              />
              {thumbnailPreview ? (
                <div className="relative w-full rounded-lg overflow-hidden border-2 border-border">
                  <div className="aspect-[9/16] max-h-48 w-full relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    {!isPending && (
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                        aria-label="Remove thumbnail"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="px-3 py-2 bg-muted/50 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate">{thumbnailFile?.name}</span>
                    {!isPending && (
                      <label htmlFor="thumbnail" className="cursor-pointer text-sm text-primary hover:underline ml-2 shrink-0">
                        Change
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="thumbnail"
                  className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : 'border-border hover:border-primary'}`}
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Click to upload thumbnail</p>
                    <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP</p>
                  </div>
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video File *</Label>

              {/* Duration requirement hint */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>Videos must be between <strong>10 and 20 seconds</strong> long.</span>
              </div>

              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${durationError ? 'border-destructive' : 'border-border hover:border-primary'}`}>
                <input
                  ref={fileInputRef}
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={isPending}
                  className="hidden"
                />
                <label htmlFor="video" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    {videoFile ? (
                      <>
                        <Video className="h-12 w-12 text-primary" />
                        <div>
                          <p className="font-medium">{videoFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            {videoDuration !== null && ` · ${videoDuration.toFixed(1)}s`}
                          </p>
                        </div>
                        {!isPending && (
                          <Button type="button" variant="outline" size="sm">
                            Change Video
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Click to upload video</p>
                          <p className="text-sm text-muted-foreground">
                            MP4, MOV, AVI, or other video formats
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Duration validation error */}
              {durationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{durationError}</AlertDescription>
                </Alert>
              )}
            </div>

            {isPending && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{isThumbnailUploading ? 'Uploading thumbnail...' : 'Uploading video...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending || !title.trim() || !videoFile || !!durationError}
              className="w-full"
              size="lg"
            >
              {isPending ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <UploadSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
