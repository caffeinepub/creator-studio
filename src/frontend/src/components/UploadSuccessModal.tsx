import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface UploadSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadSuccessModal({ open, onClose }: UploadSuccessModalProps) {
  const navigate = useNavigate();

  const handleGoToFeed = () => {
    onClose();
    navigate({ to: '/' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center">Video Uploaded Successfully!</DialogTitle>
          <DialogDescription className="text-center">
            Your video has been uploaded and is now available for your fans to watch.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleGoToFeed} className="w-full sm:w-auto">
            View Video Feed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
