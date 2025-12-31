import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Languages } from 'lucide-react';
import { Background } from './components/Background';
import { ProjectWheel } from './components/ProjectWheel';
import { ContactNexus } from './components/ContactNexus';
import { config, type Language } from './config';

function App() {
  const [lang, setLang] = useState<Language>('zh');

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white selection:bg-purple-500/30">
      
      {/* Global Background (Persistent across sections) */}
      <div className="absolute inset-0 z-0">
         <Background />
      </div>

      {/* Floating Header / Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between px-6 py-6 md:px-12">
        <div className="text-xl font-bold tracking-tighter mix-blend-difference">VIMALINX</div>
        <button 
          onClick={toggleLang}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm backdrop-blur-md transition-all hover:bg-white/10"
        >
          <Languages className="h-4 w-4 text-gray-400 group-hover:text-white" />
          <span className="font-medium text-gray-300 group-hover:text-white">
            {lang === 'zh' ? 'EN' : '中文'}
          </span>
        </button>
      </header>

      {/* Scroll Snap Container */}
      <main className="h-screen w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        
        {/* SECTION 1: HERO */}
        <section className="relative flex h-screen w-full snap-start flex-col items-center justify-center px-6 md:px-12">
          <div className="z-10 flex flex-col items-start gap-8 max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false }}
            >
              <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-purple-400">
                {typeof config.profile.title === 'object' ? config.profile.title[lang] : config.profile.title}
              </h2>
              <h1 className="text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
                  {config.profile.name}
                </span>
                <span className="mt-2 block text-3xl font-light text-gray-500 sm:text-4xl md:text-5xl">
                  {config.profile.englishName}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-xl text-lg text-gray-400 md:text-xl leading-relaxed"
            >
              {typeof config.profile.bio === 'object' ? config.profile.bio[lang] : config.profile.bio}
            </motion.p>
            
            {/* SocialLinks moved to ContactNexus for better flow, but we can keep a "Scroll to explore" hint or simple CTA here if needed. 
                For now, let's keep it clean as requested. */}
          </div>

          {/* Scroll Hint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
          >
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs uppercase tracking-widest opacity-50">Explore</span>
                <ChevronDown className="h-6 w-6" />
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: PROJECTS WHEEL */}
        <section className="h-screen w-full snap-start overflow-hidden bg-black">
          <ProjectWheel lang={lang} />
        </section>

        {/* SECTION 3: CONTACT NEXUS */}
        <section className="h-screen w-full snap-start overflow-hidden">
          <ContactNexus lang={lang} />
        </section>

      </main>
    </div>
  );
}

export default App;
