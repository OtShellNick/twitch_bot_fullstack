import React, { DetailedHTMLProps, ButtonHTMLAttributes, memo } from 'react';
import cl from 'classnames';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode; // Дочерние компоненты кнопки
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'disabled'; // Цвет кнопки
  disabled?: boolean; // Активность кнопки
  onClick?: () => void; // Обработчик события клика
  size?: 'sm' | 'md' | 'lg'; // Размер кнопки
  iconBefore?: React.ReactNode; // Иконка, отображаемая перед текстом кнопки
  iconAfter?: React.ReactNode; // Иконка, отображаемая после текста кнопки
  type?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>['type']; // Тип кнопки
  className?: string; // Дополнительные CSS-классы для кнопки
}

/**
 * @component Button
 * @description Компонент кнопки.
 *
 * @prop {React.ReactNode} children - Дочерние компоненты кнопки.
 * @prop {string} [color='primary'] - Цвет кнопки. Допустимые значения: 'primary', 'secondary', 'success', 'error', 'disabled'.
 * @prop {boolean} [disabled=false] - Активность кнопки.
 * @prop {function} onClick - Обработчик события клика.
 * @prop {string} [size='md'] - Размер кнопки. Допустимые значения: 'sm', 'md', 'lg'.
 * @prop {React.ReactNode} iconBefore - Иконка, отображаемая перед текстом кнопки.
 * @prop {React.ReactNode} iconAfter - Иконка, отображаемая после текста кнопки.
 * @prop {string} [type] - Тип кнопки.
 * @prop {string} [className] - Дополнительные CSS-классы для кнопки.
 */
export const Button: React.FC<ButtonProps> = memo(
  ({
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
    /**
     * Рендер компонента кнопки.
     */
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
  },
);
