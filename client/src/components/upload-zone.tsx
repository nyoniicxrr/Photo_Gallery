import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, CloudUpload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UploadZoneProps {
  onUploadComplete: () => void;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });

      const response = await apiRequest('POST', '/api/photos/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: `${data.photos.length} photo(s) uploaded successfully`,
      });
      onUploadComplete();
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
      uploadMutation.mutate(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
    // Reset input
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`upload-zone border-2 border-dashed rounded-xl p-12 text-center mb-8 transition-all duration-300 cursor-pointer ${
        isDragOver
          ? "border-blue-500 bg-blue-500/10"
          : "border-gray-600 hover:border-gray-500"
      } ${uploadMutation.isPending ? "opacity-50 pointer-events-none" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="text-4xl text-gray-400">
          {uploadMutation.isPending ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
          ) : (
            <CloudUpload className="w-10 h-10 mx-auto" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">
            {uploadMutation.isPending ? "Uploading..." : "Drop photos here to upload"}
          </h3>
          <p className="text-gray-400">
            or <span className="text-blue-400 underline">browse files</span>
          </p>
        </div>
        <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP (Max 10MB)</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
