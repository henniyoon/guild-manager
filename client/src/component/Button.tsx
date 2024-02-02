import React from 'react';
import '../style/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button = ({ children, onClick, className, type = "button" }: ButtonProps) => {
  return (
    <button className={`button ${className}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
