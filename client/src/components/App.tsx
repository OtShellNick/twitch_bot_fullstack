import React, { useEffect, useState, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { login, checkAccess, getSelf } from '@actions/personal';
import Layout from '@components/Layout/Layout';
import { Login } from '@components/Login';
import Preloader from '@containers/Preloader/Preloader';
import { loginUser } from '@store/user.store';

const Dashboard = lazy(() => import('@components/Dashboard/Dashboard'));
const Timers = lazy(() => import('@components/Timers/Timers'));
const Spam = lazy(() => import('@components/Spam/Spam'));

/**
 * Главный компонент приложения.
 */
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams(location as unknown as string); // Приведение типа для searchParams

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(checkAccess());

  const getUserData = async () => {
    try {
      const { data } = await getSelf();
      dispatch(loginUser(data));
      setIsFetching(false);
    } catch (err) {
      console.error(err);
      setIsFetching(true);
      setTimeout(() => getUserData(), 2000);
    }
  };

  /**
   * Проверяет код и обновляет статус аутентификации.
   */
  useEffect(() => {
    /**
     * Проверяет код при монтировании и обновлении.
     */
    const checkCode = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (code) {
        try {
          setIsFetching(true);
          await login(code);

          setAuth(checkAccess());
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetching(false);
        }
      }

      if (error) {
        navigate('/login');
      }
    };

    checkCode();

    // Навигация на основе аутентификации и местоположения
    if (!isFetching) {
      if (location.pathname === '/') {
        navigate('/dashboard');
      } else if (auth && location.pathname === '/login') {
        navigate('/dashboard');
      } else if (!auth && location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [auth]);

  useEffect(() => {
    if (location.pathname !== '/login') getUserData();
  }, []);

  if (isFetching) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/timers' element={<Timers />} />
        <Route path='/spam' element={<Spam />} />
      </Route>
      <Route path='/login' element={<Login />} />
    </Routes>
  );
};

export default App;
