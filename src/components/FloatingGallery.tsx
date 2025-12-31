import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

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
    const variants = {
        0: { // Main
            top: "10%", left: "5%", width: "50%", height: "50%", zIndex: 30, opacity: 1,
            initial: { opacity: 0, x: -60, y: 40, scale: 0.95 },
            animate: { opacity: 1, x: 0, y: 0, scale: 1 }
        },
        1: { // Bottom Right
            top: "40%", left: "40%", width: "45%", height: "45%", zIndex: 25, opacity: 0.85,
            initial: { opacity: 0, x: 60, y: 60, scale: 0.9 },
            animate: { opacity: 0.85, x: 0, y: 0, scale: 1 }
        },
        2: { // Top Right
            top: "5%", left: "55%", width: "35%", height: "35%", zIndex: 20, opacity: 0.6,
            initial: { opacity: 0, x: 40, y: -40, scale: 0.85 },
            animate: { opacity: 0.6, x: 0, y: 0, scale: 1 }
        },
        3: { // Bottom Left
            top: "55%", left: "10%", width: "30%", height: "30%", zIndex: 15, opacity: 0.4,
            initial: { opacity: 0, x: -40, y: 40, scale: 0.8 },
            animate: { opacity: 0.4, x: 0, y: 0, scale: 1 }
        },
        4: { // Far Back Center
            top: "30%", left: "30%", width: "25%", height: "25%", zIndex: 10, opacity: 0.2,
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
                    transition: { duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }
                },
                exit: { 
                    opacity: 0, 
                    scale: 0.9,
                    transition: { duration: 0.4 } 
                }
            }}
            className="absolute rounded-[2.5rem] overflow-hidden shadow-2xl bg-black/20 backdrop-blur-[2px]"
            style={{ 
                top: currentVariant.top,
                left: currentVariant.left,
                width: currentVariant.width,
                height: currentVariant.height,
                zIndex: currentVariant.zIndex,
                boxShadow: `0 ${20 - index * 4}px ${40 - index * 5}px -12px rgba(0, 0, 0, 0.6)`
            }}
        >
             {/* Image Container */}
             <div 
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: src.includes('gradient') ? src : `url(${src})`,
                }}
             />

             {/* Darkening Overlay: Specific for text contrast on main image, subtle for others */}
             <div className={cn(
                 "absolute inset-0 pointer-events-none transition-colors duration-500",
                 index === 0 ? "bg-black/30" : "bg-black/10"
             )} />

             {/* Inner Glass Highlights */}
             <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />
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
