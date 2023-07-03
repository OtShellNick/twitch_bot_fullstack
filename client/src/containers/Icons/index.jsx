import './styles.scss';
import React from 'react';
import { ICONS } from './icons';
import { decodeBase64 } from '../../helpers/helpers';
import classNames from 'classnames';

const Icon = ({ name, className, onClick }) => {
	const _renderIconSVGInline = icon => ({ __html: decodeBase64(icon.replace('data:image/svg+xml;base64,', '')) });

	if (!name) return null;

	return (
		<i
			dangerouslySetInnerHTML={_renderIconSVGInline(ICONS[name])}
			className={classNames([className ? className : '', 'icon'])}
			onClick={onClick}
		/>
	);
};

export default Icon;
