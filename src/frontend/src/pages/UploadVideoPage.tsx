import { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole, useUploadVideo } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import UploadSuccessModal from '../components/UploadSuccessModal';
import { useNavigate } from '@tanstack/react-router';

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const { mutate: uploadVideo, isPending } = useUploadVideo();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="bg-destructive/10 rounded-full p-6 inline-block mb-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Only the channel owner can upload videos. Please log in with the owner account.
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          Go to Video Feed
        </Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      setVideoFile(file);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a video title');
      return;
    }

    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    try {
      const arrayBuffer = await videoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      uploadVideo(
        {
          id: videoId,
          title: title.trim(),
          description: description.trim(),
          file: blob,
        },
        {
          onSuccess: () => {
            setShowSuccessModal(true);
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setUploadProgress(0);
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
    } catch (error) {
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

            <div className="space-y-2">
              <Label htmlFor="video">Video File *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
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
            </div>

            {isPending && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending || !title.trim() || !videoFile}
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
