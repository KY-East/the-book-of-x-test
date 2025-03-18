import { Theme } from '@/types/content';

export const cyberpunkTheme: Theme = {
  colors: {
    primary: '#00ff9d',
    secondary: '#ff00c8',
    background: '#0a0a0c',
    text: '#e0e0e8',
    accent: '#00aeff'
  },
  effects: {
    glitch: true,
    neon: true,
    scanlines: true
  }
};

export const glitchEffect = `
  @keyframes glitch {
    0% {
      transform: translate(0);
      text-shadow: 0 0 0 #00ff9d;
    }
    2% {
      transform: translate(-2px, 0);
      text-shadow: -2px 0 #ff00c8;
    }
    4% {
      transform: translate(2px, 0);
      text-shadow: 2px 0 #00aeff;
    }
    6% {
      transform: translate(0);
      text-shadow: none;
    }
  }
`;

export const neonEffect = `
  @keyframes neon {
    0%, 100% {
      text-shadow: 0 0 5px #00ff9d,
                   0 0 10px #00ff9d,
                   0 0 20px #00ff9d;
    }
    50% {
      text-shadow: 0 0 10px #00ff9d,
                   0 0 20px #00ff9d,
                   0 0 30px #00ff9d;
    }
  }
`; 