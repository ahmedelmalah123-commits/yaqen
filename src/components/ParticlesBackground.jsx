import React from 'react';
import { motion } from 'framer-motion';

const ParticlesBackground = ({ count = 40, color = 'var(--accent-glow)' }) => {
  const particles = Array.from({ length: count });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => {
        const size = Math.random() * 5 + 2;
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 120}%`;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        const xOffset = (Math.random() - 0.5) * 150;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 0.35, 0.7, 0],
              y: [0, -Math.random() * 300 - 150],
              x: [0, xOffset],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left,
              top,
              backgroundColor: color,
              filter: `blur(${Math.random() * 1.5}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticlesBackground;
