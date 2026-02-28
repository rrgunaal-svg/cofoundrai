import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover3d?: boolean;
  glow?: 'cyan' | 'violet' | 'emerald' | 'none';
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover3d = false, glow = 'none', onClick }: GlassCardProps) {
  const glowClass = {
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/40',
    violet: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-violet-500/40',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/40',
    none: '',
  }[glow];

  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300
        ${hover3d ? 'hover:-translate-y-1 hover:scale-[1.01] cursor-pointer' : ''}
        ${glowClass}
        ${className}
      `}
      style={hover3d ? { transformStyle: 'preserve-3d', perspective: '1000px' } : undefined}
    >
      {children}
    </div>
  );
}
