import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

interface FloatingGalleryProps {
  images: string[];
  activeIndex: number;
}

export const FloatingGallery = ({ images, activeIndex }: FloatingGalleryProps) => {
  if (!images || images.length === 0) return null;
  const displayImages = images.slice(0, 5); // Support up to 5 images

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
            key={activeIndex}
            className="relative w-full h-full"
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {displayImages.map((img, index) => (
                <GalleryItem 
                    key={`${activeIndex}-${index}`} 
                    src={img} 
                    index={index} 
                />
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const GalleryItem = ({ src, index }: { src: string, index: number }) => {
    const [borderRadius, setBorderRadius] = useState("1.5rem"); 
    const [aspectRatio, setAspectRatio] = useState(16/9); 
    const [isPortrait, setIsPortrait] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); 

    useEffect(() => {
        setIsLoaded(false);
        const img = new Image();
        img.src = src;

        const handleLoad = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            setAspectRatio(ratio);
            setIsPortrait(ratio < 1);

            if (ratio < 0.9) {
                setBorderRadius("2.5rem"); 
            } else if (ratio > 1.2) {
                setBorderRadius("0.75rem"); 
            } else {
                setBorderRadius("1.5rem"); 
            }
            setIsLoaded(true); 
        };

        if (img.decode) {
            img.decode().then(handleLoad).catch(() => { img.onload = handleLoad; });
        } else {
            img.onload = handleLoad;
        }
    }, [src]);

    // Dynamic Width Base
    const widthBase = isPortrait ? 30 : 50; 

    const variants = {
        0: { // Main
            top: "18%", left: "5%", 
            width: `${widthBase}%`, 
            zIndex: 30, opacity: 1,
            initial: { opacity: 0, x: -60, y: 40, scale: 0.95 },
            animate: { opacity: 1, x: 0, y: 0, scale: 1 }
        },
        1: { // Bottom Right
            top: "48%", left: "45%", 
            width: `${widthBase * 0.9}%`, 
            zIndex: 25, opacity: 0.85,
            initial: { opacity: 0, x: 60, y: 60, scale: 0.9 },
            animate: { opacity: 0.85, x: 0, y: 0, scale: 1 }
        },
        2: { // Top Right
            top: "12%", left: "60%", 
            width: `${widthBase * 0.7}%`, 
            zIndex: 20, opacity: 0.6,
            initial: { opacity: 0, x: 40, y: -40, scale: 0.85 },
            animate: { opacity: 0.6, x: 0, y: 0, scale: 1 }
        },
        3: { // Bottom Left
            top: "65%", left: "10%", 
            width: `${widthBase * 0.6}%`, 
            zIndex: 15, opacity: 0.4,
            initial: { opacity: 0, x: -40, y: 40, scale: 0.8 },
            animate: { opacity: 0.4, x: 0, y: 0, scale: 1 }
        },
        4: { // Far Back Center
            top: "38%", left: "30%", 
            width: `${widthBase * 0.5}%`, 
            zIndex: 10, opacity: 0.2,
            initial: { opacity: 0, scale: 0.7 },
            animate: { opacity: 0.2, scale: 1 }
        }
    };

    const currentVariant = variants[index as keyof typeof variants] || variants[0];

    return (
        <motion.div
            variants={{
                initial: currentVariant.initial,
                animate: { 
                    ...currentVariant.animate,
                    // Use a unified, smooth ease for simultaneous opacity/transform
                    transition: { duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }
                },
                exit: { 
                    opacity: 0, 
                    scale: 0.9,
                    transition: { duration: 0.4 } 
                }
            }}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"} 
            exit="exit"
            className="absolute overflow-hidden shadow-2xl bg-black/20 backdrop-blur-[2px] transition-[border-radius] duration-500 will-change-transform"
            style={{ 
                top: currentVariant.top,
                left: currentVariant.left,
                width: currentVariant.width,
                aspectRatio: aspectRatio,
                zIndex: currentVariant.zIndex,
                borderRadius: borderRadius,
                boxShadow: `0 ${20 - index * 4}px ${40 - index * 5}px -12px rgba(0, 0, 0, 0.6)`
            }}
        >
             {/* Image Container: bg-cover for full fill */}
             <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: src.includes('gradient') ? src : `url(${src})`,
                }}
             />

             {/* Darkening Overlay */}
             <div className={cn(
                 "absolute inset-0 pointer-events-none transition-colors duration-500",
                 index === 0 ? "bg-black/30" : "bg-black/10"
             )} />

             {/* Inner Glass Highlights - Dynamic Radius */}
             <div 
                className="absolute inset-0 border border-white/5 pointer-events-none transition-[border-radius] duration-500"
                style={{ borderRadius: borderRadius }}
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-20 pointer-events-none" />

             {/* Independent Floating Animation */}
             <motion.div
                animate={{ 
                    y: [0, index % 2 === 0 ? -20 : 20, 0],
                    rotate: [0, index % 2 === 0 ? 1 : -1, 0]
                }}
                transition={{ 
                    duration: 7 + index * 1.5,
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.5
                }}
                className="absolute inset-0 pointer-events-none"
             />
        </motion.div>
    );
}
