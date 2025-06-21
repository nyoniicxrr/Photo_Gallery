import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (newUrl: string) => void;
}

export default function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profile', file);

      const response = await apiRequest('POST', '/api/profile/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Photo Updated",
        description: "Your profile photo has been updated successfully",
      });
      onPhotoUpdate(data.url);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      uploadMutation.mutate(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 mx-auto mb-4 relative group">
        <img 
          src={currentPhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-full border-4 border-blue-500"
        />
        <div 
          className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
            uploadMutation.isPending ? 'opacity-100' : ''
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadMutation.isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="border-gray-600 hover:bg-gray-700 text-white"
        disabled={uploadMutation.isPending}
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploadMutation.isPending ? "Uploading..." : "Change Photo"}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}