import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@containers/Button';
import Icon from '@containers/Icons';

import './Login.scss';

/**
 * Компонент страницы входа
 */
export const Login = () => {
  const { t } = useTranslation();

  // Определение списка разрешений
  const scopes: string[] = [
    'bits:read',
    'channel:moderate',
    'channel:manage:polls',
    'channel:manage:broadcast',
    'channel:manage:moderators',
    'channel:manage:predictions',
    'channel:read:redemptions',
    'channel:read:subscriptions',
    'channel_subscriptions',
    'channel:edit:commercial',
    'chat:edit',
    'chat:read',
    'moderator:read:chat_settings',
    'moderator:manage:chat_messages',
    'moderator:manage:blocked_terms',
    'moderator:manage:chat_settings',
    'user:read:broadcast',
    'user:read:email',
    'whispers:read',
    'whispers:edit',
  ];

  // Преобразование списка разрешений в строку
  const scopeString: string = scopes.reduce((result, scope) => `${result}+${scope}`);

  /**
   * Обработчик клика по кнопке входа
   */
  const handleLoginClick = () => {
    location.replace(
      `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopeString}&state=ge5h4uhjtbeftr4h5rgdwfr4g5h6t`,
    );
  };

  return (
    <div className='login'>
      <div className='login__header'>
        <div />
        <Button
          size='md'
          onClick={handleLoginClick}
          iconBefore={<Icon name='twitch' className={undefined} onClick={undefined} />}>
          {t('LOGIN')}
        </Button>
      </div>
      <div className='login__main'>Login</div>
    </div>
  );
};
