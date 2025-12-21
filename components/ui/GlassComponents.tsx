import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  noPadding?: boolean;
}

export const GlassCard: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false, noPadding = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-zinc-200 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] rounded-md ${noPadding ? '' : 'p-5'} ${className} ${onClick ? 'cursor-pointer hover:border-zinc-300 transition-colors' : ''}`}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm border border-transparent",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-transparent",
    outline: "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    icon: "p-2"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'yellow' | 'red' | 'gray' }> = ({ children, color = 'gray' }) => {
  // Attio/Linear style badges are often very subtle or just text with a dot, 
  // but if using backgrounds, they are desaturated.
  const colors = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    yellow: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-rose-50 text-rose-700 border-rose-100',
    gray: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};