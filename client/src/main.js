import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router';

let app = createApp(App);

/* Словарь соответствий изображений флага и страны */
app.config.globalProperties.flags = {
    "Egypt": "/imgs/flags/eg.png",
    "Hong Kong S.A.R.": "/imgs/flags/hk.png",
    "Austria": "/imgs/flags/at.png",
    "U.A.E.": "/imgs/flags/ae.png",
    "Russia": "/imgs/flags/ru.png",
    "Argentina": "/imgs/flags/ar.png",
    "Turkey": "/imgs/flags/tr.png",
    "Mexico": "/imgs/flags/mx.webp",
    "India": "/imgs/flags/in.webp",
    "Japan": "/imgs/flags/jp.webp",
    "Brazil": "/imgs/flags/br.webp",
    "Korea": "/imgs/flags/kr.png",
    "Italy": "/imgs/flags/it.webp",
    "Canada": "/imgs/flags/ca.webp",
    "Hungary": "/imgs/flags/hu.webp",
    "South Africa": "/imgs/flags/za.webp",
    "United States": "/imgs/flags/us.webp",
    "United Kingdom": "/imgs/flags/gb.webp",
    "Colombia": "/imgs/flags/co.png",
    "Australia": "/imgs/flags/au.png",
    "Sweden": "/imgs/flags/se.webp",
    "Germany": "/imgs/flags/de.webp",
    "New Zealand": "/imgs/flags/nz.webp",
    "France": "/imgs/flags/fr.webp",
    "Taiwan": "/imgs/flags/tw.webp",
    "Norway": "/imgs/flags/no.webp"
};
/* Словарь соответствий кодf страны и её полного названия */
app.config.globalProperties.сountriesShortToFull = {
    "EG": "Egypt",
    "AT": "Austria",
    "HK": "Hong Kong S.A.R.",
    "RU": "Russia",
    "AE": "U.A.E.",
    "AR": "Argentina",
    "TR": "Turkey",
    "MX": "Mexico",
    "IN": "India",
    "JP": "Japan",
    "BR": "Brazil",
    "KR": "Korea",
    "IT": "Italy",
    "CA": "Canada",
    "HU": "Hungary",
    "ZA": "South Africa",
    "US": "United States",
    "GB": "United Kingdom",
    "CO": "Colombia",
    "AU": "Australia",
    "SE": "Sweden",
    "DE": "Germany",
    "NZ": "New Zealand",
    "FR": "France",
    "TW": "Taiwan",
    "NO": "Norway"
}
/* Словарь соответствий страны и её кода (код языка + код страны) для получения правильной ссылки на магазин xbox */
app.config.globalProperties.urlRegion = {
    "EG": "AR-EG",
    "AT": "DE-AT",
    "HK": "EN-HK",
    "RU": "RU-RU",
    "AE": "AR-AE",
    "AR": "ES-AR",
    "TR": "TR-TR",
    "MX": "ES-MX",
    "IN": "EN-IN",
    "JP": "JA-JP",
    "BR": "PT-BR",
    "KR": "KO-KR",
    "IT": "IT-IT",
    "CA": "EN-CA",
    "HU": "HU-HU",
    "ZA": "EN-ZA",
    "US": "EN-US",
    "GB": "EN-GB",
    "CO": "ES-CO",
    "AU": "EN-AU",
    "SE": "SV-SE",
    "DE": "DE-DE",
    "NZ": "EN-NZ",
    "FR": "FR-FR",
    "TW": "ZH-TW",
    "NO": "NB-NO"
}

app.use(router).mount('#app');
