import Image from 'next/image';
import Link from 'next/link';
// import { useTranslation } from 'react-i18next';

import CheckAuthCode from './CheckAutchCode';
// import Icon from '@containers/Icons';

import './Login.scss';

const Login = () => {
	// const { t } = useTranslation();
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

	scopes = scopes.reduce((result, scope) => result + '+' + scope);
	const { CLIENT_ID, REDIRECT_URI } = process.env;

	return (
		<div className='login'>
			<CheckAuthCode />
			<div className='login__header'>
				<div></div>
				<Link
					href={`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}&state=ge5h4uhjtbeftr4h5rgdwfr4g5h6t`}
					className='login__by-twitch'
				// startIcon={<Icon name='twitch' />}
				>
					{/* {t('LOGIN')} */}
					Login
				</Link>
			</div>
			<div className='login__main'>Login</div>
		</div>
	);
};

export default Login;
