'use client';

import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface GridCarouselProps {
  items: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  defaultIcon?: string;
  containerClass?: string;
  panelClass?: string;
  iconClass?: string;
  titleClass?: string;
  descriptionClass?: string;
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GridCarousel = ({
  items = [],
  defaultIcon = 'check',
  containerClass,
  panelClass,
  iconClass,
  titleClass,
  descriptionClass,
}: GridCarouselProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setSlideDirection('right');
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setIsAutoPlaying(false);
  };

  const currentItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Fill empty slots to maintain grid layout
  const filledItems = [...currentItems];
  while (filledItems.length < itemsPerPage) {
    filledItems.push({ title: '', description: '', icon: 'check' });
  }

  return (
    <div className="">
      <div className="flex justify-center mb-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-primary-100 dark:bg-slate-800 hover:bg-primary-200 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary-900 dark:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-primary-100 dark:bg-slate-800 hover:bg-primary-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary-900 dark:text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div
        className={twMerge(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 lg:gap-8 transition-all duration-500 ease-in-out min-h-[400px] w-full lg:min-w-[70rem]',
          containerClass
        )}
      >
        {filledItems.map((item, index) => (
          <div
            key={index}
            className={twMerge(
              'transform transition-all duration-300 hover:scale-105 h-[120px] w-full max-w-[400px] mx-auto border-b border-gray-200 dark:border-gray-700 last:border-b-0 sm:border-b-0',
              panelClass,
              !item.title && 'opacity-0 pointer-events-none'
            )}
          >
            <div className="flex flex-col h-full p-3 sm:p-4">
              <div className="flex items-center mb-1 sm:mb-2">
                <div className={twMerge('w-6 h-6 sm:w-7 sm:h-7 text-primary-900 dark:text-white mr-2 sm:mr-3 flex-shrink-0', iconClass)}>
                  {item.icon === 'check' ? <CheckIcon /> : <CheckIcon />}
                </div>
                <h3
                  className={twMerge(
                    'text-base sm:text-lg font-medium text-gray-900 dark:text-white',
                    titleClass
                  )}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className={twMerge(
                  'text-xs sm:text-sm text-gray-600 dark:text-slate-400 flex-grow',
                  descriptionClass
                )}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(index);
              setIsAutoPlaying(false);
            }}
            className={`w-3 h-3 rounded-full mx-1 transition-colors ${
              currentPage === index
                ? 'bg-primary-900 dark:bg-white'
                : 'bg-gray-300 dark:bg-slate-600'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GridCarousel; 