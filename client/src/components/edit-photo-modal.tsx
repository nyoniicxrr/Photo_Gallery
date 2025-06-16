import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Photo, UpdatePhoto } from "@shared/schema";

interface EditPhotoModalProps {
  photo: Photo;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditPhotoModal({ photo, open, onClose, onSave }: EditPhotoModalProps) {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description || '');
  const [tags, setTags] = useState(photo.tags.join(', '));
  const { toast } = useToast();

  useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      setDescription(photo.description || '');
      setTags(photo.tags.join(', '));
    }
  }, [photo]);

  const updateMutation = useMutation({
    mutationFn: async (updateData: UpdatePhoto) => {
      const response = await apiRequest('PATCH', `/api/photos/${photo.id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Photo Updated",
        description: "Photo details have been updated successfully",
      });
      onSave();
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: UpdatePhoto = {
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    updateMutation.mutate(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-secondary border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Photo Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-dark-primary border-gray-600 text-white focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-dark-primary border-gray-600 text-white focus:border-blue-500 resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="tags" className="text-white">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="portrait, studio, professional"
                className="bg-dark-primary border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
              <p className="text-sm text-gray-400 mt-1">
                Separate tags with commas
              </p>
            </div>
          </form>
        </div>

        <DialogFooter className="space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
