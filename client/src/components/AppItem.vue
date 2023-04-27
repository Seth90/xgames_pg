<template>
    <div class="appitem">
        <div class="appitem-poster">
            <img :src="gameObject.boxshotsmall" :alt="gameObject.title">
        </div>
        <div class="appitem-about">
            <a :href="gameObject.url" class="appitem-about__title">{{ gameObject.title }}</a>
            <div class="ecosystem">
                <img src="/imgs/Xbox-Game-Pass-Logo.jpg" alt="" v-show="gameObject.gamepassgame === 'true'">
                <img src="/imgs/xbox-live-gold.png" alt="" v-show="gameObject.goldandsilversale === 'true'">
                <img src="/imgs/eaaccess.png" alt="" v-show="gameObject.eaaccessgame === 'true'">
            </div>
            <span class="appitem-about__description">{{ gameObject.description }}</span>
        </div>
        <div class="appitem-price">
            <div class="appitem-price-country">
                <img :src="flags[сountriesShortToFull[gameObject.country]]" :alt="gameObject.country"
                    class="appitem-price-country__flag">
                <div>{{ сountriesShortToFull[gameObject.country] }}</div>
            </div>
            <div class="appitem-price__lprice">{{ gameObject.lprice }} {{ gameObject.currency }}</div>
            <div class="appitem-price__msrprpice"><s><i>{{ gameObject.msrp }} {{ gameObject.currency }}</i></s></div>
        </div>
        <div class="appitem-buttons">
            <div class="appitem-buttons__xbox button">
                <a :href="gameObject.url.replace('en-us', urlRegion[gameObject.country])" target="_blank">XBOX.COM ↗</a>
            </div>
            <div class="appitem-buttons__more button"><a href="">MORE</a></div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    gameObject: {
        type: Object,
        required: false
    }
});
/* Словарь соответствий изображений флага и страны */
const flags = {
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
const сountriesShortToFull = {
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
const urlRegion = {
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
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto:wght@400;700&display=swap');

.appitem {
    display: grid;
    grid-template-columns: 80px 5fr 1fr 1fr;
    column-gap: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid rgb(192, 192, 192);
    padding: 5px;
    font-family: 'Roboto', sans-serif;

    &-poster {
        img {
            display: block;
            width: 80px;
            height: 120px;
            border-radius: 3px;
        }
    }

    &-about {
        display: flex;
        justify-content: flex-start;
        align-items: left;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 5px;

        &__title {
            font-size: 20px;
            margin-top: 5px;
            font-weight: bold;
            text-decoration: none;
            color: #0883d2;

        }

        &__description {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            line-height: 1.3em;
            height: 3.9em;
        }
    }

    &-price {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 5px;

        &-country {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;

            &__flag {
                width: 20px;
                height: 15px;
            }
        }

        &__lprice {
            font-weight: bold;
            font-size: 18px;
        }
    }

    &-buttons {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .button {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid grey;
            text-align: center;
            width: 100px;

            a {
                color: #0883d2;
                text-decoration: none;

                &:visited {
                    color: #0883d2;
                }
            }

            &:hover {
                background: #f1f1f1;
            }
        }

        &__xbox {
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 18px;
                height: 18px;
                display: block;
            }
            a {
                color: #2eaf2e !important;

                &:visited {
                    color: green;
                }
            }
        }

        &__more {}
    }
}
</style>