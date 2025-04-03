"use client"
import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ResponsiveImageProps extends Omit<ImageProps, 'width' | 'height'> {
  width: number;
  height: number;
  className?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty' | undefined;
}

const ResponsiveImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  quality = 75, 
  placeholder, 
  ...props 
}: ResponsiveImageProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  
  useEffect(() => {
    // Client tarafında çalıştığından emin olalım
    if (typeof window !== 'undefined') {
      // İlk yükleme için pencere genişliğini ayarla
      setWindowWidth(window.innerWidth);
      
      // Ekran boyutu değiştikçe güncelleyelim
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Tablet görünümü için özel genişlik hesaplama (768px-1023px arası)
  const getImageWidth = (): number => {
    if (windowWidth >= 768 && windowWidth < 1024) {
      // Tablet görünümü için daha geniş bir değer kullan
      return Math.max(width, Math.floor(windowWidth * 0.85)); // Container genişliğinin %85'i
    }
    
    return width; // Mobil ve geniş ekranlarda normal genişlik
  };
  
  return (
    <Image
      src={src}
      width={getImageWidth()}
      height={height}
      alt={alt || ''}
      className={`${className || ''} w-full`}
      quality={quality}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default ResponsiveImage;