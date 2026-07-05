'use client';

import * as React from 'react';

interface RadialGlowBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  glowColor?: string; // e.g. "rgba(99, 102, 241, 0.12)"
  interactive?: boolean;
}

export function RadialGlowBackground({
  children,
  className,
  glowColor = 'rgba(99, 102, 241, 0.12)',
  interactive = true,
  ...props
}: RadialGlowBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    const el = containerRef.current;
    if (el && interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (el && interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-background transition-colors duration-300 ${className || ''}`}
      {...props}
    >
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
        aria-hidden="true"
      />

      {/* Floating background glow circles (autonomous animation) */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow 1 */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-25 dark:opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
            animationDuration: '8s',
          }}
        />
        {/* Glow 2 */}
        <div 
          className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-20 dark:opacity-15"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            animation: 'pulse 12s infinite alternate',
          }}
        />
        {/* Glow 3 */}
        <div 
          className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-15 dark:opacity-10"
          style={{
            background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
            animation: 'pulse 10s infinite alternate-reverse',
          }}
        />
      </div>

      {/* Interactive cursor glow */}
      {interactive && (
        <div
          className="absolute rounded-full pointer-events-none blur-[100px] transition-opacity duration-500 ease-out"
          style={{
            width: '450px',
            height: '450px',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            left: `${mousePos.x - 225}px`,
            top: `${mousePos.y - 225}px`,
            opacity: opacity,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
