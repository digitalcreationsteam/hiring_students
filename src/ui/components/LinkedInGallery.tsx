import React, { useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';

const LinkedInGallery: React.FC = () => {
  const [images] = useState([
    { id: 1, src: '/1stScreenshot.jpeg', alt: 'Image 1' },
    { id: 2, src: '/2ndScreenshot.jpeg', alt: 'Image 2' },
    { id: 3, src: '/3rdScreenshot.jpeg', alt: 'Image 3' },
    { id: 4, src: '/4thScreenshot.jpeg', alt: 'Image 4' },
    { id: 5, src: '/5thScreenshot.jpeg', alt: 'Image 5' },
    { id: 6, src: '/6thScreenshot.jpeg', alt: 'Image 6' },
    { id: 7, src: '/7thScreenshot.jpeg', alt: 'Image 7' },
    { id: 8, src: '/8thScreenshot.jpeg', alt: 'Image 8' },
  ]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const row1Images = images.slice(0, 4);
  const row2Images = images.slice(4, 8);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  const handleImageError = (imageId: number) => {
    setFailedImages(prev => new Set(prev).add(imageId.toString()));
  };

  const ImageRow = ({ rowImages, isReverse }: { rowImages: typeof row1Images; isReverse: boolean }) => {
    const duplicatedImages = [...rowImages, ...rowImages, ...rowImages];

    return (
      <div className="relative w-full h-56 sm:h-64 lg:h-72 mb-6 sm:mb-8 lg:mb-10 overflow-hidden group">
        {/* Fade overlays - now span full width edge-to-edge */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 lg:w-40 z-20"
            style={{
              background: `linear-gradient(90deg, ${uniTalentColors.background} 0%, ${uniTalentColors.background}00 100%)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 lg:w-40 z-20"
            style={{
              background: `linear-gradient(270deg, ${uniTalentColors.background} 0%, ${uniTalentColors.background}00 100%)`,
            }}
          />
        </div>

        <div className={`absolute inset-0 flex gap-4 sm:gap-6 ${isReverse ? 'animate-scroll-reverse' : 'animate-scroll'}`}>
          {duplicatedImages.map((image, index) => (
            <div
              key={`image-${image.id}-${index}`}
              className="relative flex-shrink-0 h-full rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group/image cursor-pointer bg-gray-100"
              style={{
                width: 'clamp(180px, 20vw, 280px)',
              }}
              onClick={() => handleImageClick(image.src)}
            >
              {failedImages.has(image.id.toString()) ? (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: uniTalentColors.secondary }}
                >
                  <span className="text-xl">#{image.id}</span>
                </div>
              ) : (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain group-hover/image:scale-110 transition-transform duration-500"
                  onError={() => handleImageError(image.id)}
                />
              )}
              <div
                className="absolute inset-0 opacity-0 group-hover/image:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: uniTalentColors.secondary }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full py-8 sm:py-12 lg:py-16 overflow-hidden"
      style={{ backgroundColor: `${uniTalentColors.primary}30` }}
    >
      {/* Header - constrained to max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center"
          style={{ color: uniTalentColors.text }}
        >
          Gallery
        </h1>
        <div
          className="h-1 w-20 rounded-full mx-auto mt-4"
          style={{ backgroundColor: uniTalentColors.primary }}
        />
      </div>

      {/* Row 1 - Full width, no max-w constraint */}
      <ImageRow rowImages={row1Images} isReverse={false} />

      {/* Row 2 - Full width, no max-w constraint */}
      <ImageRow rowImages={row2Images} isReverse={true} />

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300 animate-fade-in"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-popup">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: uniTalentColors.primary,
                color: uniTalentColors.white,
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <img src={selectedImage} alt="Full view" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popup {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scroll { animation: scroll 40s linear infinite; }
        .animate-scroll-reverse { animation: scroll-reverse 40s linear infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-popup { animation: popup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .group:hover .animate-scroll,
        .group:hover .animate-scroll-reverse { animation-play-state: paused; }
        * { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default LinkedInGallery;