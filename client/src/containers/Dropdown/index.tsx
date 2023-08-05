import React, { useState } from 'react';
import cn from 'classnames';
import './Dropdown.scss';

/**
 * Универсальный компонент дропдауна.
 * @param {React.ReactNode} trigger - Элемент-триггер, открывающий дропдаун.
 * @param {React.ReactNode} content - Содержимое дропдауна.
 * @param {string} className - Дополнительный className для компонента Dropdown.
 * @returns {JSX.Element} Отображаемый компонент дропдауна.
 */
const Dropdown: React.FC<{
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}> = ({ trigger, content, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={cn('dropdown', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='dropdown-trigger'>{trigger}</div>
      <div className={cn('dropdown-content', { open: isOpen })}>{content}</div>
    </div>
  );
};

export default Dropdown;
