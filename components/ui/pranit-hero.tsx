import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Download, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonalInfo } from '@/types/portfolio';

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  [key: string]: unknown;
}

function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
  href?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", icon, href, className, onClick, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto min-w-32 cursor-pointer overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-sm p-3 text-center font-semibold text-white hover:border-white/40 transition-all duration-300",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 flex items-center gap-2">
        {icon}
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span className="flex items-center gap-2">
          {icon}
          {text}
        </span>
        <ExternalLink className="w-4 h-4" />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-white/20 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-white/10"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

interface TextRotatorProps {
  words: string[];
  className?: string;
  interval?: number;
}

const TextRotator = ({
  words,
  className = "",
  interval = 3000,
}: TextRotatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
      scale: 0.9
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -20,
      filter: "blur(5px)",
      scale: 0.9,
      transition: {
        delay: i * 0.02,
        duration: 0.3,
        ease: "easeInOut"
      }
    })
  };

  const getGradientColors = (index: number, total: number) => {
    const hueStart = (currentIndex * 30) % 360;
    const hue = hueStart + (index / total * 60);
    return `hsl(${hue}, 80%, 60%)`;
  };

  return (
    <span className={cn(
      "relative inline-block min-w-[200px] min-h-[1.5em]",
      className
    )}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="absolute inset-0 flex items-center justify-center w-full"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {words[currentIndex].split('').map((letter, i, array) => (
            <motion.span
              key={`${currentIndex}-${i}`}
              custom={i}
              variants={letterVariants}
              style={{
                color: getGradientColors(i, array.length),
                display: 'inline-block',
                textShadow: '0 0 15px rgba(100, 100, 200, 0.15)',
                fontWeight: 'inherit'
              }}
              className={letter === ' ' ? 'ml-2' : ''}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
      <span className="opacity-0">{words[0]}</span>
    </span>
  );
};

interface PranitHeroProps {
  personalInfo: PersonalInfo;
}

const PranitHero = ({ personalInfo }: PranitHeroProps) => {
  const rotatingWords = ["GraphRAG Systems", "Startup Success", "AI Innovation", "Cost Optimization"];
  
  const contactLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-4 h-4" />,
      href: personalInfo.contact.github,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      href: personalInfo.contact.linkedin,
    },
    {
      name: "Email",
      icon: <Mail className="w-4 h-4" />,
      href: `mailto:${personalInfo.contact.email}`,
    },
    {
      name: "Website",
      icon: <Globe className="w-4 h-4" />,
      href: personalInfo.contact.website,
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Grid Pattern */}
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
        ]}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-white/10 stroke-white/10",
        )}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 blur-xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/80 font-medium">{personalInfo.availability}</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              {personalInfo.name}
            </span>
          </motion.h1>

          {/* Professional Title with Rotating Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 text-white/90"
          >
            <span>Creating </span>
            <TextRotator
              words={rotatingWords}
              className="font-bold"
              interval={3000}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {personalInfo.tagline}
          </motion.p>

          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {contactLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <InteractiveHoverButton
                  text={link.name}
                  icon={link.icon}
                  href={link.href}
                  className="text-sm"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Glass Cards for Achievements */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 left-10 hidden lg:block"
      >
        <GlassCard className="w-64 p-6">
          <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Key Achievements
          </h3>
          <div className="space-y-2 text-white/70 text-sm">
            {personalInfo.highlighted_achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.7 }}
        className="absolute bottom-10 right-10 hidden lg:block"
      >
        <GlassCard className="w-64 p-6">
          <h3 className="text-white font-semibold text-lg mb-3">Location & Contact</h3>
          <div className="space-y-3 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="pt-2 border-t border-white/10">
              <span className="text-white/50">Ready to connect</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default PranitHero; 