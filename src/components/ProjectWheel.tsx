import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { config, type Language } from '../config';
import { cn } from '../lib/utils';
import { FloatingGallery } from './FloatingGallery';

interface ProjectWheelProps {
  lang: Language;
}

export const ProjectWheel = ({ lang }: ProjectWheelProps) => {
  const [activeIndex, setActiveIndex] = useState(0); // Start with CyberGift (index 0)
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 }); // Detect visibility
  const isAnimating = useRef(false);
  const exitLocked = useRef(true); 
  
  useEffect(() => {
      exitLocked.current = true;
  }, [activeIndex]);

  const radius = 350;
  const itemAngle = 30;
  // Calculate wheel rotation to bring active item to left (180° position)
  // With reversed order: active item's angle = (total - 1 - activeIndex) * itemAngle
  const wheelRotation = 180 - (config.projects.length - 1 - activeIndex) * itemAngle;
  const currentProject = config.projects[activeIndex];

  // Smart Scroll Handler... (omitted for brevity, keep existing)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      // NATURAL LOGIC:
      // Down Scroll -> Go to Next Item (index increases)
      // Up Scroll -> Go to Previous Item (index decreases)

      // 1. Boundary Checks (Exit conditions)
      // If Scrolling UP (trying to go Prev) AND at Start (Index 0) -> Let it bubble to scroll page UP (to Hero)
      if (isScrollingUp && activeIndex === 0) {
          return;
      }

      // If Scrolling DOWN (trying to go Next) AND at End (Index Length-1) -> Let it bubble to scroll page DOWN (to Contact)
      if (isScrollingDown && activeIndex === config.projects.length - 1) {
          if (exitLocked.current) {
              e.preventDefault();
              e.stopPropagation();
              setTimeout(() => { exitLocked.current = false; }, 600);
              return;
          }
          return;
      }

      // 2. Animation Lock
      if (isAnimating.current) {
          e.preventDefault();
          e.stopPropagation();
          return;
      }

      // 3. Internal Switching (Natural)
      if (isScrollingDown && activeIndex < config.projects.length - 1) {
        // Scroll Down -> Go Next
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch(activeIndex + 1);
      } else if (isScrollingUp && activeIndex > 0) {
        // Scroll Up -> Go Prev
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch(activeIndex - 1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeIndex]);

  const triggerSwitch = (newIndex: number) => {
    isAnimating.current = true;
    setActiveIndex(newIndex);
    setTimeout(() => {
        isAnimating.current = false;
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
  };

  return (
    <motion.div 
        ref={containerRef} 
        className="relative h-screen w-full overflow-hidden bg-black flex flex-col md:flex-row"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
    >
      
      {/* 1. Left Side: Immersive Background & Content */}
      <motion.div 
        variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
            }
        }}
        className="relative h-1/2 w-full md:h-full md:w-2/3 lg:w-3/4 overflow-hidden"
      >
        
        {/* Background Base */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="h-full w-full bg-cover bg-center transition-all duration-700 ease-in-out blur-xl opacity-50 scale-110" // Blurred background for gallery contrast
              style={{ 
                background: currentProject.image.includes('gradient') 
                  ? currentProject.image 
                  : `url(${currentProject.image})`,
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-none" />
          </motion.div>
        </AnimatePresence>
        
        {/* Floating Gallery (Desktop Only) - Placed behind text */}
        <div className="hidden md:block absolute inset-0 z-10">
            {isInView && (
                <FloatingGallery images={currentProject.gallery || []} activeIndex={activeIndex} />
            )}
        </div>

        {/* Gradient Mask: Left-to-Right Fade for Text Readability */}
        <div className="absolute inset-y-0 left-0 w-[80%] z-10 pointer-events-none bg-gradient-to-r from-black via-black/60 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:justify-center md:p-16 lg:p-24 pointer-events-none">
          <motion.div
            key={currentProject.id + "-text"}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl pointer-events-auto"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md", 
                  `text-${currentProject.accent?.split('-')[1] || 'white'}-400` // messy dynamic class, fallback to white
              )}>
                <currentProject.icon className="h-5 w-5 text-white" />
              </div>
              <span className={cn("rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm",
                 currentProject.status === 'Live' ? 'text-green-400 border-green-500/30' : 'text-amber-400 border-amber-500/30'
              )}>
                {currentProject.status}
              </span>
            </div>

            <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
              {currentProject.title}
            </h2>

            <p className="mb-6 text-base text-gray-300 md:text-xl leading-relaxed max-w-lg whitespace-pre-line sm:text-lg">
              {currentProject.description[lang]}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href={currentProject.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gray-200 sm:px-6 sm:py-3"
              >
                {lang === 'zh' ? '访问项目' : 'Visit Project'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <div className="flex gap-2">
                {currentProject.tags.map(tag => (
                   <span key={tag} className="flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
                     {tag}
                   </span>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Controls (Hidden on Desktop) */}
            <div className="mt-8 flex flex-col gap-6 lg:hidden">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2">
                    {config.projects.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); triggerSwitch(idx); }}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                idx === activeIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/30'
                            }`}
                        />
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); triggerSwitch(activeIndex === 0 ? config.projects.length - 1 : activeIndex - 1); }}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md active:scale-95 transition-all hover:bg-white/10"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-white">
                            {String(activeIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                            / {String(config.projects.length).padStart(2, '0')}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); triggerSwitch(activeIndex === config.projects.length - 1 ? 0 : activeIndex + 1); }}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md active:scale-95 transition-all hover:bg-white/10"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>

                {/* Project Name Indicator */}
                <motion.div
                    key={currentProject.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <span className="text-sm font-medium text-purple-400">
                        {currentProject.title}
                    </span>
                </motion.div>
            </div>
          </motion.div>
        </div>
                  </motion.div>
            
                              {/* 2. Right Side: The Wheel Control */}
                  <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.8, x: 50 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
                        }
                    }}
                    className="relative hidden h-full w-1/3 md:block lg:w-1/4"
                  >               {/* The Semicircle Container */}
               <div 
                  className="absolute right-0 top-1/2 flex items-center justify-center"
                  style={{ 
                      transform: 'translate(50%, -50%)', 
                      width: radius * 2,
                      height: radius * 2,
                  }}
               >
                  {/* Active Indicator (Now placed BEFORE the wheel to stay behind icons) */}
                  <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 flex items-center gap-2 z-0">
                      <div className="h-[2px] w-24 bg-gradient-to-l from-white/40 to-transparent" />
                      <div className="h-4 w-4 rounded-full bg-white/20 blur-sm shadow-[0_0_20px_white]" />
                  </div>
      
                  {/* The Rotating Wheel (Main Orbit) */}
                  <motion.div
                      className="relative h-full w-full z-10"
                      animate={{ rotate: wheelRotation }}
                      transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  >
                      {/* Visual Ring: Main Orbit Line (Thicker with breathing animation) */}
                      <motion.div 
                          animate={{
                              opacity: [0.2, 0.5, 0.2],
                              scale: [1, 1.01, 1]
                          }}
                          transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                          }}
                          className="absolute inset-0 rounded-full border-[3px] border-white/30 border-dashed" 
                      />
                      
                      {/* Visual Ring: Inner Decorative Orbit */}
                      <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-[15%] rounded-full border border-white/5 border-dotted" 
                      />
                {/* Items on the wheel */}
                {config.projects.map((project, index) => {
                    // Position calculations - REVERSED ORDER
                    // We want icons arranged in reverse order on the wheel
                    // CogniRead (index 3) at angle 0 (right top)
                    // CyberGift (index 0) at angle 90 (right bottom)
                    const angle = (config.projects.length - 1 - index) * itemAngle;
                    
                    return (
                        <motion.button
                            key={project.id}
                            onClick={() => {
                                if (isAnimating.current) return;
                                triggerSwitch(index);
                            }}
                            className={cn(
                                "absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300",
                                activeIndex === index
                                    ? "z-10 border-white bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                    : "z-0 border-white/10 bg-black/80 text-gray-500 hover:border-white/50 hover:text-white"
                            )}
                            style={{
                                transform: `rotate(${angle}deg) translate(${radius - 40}px)`,
                            }}
                        >
                            <motion.div
                                animate={{ rotate: -(wheelRotation + angle) }}
                                transition={{ type: "spring", stiffness: 50, damping: 15 }}
                            >
                                <project.icon className="h-6 w-6" />
                            </motion.div>
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Static Decor: Outer Ring (Fixed in space) */}
            <div className="absolute inset-[-10%] rounded-full border border-white/5 pointer-events-none" />

            {/* Active Indicator (Static on screen, points to active item) */}
            <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="h-px w-12 bg-gradient-to-l from-white to-transparent" />
                <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_white]" />
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
};
