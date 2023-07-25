import React from 'react';
import cl from 'classnames';

import './Button.scss';

enum ColorsENUM {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  error = 'error',
  disabled = 'disabled',
}

interface ButtonProps {
  children: React.ReactNode;
  color?: ColorsENUM;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  color = 'primary',
  onClick,
}) => {
  return (
    <button
      className={cl({
        btn: true,
        [`btn-${color}`]: true,
        [`btn-disabled`]: disabled,
      })}
      onClick={onClick}>
      {children}
    </button>
  );
};
