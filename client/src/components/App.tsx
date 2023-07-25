import React, { useEffect, useState, lazy } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import { Login } from '@components/Login';
import Preloader from '@containers/Preloader/Preloader';
import { login, checkAccess } from '@actions/personal';

const Dashboard = lazy(() => import('@components/Dashboard/Dashboard'));
const Timers = lazy(() => import('@components/Timers/Timers'));
const Spam = lazy(() => import('@components/Spam/Spam'));

/**
 * Главный компонент приложения.
 */
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(location as unknown as string); // Приведение типа для searchParams

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [auth, setAuth] = useState<boolean>(checkAccess());

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
