import { motion } from 'framer-motion';

export const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* Primary Gradient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-purple-900/40 blur-[120px]"
      />

      {/* Secondary Gradient Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[20%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-indigo-900/40 blur-[120px]"
      />

      {/* Bottom Accent Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute -bottom-[20%] left-[20%] h-[40vh] w-[40vh] rounded-full bg-blue-900/30 blur-[100px]"
      />

      {/* Noise Texture Overlay for "Film Grain" feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 pointer-events-none"></div>
    </div>
  );
};
