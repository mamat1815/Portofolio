import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95",
    outline: "border border-zinc-200 text-zinc-900 hover:bg-zinc-50 active:scale-95",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 active:scale-95",
    ghost: "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};