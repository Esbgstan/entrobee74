import React from 'react';

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  wrapperClassName?: string;
}

export function FancyButton({ children, className, wrapperClassName = '', ...props }: FancyButtonProps) {
  return (
    <button className={`button ${wrapperClassName} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`} {...props}>
      <div className="blob1"></div>
      <div className={`inner ${className || ''}`}>{children}</div>
    </button>
  );
}

export function FancyLink({ children, className, wrapperClassName = '', ...props }: any) {
  return (
    <div className={`button flex ${wrapperClassName}`} {...props}>
      <div className="blob1"></div>
      <div className={`inner w-full h-full ${className || ''}`}>{children}</div>
    </div>
  );
}
