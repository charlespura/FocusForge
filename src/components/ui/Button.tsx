import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25',
      secondary: 'bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-700',
      ghost: 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';