import { useEffect, useRef } from 'react';

export const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    // Configuration for the 3 wave layers
    const waves = [
      {
        name: "Main",
        color: 'rgba(255, 255, 255, 0.5)', // Brighter white
        amplitude: 50,
        frequency: 0.003,
        speed: 0.02,
        spacing: 30, // Regular spacing
        phase: 0,    // Start point
        verticalShift: 0
      },
      {
        name: "Secondary",
        color: 'rgba(100, 200, 255, 0.4)', // Cyan tint
        amplitude: 30,
        frequency: 0.005, // Faster ripple
        speed: 0.03,
        spacing: 45, // Wider spacing
        phase: Math.PI, // Start inverted (180 degrees shift) to avoid overlapping
        verticalShift: 20 // Slightly lower
      },
      {
        name: "Tertiary",
        color: 'rgba(200, 100, 255, 0.3)', // Purple tint
        amplitude: 70,
        frequency: 0.0015, // Slow long wave
        speed: 0.01,
        spacing: 20, // Dense spacing
        phase: Math.PI / 2, // 90 degrees shift
        verticalShift: -20 // Slightly higher
      }
    ];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Move baseline down to 70% of screen height
      const baselineY = height * 0.7;

      waves.forEach((wave) => {
        ctx.fillStyle = wave.color;
        
        // Breathing amplitude
        const currentAmp = wave.amplitude + Math.sin(time * 0.01) * 10;

        for (let x = 0; x < width; x += wave.spacing) {
          // Formula: Y = Baseline + VerticalShift + Sin(x * freq + time * speed + phase) * amp
          const y = baselineY + wave.verticalShift + 
                    Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * currentAmp;
          
          const size = 1.8; 
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
        init();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
    />
  );
};
