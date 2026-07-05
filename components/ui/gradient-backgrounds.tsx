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
      className={`relative w-full h-full overflow-hidden bg-background transition-colors duration-500 ${className || ''}`}
      {...props}
    >
      {/* Dynamic Mesh Gradients */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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
