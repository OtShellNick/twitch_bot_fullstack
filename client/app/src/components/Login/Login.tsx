
import LoginButton from './LoginButton';

import './Login.scss';

const Login = () => {
	let scopes = [
		'bits:read',
		'channel:moderate',
		'channel:manage:polls',
		'channel:manage:broadcast',
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
		'whispers:read',
		'whispers:edit',
	];

	return (
		<div className='login'>
			<div className='login__header'>
				<div></div>
				<LoginButton />
			</div>
			<div className='login__main'>Login</div>
		</div>
	);
};

export default Login;
