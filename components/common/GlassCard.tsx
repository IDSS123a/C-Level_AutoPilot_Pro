import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradient?: 'none' | 'subtle' | 'highlight';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  gradient = 'subtle'
}) => {
  const baseStyles = "relative overflow-hidden rounded-xl border border-white/5 backdrop-blur-md shadow-xl transition-all duration-300";
  
  const gradientStyles = {
    none: "bg-slate-900/80",
    subtle: "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/70",
    highlight: "bg-gradient-to-br from-indigo-900/20 via-slate-900/80 to-slate-900/90",
  };

  const hoverStyles = hoverEffect 
    ? "hover:border-brand-500/30 hover:shadow-brand-500/10 hover:-translate-y-0.5" 
    : "";

  return (
    <div className={`${baseStyles} ${gradientStyles[gradient]} ${hoverStyles} ${className}`}>
      {/* Noise texture overlay for texture depth */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;