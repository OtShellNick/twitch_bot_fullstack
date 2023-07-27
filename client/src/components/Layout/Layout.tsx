import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/Header/Header';
import Aside from '@components/Aside/Aside';
import Preloader from '@containers/Preloader/Preloader';

import './Layout.scss';

/**
 * Отображает компонент макета.
 * @returns {JSX.Element} Отображаемый компонент макета.
 */
export const Layout: React.FC = () => {
  return (
    <div className='wrapper'>
      <Header />
      <div className='wrapper__main'>
        <Aside />
        <Suspense fallback={<Preloader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
