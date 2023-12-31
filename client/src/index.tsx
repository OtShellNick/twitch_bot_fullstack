import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@containers/Intl/Intl';

import App from '@components/App';
import store from '@store/mainStore';

import 'normalize.css';
import '@style/main.scss';

/**
 * Компонент, отображающий корневой элемент приложения.
 */
const RootComponent: React.FC = () => {
  // Получаем корневой элемент из DOM
  const rootElement: HTMLElement | null = document.getElementById('root');

  // Если корневой элемент существует, создаем корневой узел React
  if (rootElement) {
    const root: Root = createRoot(rootElement);

    // Рендерим приложение в корневом узле
    root.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
    );
  }

  // Возвращаем null, если корневой элемент не найден
  return null;
};

RootComponent({});

export default RootComponent;
