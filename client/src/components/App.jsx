import React, { useEffect, useState, lazy } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Layout from '@components/Layout/Layout';
import Login from '@components/Login/Login';
import Preloader from '@containers/Preloader/Preloader';

const Dashboard = lazy(() => import('@components/Dashboard/Dashboard'));
const Timers = lazy(() => import('@components/Timers/Timers'));
const Spam = lazy(() => import('@components/Spam/Spam'));

import { login, checkAccess } from '@actions/personal';
import Socket from '@helpers/socket';

const App = () => {
	const location = useLocation();
	const nav = useNavigate();
	const [params] = useSearchParams(location);
	const [auth, setAuth] = useState(checkAccess());
	const [socket, setSocket] = useState(null);
	const [isFetching, setIsFetching] = useState(false);

	if (auth && !socket) {
		setSocket(new Socket(localStorage.getItem('authorization')));
	}

	const checkCode = async () => {
		const code = params.get('code');
		const error = params.get('error');

		if (code) {
			try {
				setIsFetching(true);
				await login(code);

				setAuth(checkAccess());
				setIsFetching(false);
			} catch (err) {
				console.error(err);
				setIsFetching(false);
			}
		}

		if (error) nav('/login');
	};

	useEffect(() => {
		checkCode();

		if (!isFetching) {
			if (location.pathname === '/') nav('/dashboard');
			if (auth && location.pathname === '/login') nav('/dashboard');
			if (!auth && location.pathname !== '/login') nav('/login');
		}

		socket && socket.connect();

		return () => {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		};
	}, [auth]);

	if (isFetching) return <Preloader />;

	return (
		<Routes>
			<Route element={<Layout />}>
				<Route
					path='/dashboard'
					element={<Dashboard />}
				/>
				<Route
					path='/timers'
					element={<Timers />}
				/>
				<Route
					path='/spam'
					element={<Spam />}
				/>
			</Route>
			<Route
				path='login'
				element={<Login />}
			/>
		</Routes>
	);
};

export default App;
