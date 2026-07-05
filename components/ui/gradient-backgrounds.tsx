'use client';

import * as React from 'react';

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  personaId?: string;
}

interface GradientTheme {
  primary: string;
  secondary: string;
  accent: string;
}

const PERSONA_GRADIENTS: Record<string, GradientTheme> = {
  Hitesh_chaudhary_sir: {
    primary: 'rgba(249, 115, 22, 0.12)', // Orange
    secondary: 'rgba(245, 158, 11, 0.08)', // Amber
    accent: 'rgba(251, 146, 60, 0.05)',
  },
  Piyush_garg_sir: {
    primary: 'rgba(99, 102, 241, 0.12)', // Indigo
    secondary: 'rgba(139, 92, 246, 0.08)', // Violet
    accent: 'rgba(167, 139, 250, 0.05)',
  },
  Suraj_jha_sir: {
    primary: 'rgba(16, 185, 129, 0.12)', // Emerald
    secondary: 'rgba(6, 182, 212, 0.08)', // Cyan
    accent: 'rgba(52, 211, 153, 0.05)',
  },
  Anirudh_jwala: {
    primary: 'rgba(139, 92, 246, 0.12)', // Purple
    secondary: 'rgba(236, 72, 153, 0.08)', // Pink
    accent: 'rgba(244, 114, 182, 0.05)',
  },
};

export function GradientBackground({
  children,
  className,
  personaId = 'Hitesh_chaudhary_sir',
  ...props
}: GradientBackgroundProps) {
  const theme = PERSONA_GRADIENTS[personaId] || PERSONA_GRADIENTS.Hitesh_chaudhary_sir;

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#FFF5F2] dark:bg-gradient-to-tr dark:from-[#070708] dark:via-[#0d060a] dark:to-[#1b0812] transition-colors duration-500 ${className || ''}`}
      {...props}
    >
      {/* Dynamic Mesh Gradients */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Light Mode Rosy Creamy Blurry Blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 dark:hidden">
          {/* Blob 1: Soft Peach/Rose behind sidebar */}
          <div
            className="absolute rounded-full blur-[120px] opacity-80"
            style={{
              width: '35vw',
              height: '35vw',
              top: '10%',
              left: '-10%',
              background: 'radial-gradient(circle, rgba(254, 200, 190, 0.7) 0%, rgba(254, 200, 190, 0) 70%)',
            }}
          />
          {/* Blob 2: Soft Rose at bottom right */}
          <div
            className="absolute rounded-full blur-[140px] opacity-75"
            style={{
              width: '40vw',
              height: '40vw',
              bottom: '10%',
              right: '5%',
              background: 'radial-gradient(circle, rgba(253, 224, 217, 0.5) 0%, rgba(253, 224, 217, 0) 70%)',
            }}
          />
          {/* Blob 3: Soft Lavender/Pink at center */}
          <div
            className="absolute rounded-full blur-[120px] opacity-60"
            style={{
              width: '35vw',
              height: '35vw',
              top: '30%',
              right: '25%',
              background: 'radial-gradient(circle, rgba(245, 230, 255, 0.7) 0%, rgba(245, 230, 255, 0) 70%)',
            }}
          />
        </div>
        {/* Top-Right moving blob */}
        <div
          className="absolute rounded-full blur-[130px] transition-all duration-700 ease-in-out"
          style={{
            width: '45vw',
            height: '45vw',
            top: '-15%',
            right: '-10%',
            background: `radial-gradient(circle, ${theme.primary} 0%, transparent 75%)`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />

        {/* Center-Left moving blob */}
        <div
          className="absolute rounded-full blur-[130px] transition-all duration-700 ease-in-out"
          style={{
            width: '40vw',
            height: '40vw',
            top: '25%',
            left: '-15%',
            background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />

        {/* Bottom-Right accent blob */}
        <div
          className="absolute rounded-full blur-[110px] transition-all duration-700 ease-in-out"
          style={{
            width: '35vw',
            height: '35vw',
            bottom: '-10%',
            right: '15%',
            background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      </div>

      {/* Grid line structure overlay (gives professional depth) */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] z-0"
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex">
        {children}
      </div>
    </div>
  );
}
