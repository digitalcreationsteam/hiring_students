import React, { useState } from 'react';
import { uniTalentColors } from 'src/common/Colors'; // Adjust path as needed

const LinkedInGallery: React.FC = () => {
const [images] = useState([
    { id: 1, src: '/1stScreenShot.jpeg', alt: 'Image 1' },
    { id: 2, src: '/2ndScreenShot.jpeg', alt: 'Image 2' },
    { id: 3, src: '/3rdScreenShot.jpeg', alt: 'Image 3' },
    { id: 4, src: '/4thScreenShot.jpeg', alt: 'Image 4' },
    { id: 5, src: '/5thScreenShot.jpeg', alt: 'Image 5' },
    { id: 6, src: '/6thScreenShot.jpeg', alt: 'Image 6' },
    { id: 7, src: '/7thScreenShot.jpeg', alt: 'Image 7' },
    { id: 8, src: '/8thScreenShot.jpeg', alt: 'Image 8' },
  ]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div 
      className="relative w-full py-8 sm:py-12 lg:py-16 overflow-hidden"
      style={{ backgroundColor: uniTalentColors.background }}
    >
      {/* Header */}
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

      {/* Scrolling Container - Row 1 (Left to Right) */}
      <div className="relative w-full h-56 sm:h-64 lg:h-72 mb-6 sm:mb-8 lg:mb-10 overflow-hidden group">
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Gradient fade left */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-r z-20"
            style={{
              background: `linear-gradient(90deg, ${uniTalentColors.background} 0%, ${uniTalentColors.background}00 100%)`,
            }}
          />
          {/* Gradient fade right */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-l z-20"
            style={{
              background: `linear-gradient(270deg, ${uniTalentColors.background} 0%, ${uniTalentColors.background}00 100%)`,
            }}
          />
        </div>

        <div className="absolute inset-0 flex gap-4 sm:gap-6 animate-scroll">
          {duplicatedImages.map((image, index) => (
            <div
              key={`row1-${index}`}
              className="relative flex-shrink-0 h-full rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group/image cursor-pointer"
              style={{
                width: 'clamp(150px, 30vw, 280px)',
              }}
              onClick={() => handleImageClick(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover/image:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: uniTalentColors.secondary }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling Container - Row 2 (Right to Left) */}
      <div className="relative w-full h-56 sm:h-64 lg:h-72 overflow-hidden group">
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Gradient fade left */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-r z-20"
            style={{
              background: `linear-gradient(90deg, ${uniTalentColors.background} 0%, ${uniTalentColors.background}00 100%)`,
            }}
          />
          {/* Gradient fade right */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 lg:w-40 bg-gradient-to-l z-20"
            style={{
              background: `linear-gradient(270deg, ${uniTalentColors.background} 0%, ${uniTalentColors.background}00 100%)`,
            }}
          />
        </div>

        <div className="absolute inset-0 flex gap-4 sm:gap-6 animate-scroll-reverse">
          {duplicatedImages.map((image, index) => (
            <div
              key={`row2-${index}`}
              className="relative flex-shrink-0 h-full rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group/image cursor-pointer"
              style={{
                width: 'clamp(150px, 30vw, 280px)',
              }}
              onClick={() => handleImageClick(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover/image:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: uniTalentColors.secondary }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300 animate-fade-in"
          onClick={handleBackdropClick}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-popup"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: uniTalentColors.primary,
                color: uniTalentColors.text,
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <img
                src={selectedImage}
                alt="Full view"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-popup {
          animation: popup 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Pause animation on hover */
        .group:hover .animate-scroll,
        .group:hover .animate-scroll-reverse {
          animation-play-state: paused;
        }

        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }

        /* Prevent body scroll when modal is open */
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
export default LinkedInGallery;