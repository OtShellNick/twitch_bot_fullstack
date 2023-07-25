import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import cl from 'classnames';

import './Button.scss';

enum ColorsENUM {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  error = 'error',
  disabled = 'disabled',
}

enum SizesENUM {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

interface ButtonProps {
  children: React.ReactNode;
  color?: ColorsENUM;
  disabled?: boolean;
  onClick?: () => void;
  size?: SizesENUM;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  type?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>['type'];
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
}) => {
  return (
    <button
      className={cl({
        btn: true,
        [`btn-${color}`]: true,
        [`btn-disabled`]: disabled,
        [`btn-${size}`]: true,
      })}
      onClick={onClick}
      disabled={disabled}
      type={type || 'button'}>
      {iconBefore && iconBefore}
      {children}
      {iconAfter && iconAfter}
    </button>
  );
};
