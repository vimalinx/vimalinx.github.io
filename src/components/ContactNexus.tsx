import { useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { config, type Language } from '../config';

interface ContactNexusProps {
  lang: Language;
}

export const ContactNexus = ({ lang }: ContactNexusProps) => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  
  // Mouse position for floating preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the cursor follower
  const springConfig = { damping: 20, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update raw mouse values relative to the viewport
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const currentSocial = config.socials.find(s => s.id === hoveredSocial);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-black px-6 py-20 md:px-24"
    >
      {/* Background Gradient Spot that follows hover roughly or just ambient */}
      <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="z-10 mt-8 sm:mt-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4"
        >
            <div className="h-px w-8 bg-white/50 sm:w-12" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 sm:text-sm">
                {lang === 'zh' ? '联系' : 'Contact'}
            </span>
        </motion.div>
        <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
        >
            {lang === 'zh' ? '保持' : 'Let\'s'}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                {lang === 'zh' ? '联络' : 'Talk'}.
            </span>
        </motion.h1>
      </div>

      {/* Main Content Grid */}
      <div className="z-10 flex flex-col md:flex-row md:items-end justify-between w-full h-full pb-8 sm:pb-12">

        {/* Left Side: The List */}
        <div className="flex flex-col items-start gap-2 mt-6 md:mt-0 w-full md:max-w-xl lg:max-w-2xl">
            {config.socials.map((social, index) => (
            <ListItem
                key={social.id}
                social={social}
                index={index}
                lang={lang}
                setHovered={setHoveredSocial}
            />
            ))}
        </div>

        {/* Right Side: Dynamic Info Panel */}
        <div className="hidden lg:flex flex-col justify-end items-end w-full max-w-md h-64 mb-10 relative z-10 pointer-events-none">
            <AnimatePresence mode="wait">
                {currentSocial && currentSocial.details && (
                    <motion.div
                        key={currentSocial.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-right space-y-6"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block"
                        >
                             <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-gray-300 uppercase tracking-widest bg-white/5 backdrop-blur-sm">
                                 About {currentSocial.name.en}
                             </span>
                        </motion.div>

                        <div className="space-y-4">
                            {currentSocial.details[lang].map((paragraph, idx) => (
                                <motion.p 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                                    className="text-lg md:text-xl text-gray-300 leading-relaxed font-light"
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Default State (When nothing is hovered) */}
            {!currentSocial && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 right-0"
                >
                     <div className="flex items-center gap-2 opacity-30">
                        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-xs uppercase tracking-[0.2em] text-white">
                            {lang === 'zh' ? '等待指令' : 'Awaiting Input'}
                        </span>
                     </div>
                </motion.div>
            )}
        </div>
      </div>

      {/* Floating Preview (Cursor Follower) */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          top: 0,
          left: 0,
          position: "fixed",
          pointerEvents: "none",
          zIndex: 50,
        }}
        className="hidden md:block"
      >
        <AnimatePresence>
          {hoveredSocial && currentSocial && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="relative -ml-32 -mt-32 flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-gray-900/90 shadow-2xl backdrop-blur-xl"
            >
              {currentSocial.type === 'qrcode' ? (
                <div className="h-full w-full p-4 bg-white flex items-center justify-center">
                    <img src={currentSocial.qrCode} alt="QR" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-800 to-black p-6 text-center">
                    <currentSocial.icon className="h-16 w-16 text-white/80" />
                    <p className="text-sm font-medium text-gray-400">Click to visit</p>
                </div>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md">
                 {currentSocial.name[lang]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Large Background Watermark */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden">
        <h2 className="text-[20vh] font-black leading-none tracking-tighter text-white/[0.03] uppercase vertical-text">
            {config.profile.englishName}
        </h2>
      </div>

      <footer className="z-10 flex w-full items-end justify-between border-t border-white/10 pt-6 pb-4 sm:pt-8 text-xs sm:text-sm text-gray-600">
        <div>
           <p>© {new Date().getFullYear()} {config.profile.englishName}</p>
        </div>
        <div className="hidden sm:flex gap-4 sm:gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">Email</span>
        </div>
      </footer>
    </div>
  );
};

const ListItem = ({ social, index, lang, setHovered }: { 

    social: typeof config.socials[0], 

    index: number, 

    lang: Language, 

    setHovered: (id: string | null) => void 

}) => {

    // Local state for mobile expansion

    const [isExpanded, setIsExpanded] = useState(false);



    const handleClick = (e: React.MouseEvent) => {

        // On mobile, toggle expansion. On desktop, click opens link directly (if link type).

        if (window.innerWidth < 1024) {

             e.preventDefault();

             setIsExpanded(!isExpanded);

        }

    };



    return (

        <div className="w-full">

            <motion.a

                href={social.url || '#'}

                target={social.url ? "_blank" : undefined}

                rel="noreferrer"

                onClick={handleClick}

                initial={{ opacity: 0, x: -50 }}

                whileInView={{ opacity: 1, x: 0 }}

                transition={{ delay: index * 0.1, duration: 0.6 }}

                onMouseEnter={() => setHovered(social.id)}

                onMouseLeave={() => setHovered(null)}

                className="group relative flex w-full max-w-2xl items-center justify-between border-b border-white/10 py-5 sm:py-6 md:py-8 transition-all hover:border-white/50 cursor-pointer"

            >

                <div className="flex items-center gap-4 sm:gap-6">

                    <span className="text-xs font-mono text-gray-600 group-hover:text-purple-400 transition-colors">0{index + 1}</span>

                    <span className="text-xl font-bold text-gray-300 transition-all group-hover:translate-x-2 sm:group-hover:translate-x-4 group-hover:text-white sm:text-2xl md:text-4xl lg:text-5xl">

                        {social.name[lang]}

                    </span>

                </div>



                <div className="opacity-0 transition-all duration-300 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 lg:block hidden">

                    {social.type === 'qrcode' ? (

                        <span className="text-sm uppercase tracking-widest text-gray-500">Scan</span>

                    ) : (

                        <ArrowUpRight className="h-8 w-8 text-white" />

                    )}

                </div>

                 {/* Mobile Chevron Indicator */}

                 <div className="lg:hidden text-gray-600">

                    <ArrowUpRight className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />

                 </div>

            </motion.a>



            {/* Mobile Accordion Details */}

            <AnimatePresence>

                {isExpanded && (

                    <motion.div

                        initial={{ height: 0, opacity: 0 }}

                        animate={{ height: 'auto', opacity: 1 }}

                        exit={{ height: 0, opacity: 0 }}

                        className="overflow-hidden lg:hidden"

                    >

                        <div className="py-4 sm:py-6 space-y-3 sm:space-y-4 pl-10 sm:pl-12 border-b border-white/5">

                            {social.type === 'qrcode' && (

                                <div className="mb-2">

                                    <img src={social.qrCode} alt="QR" className="w-28 h-28 sm:w-32 sm:h-32 object-contain bg-white p-2 rounded-lg" />

                                </div>

                            )}

                            {social.details && social.details[lang].map((p, i) => (

                                <p key={i} className="text-gray-400 text-sm leading-relaxed sm:text-base">{p}</p>

                            ))}

                            {social.url && social.type === 'link' && (

                                <a href={social.url} target="_blank" className="text-purple-400 text-sm font-medium flex items-center gap-2 mt-2">

                                    {lang === 'zh' ? '访问链接' : 'Visit Link'} <ArrowUpRight className="h-3 w-3" />

                                </a>

                            )}

                        </div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>

    )

}
