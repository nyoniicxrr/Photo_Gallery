import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@shared/schema";

interface PhotoViewerModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (photo: Photo) => void;
}

export default function PhotoViewerModal({ photo, photos, onClose, onNavigate }: PhotoViewerModalProps) {
  if (!photo) return null;

  const currentIndex = photos.findIndex(p => p.id === photo.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(photos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(photos[currentIndex + 1]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasPrevious) {
      handlePrevious();
    } else if (e.key === 'ArrowRight' && hasNext) {
      handleNext();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation Buttons */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Photo Container */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image */}
        <img
          src={photo.url}
          alt={photo.title || "Portfolio image"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Photo Info */}
        {(photo.title || photo.description || photo.tags.length > 0) && (
          <div className="mt-4 bg-dark-secondary/90 backdrop-blur-sm rounded-lg p-4 max-w-full">
            {photo.title && (
              <h3 className="text-white text-lg font-semibold mb-2">{photo.title}</h3>
            )}
            {photo.description && (
              <p className="text-gray-300 text-sm mb-3">{photo.description}</p>
            )}
            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Photo Counter */}
        <div className="mt-2 text-white/70 text-sm">
          {currentIndex + 1} of {photos.length}
        </div>
      </div>
    </div>
  );
}