import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { config, type Language } from '../config';
import { cn } from '../lib/utils';

interface ProjectWheelProps {
  lang: Language;
}

export const ProjectWheel = ({ lang }: ProjectWheelProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const exitLocked = useRef(true); // Default locked when entering or changing index
  
  // Reset exit lock whenever active index changes
  useEffect(() => {
      exitLocked.current = true;
  }, [activeIndex]);

  // Wheel configuration
  const radius = 350; 
  const itemAngle = 30; 
  const wheelRotation = 180 - activeIndex * itemAngle;
  const currentProject = config.projects[activeIndex];

  // Smart Scroll Handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      // 1. Boundary Check: Last Item Downward Scroll (The 0.6s Delay Logic)
      if (isScrollingDown && activeIndex === config.projects.length - 1) {
          if (exitLocked.current) {
              // First time trying to exit? Block it and start timer.
              e.preventDefault();
              e.stopPropagation();
              
              // Only start unlock timer if not already doing something? 
              // Actually, we just set a timeout to unlock it.
              // To avoid spamming timeouts, we could check if a timer is active, but simple is fine here.
              setTimeout(() => {
                  exitLocked.current = false;
              }, 600); // 0.6s delay
              return;
          }
          // If exitLocked is false, let it bubble (allow exit)
          return;
      }

      // 2. Boundary Check: First Item Upward Scroll
      if (isScrollingUp && activeIndex === 0) {
          // Immediate exit for top, or same logic? Usually top doesn't need delay.
          return; 
      }

      // 3. Animation Lock for Internal Switching
      if (isAnimating.current) {
          e.preventDefault();
          e.stopPropagation();
          return;
      }

      // 4. Internal Switching
      if (isScrollingDown && activeIndex < config.projects.length - 1) {
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch(activeIndex + 1);
      } else if (isScrollingUp && activeIndex > 0) {
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch(activeIndex - 1);
      }
    };

    // Passive: false is required to use preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeIndex]);

  const triggerSwitch = (newIndex: number) => {
    isAnimating.current = true;
    setActiveIndex(newIndex);
    // Lock interaction for a short duration to match animation
    setTimeout(() => {
        isAnimating.current = false;
    }, 600);
  };

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black flex flex-col md:flex-row">
      
      {/* 1. Left Side: Immersive Background & Content */}
      <div className="relative h-1/2 w-full md:h-full md:w-2/3 lg:w-3/4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            {/* Background Image / Gradient */}
            <div 
              className="h-full w-full bg-cover bg-center transition-all duration-700 ease-in-out"
              style={{ 
                background: currentProject.image.includes('gradient') 
                  ? currentProject.image 
                  : `url(${currentProject.image})`,
                backgroundSize: 'cover'
              }} 
            />
            
            {/* Overlay Gradient: Left to Right Transparency (Left solid image -> Right fades to black) */}
            {/* Actually, the user wants "Left to Right transparency increases" -> Left shows image, Right shows content/black? 
               User said: "Left side displays project image, transparency increases from left to right" 
               So Left = Visible Image, Right = Faded/Black to merge with wheel area.
            */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/60 to-black" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-none" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:justify-center md:p-16 lg:p-24">
          <motion.div
            key={currentProject.id + "-text"}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
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

            <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
              {currentProject.title}
            </h2>

            <p className="mb-8 text-lg text-gray-300 md:text-xl leading-relaxed max-w-lg">
              {currentProject.description[lang]}
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href={currentProject.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition-all hover:bg-gray-200"
              >
                {lang === 'zh' ? '访问项目' : 'Visit Project'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              
              <div className="flex gap-2">
                {currentProject.tags.map(tag => (
                   <span key={tag} className="flex items-center rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-gray-400 backdrop-blur-md">
                     {tag}
                   </span>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Controls (Hidden on Desktop) */}
            <div className="mt-8 flex items-center gap-4 lg:hidden">
                <button 
                    onClick={(e) => { e.stopPropagation(); triggerSwitch(activeIndex === 0 ? config.projects.length - 1 : activeIndex - 1); }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md active:scale-95"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); triggerSwitch(activeIndex === config.projects.length - 1 ? 0 : activeIndex + 1); }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md active:scale-95"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
                <span className="text-xs text-gray-500 font-mono">
                    {activeIndex + 1} / {config.projects.length}
                </span>
            </div>
          </motion.div>
        </div>
      </div>

            {/* 2. Right Side: The Wheel Control */}
            <div className="relative hidden h-full w-1/3 md:block lg:w-1/4">
               {/* The Semicircle Container */}
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
                    // Position calculations
                    // We want them distributed. 
                    // angle relative to wheel 0: index * itemAngle
                    const angle = index * itemAngle;
                    
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
                                transform: `rotate(${angle}deg) translate(${radius - 40}px) rotate(${-angle}deg)`, 
                            }}
                        >
                            <motion.div 
                                style={{ transform: `rotate(${-wheelRotation - angle}deg)` }} // Counter-rotate to keep icon upright always
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
      </div>
    </div>
  );
};
