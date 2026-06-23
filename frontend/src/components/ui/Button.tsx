
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const base = "px-6 py-3 rounded transition-all duration-300 font-medium tracking-wide flex items-center justify-center";
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    outline: "border border-secondary text-secondary hover:bg-secondary hover:text-white",
    ghost: "hover:bg-gray-100 text-secondary"
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
};
