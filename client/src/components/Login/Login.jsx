import React from 'react';
import { Button as B } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Button } from '@containers/Button';
import Icon from '@containers/Icons';

import './Login.scss';

const Login = () => {
  const { t } = useTranslation();
  let scopes = [
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

  scopes = scopes.reduce((result, scope) => `${result}+${scope}`);

  return (
    <div className='login'>
      <div className='login__header'>
        <div />
        <Button
          size='small'
          onClick={() => {
            location.replace(
              `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}&state=ge5h4uhjtbeftr4h5rgdwfr4g5h6t`,
            );
          }}
          startIcon={<Icon name='twitch' />}>
          {t('LOGIN')}
        </Button>
      </div>
      <div className='login__main'>Login</div>
    </div>
  );
};

export default Login;
