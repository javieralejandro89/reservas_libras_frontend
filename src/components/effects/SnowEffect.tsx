/**
 * Efecto de nieve navideño con colores personalizables
 */

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  fontSize: number;
  color: string;
  character: string;
}

interface SnowEffectProps {
  /** Cantidad de copos de nieve (default: 50) */
  count?: number;
  /** Habilitar/deshabilitar el efecto */
  enabled?: boolean;
  /** Colores personalizados para los copos */
  colors?: string[];
}

export const SnowEffect = ({ 
  count = 50, 
  enabled = true,
  colors = ['#87CEEB', '#B0C4DE', '#4169E1', '#6495ED', '#C0C0C0'] // Azules y plata
}: SnowEffectProps) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  // Diferentes caracteres de copo de nieve
  const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉'];

  useEffect(() => {
    if (!enabled) {
      setSnowflakes([]);
      return;
    }

    // Generar copos de nieve con propiedades aleatorias
    const flakes: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 8 + 7,
      opacity: Math.random() * 0.5 + 0.5, // Opacidad 0.5-1 (más visible)
      fontSize: Math.random() * 12 + 12, // Tamaño 12-24px (más grande)
      color: colors[Math.floor(Math.random() * colors.length)],
      character: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)]
    }));

    setSnowflakes(flakes);
  }, [count, enabled, colors]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute animate-fall"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
            fontSize: `${flake.fontSize}px`,
            color: flake.color,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {flake.character}
        </div>
      ))}
      
      <style>{`
  @keyframes fall {
    0% {
      top: -10vh;
    }
    100% {
      top: 110vh;
    }
  }

  @keyframes sway {
    0%, 100% {
      transform: translateX(0) rotate(0deg);
    }
    25% {
      transform: translateX(-30px) rotate(90deg);
    }
    50% {
      transform: translateX(0) rotate(180deg);
    }
    75% {
      transform: translateX(30px) rotate(270deg);
    }
  }

  .snowflake {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
    user-select: none;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
  }

  .animate-fall {
    animation: fall linear infinite, sway ease-in-out infinite;
  }

  /* Ocultar copos en móvil - mostrar solo 1 de cada 3 */
  @media (max-width: 768px) {
    .snowflake:nth-child(2n),
    .snowflake:nth-child(3n) {
      display: none;
    }
  }
`}</style>
    </div>
  );
}; 