import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from '@assets/languages/ru.json';
import en from '@assets/languages/en.json';
import ua from '@assets/languages/ua.json';

i18n.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			en: {
				translation: en,
			},
			ru: {
				translation: ru,
			},
			ua: {
				translation: ua,
			},
		},
		lng: localStorage.getItem('i18nextLng') || 'ru-RU',
		fallbackLng: ['en', 'ru', 'ua'],
		bindI18n: 'languageChanged',
		bindI18nStore: '',
		transEmptyNodeValue: '',
		transSupportBasicHtmlNodes: true,
		transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
		useSuspense: true,
	});

export default i18n;
