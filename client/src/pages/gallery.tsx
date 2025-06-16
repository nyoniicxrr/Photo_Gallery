import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";
import UploadZone from "@/components/upload-zone";
import PhotoGrid from "@/components/photo-grid";
import EditPhotoModal from "@/components/edit-photo-modal";
import DeletePhotoModal from "@/components/delete-photo-modal";
import type { Photo } from "@shared/schema";

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);

  const { data: photos = [], isLoading, refetch } = useQuery<Photo[]>({
    queryKey: ['/api/photos', { search: searchQuery, tag: selectedTag }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedTag && selectedTag !== 'all') params.append('tag', selectedTag);
      
      const response = await fetch(`/api/photos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch photos');
      return response.json();
    }
  });

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
  };

  const handleDeletePhoto = (photo: Photo) => {
    setDeletingPhoto(photo);
  };

  const handleUploadComplete = () => {
    refetch();
  };

  const allTags = Array.from(
    new Set(photos.flatMap(photo => photo.tags))
  ).sort();

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-light mb-2">Photography Gallery</h2>
            <p className="text-slate-400">Manage and showcase your portfolio</p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-secondary border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 w-full sm:w-64 pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="bg-dark-secondary border-gray-600 text-white focus:border-blue-500 w-full sm:w-40">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent className="bg-dark-secondary border-gray-600">
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload Zone */}
        <UploadZone onUploadComplete={handleUploadComplete} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Photo Grid */}
        {!isLoading && photos.length > 0 && (
          <PhotoGrid 
            photos={photos}
            onEditPhoto={handleEditPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {/* Empty State */}
        {!isLoading && photos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-600 mb-4">
              <Upload className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Photos Found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || selectedTag 
                ? "Try adjusting your search or filters" 
                : "Upload your first photo to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingPhoto && (
        <EditPhotoModal
          photo={editingPhoto}
          open={true}
          onClose={() => setEditingPhoto(null)}
          onSave={() => {
            setEditingPhoto(null);
            refetch();
          }}
        />
      )}

      {deletingPhoto && (
        <DeletePhotoModal
          photo={deletingPhoto}
          open={true}
          onClose={() => setDeletingPhoto(null)}
          onConfirm={() => {
            setDeletingPhoto(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
