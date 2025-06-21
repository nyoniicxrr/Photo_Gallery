import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import type { Photo } from "@shared/schema";

interface PhotoGridProps {
  photos: Photo[];
  onEditPhoto: (photo: Photo) => void;
  onDeletePhoto: (photo: Photo) => void;
}

export default function PhotoGrid({ photos, onEditPhoto, onDeletePhoto }: PhotoGridProps) {
  const { isAdmin } = useAdmin();
  
  const handleViewPhoto = (photo: Photo) => {
    // Open photo in new tab/window for full view
    window.open(photo.url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <div key={photo.id} className="group">
          <div className="bg-dark-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative">
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.url}
                alt="Portfolio image"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-3">
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-none"
                    onClick={() => onEditPhoto(photo)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-none"
                  onClick={() => handleViewPhoto(photo)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 border-none"
                    onClick={() => onDeletePhoto(photo)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Photo Info */}
            <div className="p-4">
              {photo.description && (
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                  {photo.description}
                </p>
              )}
              {photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {photo.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
