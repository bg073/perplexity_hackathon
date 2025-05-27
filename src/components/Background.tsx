import React from 'react';
import { Particles } from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useChatStore } from '../store/chatStore';

const Background: React.FC = () => {
  const { theme } = useChatStore();

  // Initialize particle engine for tsparticles
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };


  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const particleOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: isDark ? '#ffffff' : '#6366F1',
      },
      links: {
        color: isDark ? '#ffffff' : '#6366F1',
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        random: true,
        speed: 0.5,
        direction: "none",
        outModes: {
          default: "out",
        },
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 40,
      },
      opacity: {
        value: 0.15,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

    return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-10"
      init={particlesInit}
      options={particleOptions}
    />
  );
};

export default Background;