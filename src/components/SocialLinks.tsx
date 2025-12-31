import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { config, type Language } from '../config';

interface SocialLinksProps {
  lang?: Language;
}

export const SocialLinks = ({ lang = 'zh' }: SocialLinksProps) => {
  const [activeQr, setActiveQr] = useState<string | null>(null);

  const handleSocialClick = (social: typeof config.socials[0]) => {
    if (social.type === 'qrcode') {
      setActiveQr(social.qrCode || null);
    } else if (social.url) {
      window.open(social.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center gap-6"
      >
        {config.socials.map((social) => (
          <button
            key={social.id}
            onClick={() => handleSocialClick(social)}
            className={`group relative flex items-center justify-center transition-transform hover:scale-110 focus:outline-none`}
            aria-label={social.name[lang]}
          >
            <div className={`absolute inset-0 -z-10 scale-0 rounded-full bg-white/10 blur-md transition-transform duration-300 group-hover:scale-150`} />
            <social.icon className={`h-6 w-6 text-gray-400 transition-colors duration-300 ${social.color} group-hover:text-white`} />
            <span className="sr-only">{social.name[lang]}</span>
          </button>
        ))}
      </motion.div>


      {/* QR Code Modal */}
      <AnimatePresence>
        {activeQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveQr(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gray-900/90 p-1 shadow-2xl backdrop-blur-xl"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white p-2">
                 {/* Placeholder text if image fails to load or hasn't been replaced yet */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    QR Code Image
                 </div>
                 <img 
                   src={activeQr} 
                   alt="Scan QR Code" 
                   className="relative z-10 h-full w-full object-contain"
                   onError={(e) => {
                     // Fallback to show it's a placeholder
                     (e.target as HTMLImageElement).style.opacity = '0.5';
                   }}
                 />
              </div>
              <button
                onClick={() => setActiveQr(null)}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-1 text-white backdrop-blur-md hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-4 text-center">
                <p className="text-sm text-gray-400">Scan to connect</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
