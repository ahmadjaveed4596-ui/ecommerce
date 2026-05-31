import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

interface FashionHeroProps {
  onSelectGender: (gender: 'all' | 'men' | 'women' | 'unisex') => void;
  onSelectCategory: (category: string) => void;
}

interface SlideItem {
  id: number;
  headline: string;
  subtext: string;
  bgImage: string; // fallback high-res image
  videoUrl: string; // high quality direct Pexels vimeo link
  ctaType: 'split' | 'single';
  ctaText1?: string;
  ctaText2?: string;
  action1: () => void;
  action2?: () => void;
}

export const FashionHero: React.FC<FashionHeroProps> = ({ onSelectGender, onSelectCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen width to optimize media preloads and layout calculations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to catalog section helper
  const scrollToCatalog = () => {
    const section = document.getElementById('catalog-controls-bar');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const slides: SlideItem[] = [
    {
      id: 1,
      headline: "Redefine Your Style",
      subtext: "Discover premium fashion crafted for modern men and women.",
      bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
      videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e33013ba6a655074e0d99dc0f67&profile_id=165&oauth2_token_id=57447761",
      ctaType: 'split',
      ctaText1: "Shop Men",
      ctaText2: "Shop Women",
      action1: () => {
        onSelectGender('men');
        onSelectCategory('all');
        scrollToCatalog();
      },
      action2: () => {
        onSelectGender('women');
        onSelectCategory('all');
        scrollToCatalog();
      }
    },
    {
      id: 2,
      headline: "Luxury Meets Streetwear",
      subtext: "Explore the latest trends inspired by global fashion culture.",
      bgImage: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1600&auto=format&fit=crop",
      videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=73bf2af18ae175955680199f36f98c8e19c362a9&profile_id=165&oauth2_token_id=57447761",
      ctaType: 'single',
      ctaText1: "Explore Collection",
      action1: () => {
        onSelectGender('all');
        onSelectCategory('all');
        scrollToCatalog();
      }
    },
    {
      id: 3,
      headline: "New Season Arrivals",
      subtext: "Fresh designs, premium comfort, timeless confidence.",
      bgImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      videoUrl: "https://player.vimeo.com/external/517602379.sd.mp4?s=7b018fb3754c01fe23178df6e6417730e6fcfa18&profile_id=165&oauth2_token_id=57447761",
      ctaType: 'single',
      ctaText1: "Shop New Arrivals",
      action1: () => {
        onSelectGender('all');
        onSelectCategory('New-In / Outerwear');
        scrollToCatalog();
      }
    },
    {
      id: 4,
      headline: "Elegance in Every Detail",
      subtext: "Minimal fashion with maximum impact.",
      bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
      videoUrl: "https://player.vimeo.com/external/371433919.sd.mp4?s=d401306d194f479ee3a0f76cfab258ed6b23d9a1&profile_id=165&oauth2_token_id=57447761",
      ctaType: 'single',
      ctaText1: "View Lookbook",
      action1: () => {
        onSelectGender('unisex');
        onSelectCategory('all');
        scrollToCatalog();
      }
    },
    {
      id: 5,
      headline: "Fashion That Moves With You",
      subtext: "Dynamic styles built for everyday confidence.",
      bgImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
      videoUrl: "https://player.vimeo.com/external/482811373.sd.mp4?s=0fc4d32a0cc60da92cf3eed0b8ba04ef3a1b0b53&profile_id=165&oauth2_token_id=57447761",
      ctaType: 'single',
      ctaText1: "Start Shopping",
      action1: () => {
        scrollToCatalog();
      }
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // Keyboard controls for a high accessibility standard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autoplay loop with smooth progression ticks
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 6000; // 6 seconds auto-slide
    const stepTime = 50; 
    const maxProgressSteps = intervalTime / stepTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / maxProgressSteps);
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlide]);

  // Handle mobile touch horizontal swipe gestures, preventing vertical hijack
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null || touchStartY === null || touchEndY === null) return;
    const diffX = touchStart - touchEnd;
    const diffY = touchStartY - touchEndY;

    // Transition ONLY if horizontal swipe is greater than vertical & crosses 50px threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartY(null);
    setTouchEndY(null);
  };

  // Animation variants for stunning cinematic header sequences
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      id="homepage-fashion-hero-slider"
      className="relative w-full h-[500px] sm:h-[620px] md:h-[680px] lg:h-[78vh] xl:h-[84vh] min-h-[460px] max-h-[900px] bg-[#05051F] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl group/hero select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Immersive Cinematic Shades & Contrast Enhanced Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05051F]/90 via-[#05051F]/30 to-[#05051F]/45 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(5,5,31,0.65)_100%)] pointer-events-none opacity-90" />
      
      {/* Heavy Mobile Vignette overlay to guarantee absolute typography contrast */}
      <div className="absolute inset-x-0 bottom-0 h-4/5 z-10 bg-gradient-to-t from-[#05051F] via-[#05051F]/55 to-transparent md:hidden pointer-events-none" />

      {/* Media Rendering Stage - Framer Motion hardware accelerated cross-fade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Cinematic Background Image always scales slowly to create a paralax vibe */}
            <motion.img
              src={slides[currentSlide].bgImage}
              alt=""
              initial={{ scale: 1.02, filter: 'brightness(0.7)' }}
              animate={{ scale: 1.1, filter: isMobile ? 'brightness(0.48)' : 'brightness(0.68)' }}
              transition={{ duration: 7, ease: "linear" }}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Premium Video loop - completely skipped on mobile views to maximize load speed and battery health */}
            {!isMobile && (
              <video
                ref={(el) => {
                  videoRefs.current[currentSlide] = el;
                }}
                src={slides[currentSlide].videoUrl}
                loop
                muted={isMuted}
                playsInline
                aria-hidden="true"
                onCanPlayThrough={() => {
                  setVideoLoaded((prev) => ({ ...prev, [currentSlide]: true }));
                  videoRefs.current[currentSlide]?.play().catch(() => {});
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 pointer-events-none ${
                  videoLoaded[currentSlide] ? 'opacity-80' : 'opacity-0'
                }`}
                style={{
                  filter: 'brightness(0.55)'
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Overlaid Luxury Content Panel */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 h-full text-[#FFFDFC] max-w-7xl mx-auto w-full">
        
        {/* TOP COMPROMISE TAB BAR */}
        <div className="flex justify-between items-center w-full">
          <div className="px-3.5 py-1.5 text-[8px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.25em] bg-[#FFFDFC]/10 backdrop-blur-md rounded-full border border-[#FFFDFC]/15 uppercase font-mono">
            Aura Premium Concept Room
          </div>
          
          {/* Mute toggle button - hidden on mobile since video tracks do not process */}
          {!isMobile && (
            <button
              id="hero-mute-status-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2.5 rounded-full bg-[#05051F]/50 hover:bg-[#F54927] hover:scale-110 active:scale-95 border border-[#FFFDFC]/20 hover:border-[#F54927] transition-all duration-300 shadow-xl cursor-pointer text-[#FFFDFC]"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 animate-shake" />
              ) : (
                <Volume2 className="w-4 h-4 animate-pulse" />
              )}
            </button>
          )}
        </div>

        {/* CENTER COLUMN: TEXTUAL INFORMATION CORED IN HIGH READABILITY SHADOWS */}
        <div className="max-w-2xl space-y-4 sm:space-y-6 mt-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4 sm:space-y-5"
            >
              {/* Headline */}
              <motion.h2 
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] uppercase font-sans text-[#FFFDFC]"
              >
                {slides[currentSlide].headline}
              </motion.h2>

              {/* Subtext Paragraph */}
              <motion.p 
                variants={itemVariants}
                className="text-xs sm:text-sm md:text-base text-slate-200/90 leading-relaxed font-sans max-w-lg font-medium"
              >
                {slides[currentSlide].subtext}
              </motion.p>

              {/* Action Buttons Staggered */}
              <motion.div 
                variants={itemVariants} 
                className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto"
              >
                {slides[currentSlide].ctaType === 'split' ? (
                  <>
                    <motion.button
                      id="hero-split-cta-left"
                      onClick={slides[currentSlide].action1}
                      whileHover={{ 
                        scale: 1.04,
                        boxShadow: "0 0 15px rgba(245, 73, 39, 0.45)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-[#F54927] hover:bg-[#05051F] text-[#FFFDFC] font-bold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 shadow-xl cursor-pointer w-full sm:w-auto min-w-[130px] sm:min-w-[145px] text-center"
                    >
                      {slides[currentSlide].ctaText1}
                    </motion.button>
                    <motion.button
                      id="hero-split-cta-right"
                      onClick={slides[currentSlide].action2}
                      whileHover={{ 
                        scale: 1.04,
                        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                        backgroundColor: "#F54927",
                        borderColor: "#F54927"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-[#05051F]/45 text-[#FFFDFC] font-bold text-xs uppercase tracking-widest rounded-full border border-white/35 backdrop-blur-md transition-colors duration-300 shadow-xl cursor-pointer w-full sm:w-auto min-w-[130px] sm:min-w-[145px] text-center"
                    >
                      {slides[currentSlide].ctaText2}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    id="hero-single-cta"
                    onClick={slides[currentSlide].action1}
                    whileHover={{ 
                      scale: 1.04,
                      boxShadow: "0 0 20px rgba(245, 73, 39, 0.5)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-[#F54927] text-[#FFFDFC] hover:bg-[#05051F] font-extrabold text-xs uppercase tracking-widest rounded-full transition-colors duration-300 shadow-xl cursor-pointer w-full sm:w-auto text-center"
                  >
                    {slides[currentSlide].ctaText1}
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM SECTION: NAVIGATION CONTROLS & AUTO-PLAY METRICS */}
        <div className="flex items-center justify-between border-t border-[#FFFDFC]/10 pt-4 sm:pt-6 w-full mt-5 sm:mt-8">
          
          {/* Mouse scrolling down luxury tracker - hidden on touch devices */}
          <button
            id="hero-scroll-down-mouse"
            onClick={scrollToCatalog}
            className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5EBE6]/60 hover:text-[#FFFDFC] transition-colors group cursor-pointer"
          >
            <div className="w-5 h-8 border-2 border-[#F5EBE6]/40 group-hover:border-[#F54927] rounded-full flex justify-center p-1 transition-colors relative">
              <span className="w-1 h-1.5 bg-[#F54927] rounded-full animate-bounce mt-1"></span>
            </div>
            <span>Scroll To Showcase</span>
          </button>

          {/* Slider Pagination Metrics & Carousel arrow indicator */}
          <div className="flex items-center justify-center sm:justify-end gap-6 w-full sm:w-auto">
            
            {/* Pagination Dots with fluid animated progress pipelines */}
            <div className="flex items-center gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  id={`hero-slide-indicator-${i}`}
                  onClick={() => {
                    setCurrentSlide(i);
                    setProgress(0);
                  }}
                  className="relative h-1.5 rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#F54927]/60"
                  style={{
                    width: i === currentSlide ? '42px' : '8px',
                    backgroundColor: i === currentSlide ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'
                  }}
                  title={`Jump to slide ${i + 1}`}
                  aria-label={`Slide ${i + 1}`}
                >
                  {i === currentSlide && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#F54927] rounded-full shadow-[0_0_8px_rgba(245,73,39,0.7)] transition-all ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Hardware-accelerated glass control arrow buttons - hidden on mobile screens because swipe gestures are present */}
            {!isMobile && (
              <div className="flex items-center gap-2.5">
                <button
                  id="hero-arrow-prev"
                  onClick={handlePrev}
                  className="p-2.5 bg-[#05051F]/40 hover:bg-[#F54927] hover:text-[#FFFDFC] border border-[#FFFDFC]/10 hover:border-[#F54927] rounded-full transition-all duration-300 cursor-pointer text-slate-300 active:scale-90"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="hero-arrow-next"
                  onClick={handleNext}
                  className="p-2.5 bg-[#05051F]/40 hover:bg-[#F54927] hover:text-[#FFFDFC] border border-[#FFFDFC]/10 hover:border-[#F54927] rounded-full transition-all duration-300 cursor-pointer text-slate-300 active:scale-90"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
