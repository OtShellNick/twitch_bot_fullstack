import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import cl from 'classnames';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'disabled';
  disabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  type?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>['type'];
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  color = 'primary',
  onClick,
  size = 'md',
  iconAfter,
  iconBefore,
  type,
  className,
}) => {
  return (
    <button
      className={cl(
        {
          btn: true,
          [`btn-${color}`]: true,
          'btn-disabled': disabled,
          [`btn-${size}`]: true,
        },
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      type={type || 'button'}>
      {iconBefore && iconBefore}
      {children}
      {iconAfter && iconAfter}
    </button>
  );
};
