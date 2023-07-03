import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@components/Header/Header';
import Aside from '@components/Aside/Aside';
import Preloader from '@containers/Preloader/Preloader';

import './Layout.scss';

const Layout = () => {
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

export default Layout;
