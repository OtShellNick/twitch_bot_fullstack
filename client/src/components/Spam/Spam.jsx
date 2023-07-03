import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

import './Spam.scss';

const TABS = [
	{
		value: 'list',
		label: 'Blacklist',
	},
	{
		value: 'caps',
		label: 'Caps',
	},
	{
		value: 'emotes',
		label: 'Emotes',
	},
	{
		value: 'links',
		label: 'Links',
	},
	{
		value: 'symbols',
		label: 'Symbols',
	},
	{
		value: 'repetitions',
		label: 'Repetitions',
	},
];

const Spam = () => {
	const [activeTab, setActiveTab] = useState('list');
	const { t } = useTranslation();

	const StyledTab = styled(props => <Tab {...props} />)({
		'&.Mui-selected': {
			color: 'var(--primary-700)',
		},
	});

	return (
		<main className='spam'>
			<h1 className='spam__heading'>{t('SPAM')}</h1>
			<div className='spam__content'>
				<Tabs
					value={activeTab}
					onChange={(_, tab) => setActiveTab(tab)}
					aria-label='secondary tabs example'>
					{TABS.map(tab => {
						return (
							<StyledTab
								key={tab.value}
								label={tab.label}
								value={tab.value}
							/>
						);
					})}
				</Tabs>
			</div>
		</main>
	);
};

export default Spam;
