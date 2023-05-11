<template>
    <div class="gamelist">
        <div class="gamelist-toolbar">
            <select reqired name="" class="gamelist-select-type" id="" v-model="selectedType">
                <option value="" disabled selected>Тип</option>
                <option value="All">Все</option>
                <option value="Game">Игра</option>
                <option value="Durable">Дополнение</option>
                <option value="Application">Приложение</option>
            </select>
            <div class="gamelist-search">
                <input type="text" class="gamelist-search-input" v-model="searchText" placeholder="LEGO">
                <img class="gamelist-search__img" src="imgs/search.svg" alt="" width="15" height="15">
            </div>
            <select reqired name="" :class="{ hidden: notCurrencyLoaded }" class="gamelist-select-currency" id=""
                v-model="selectedCurrency">
                <option value="" disabled selected>Выберите валюту</option>
                <option v-for="currency in currencyList" :value="currency">{{ currency }}</option>
            </select>
        </div>
        <div class="gamelist-counts">{{ shown_count }} / {{ total_count }}</div>
        <div class="gamelist-search__error" v-if="filterList.length === 0 && wasLoaded">Ничего не найдено, попробуйте
            поискать что-то другое!</div>
        <div class="gamelist-preloader" v-if="!wasLoaded">
            <h4>Идет загрузка данных..</h4>
            <img src="imgs/loading.gif" alt="Loading" />
        </div>
        <div>
            <AppItem v-if="wasLoaded" v-for="item in filterList" :gameObject="item" />
        </div>
    </div>
</template>

<script>
import AppItem from '@/components/AppItem.vue'
import { ref, onMounted } from 'vue'
import api from '@/api.js'

export default {
    components: { AppItem },
    data() {
        return {
            objectOfGames: {},
            arrayOfGames: [],
            selectedType: '',
            searchText: '',
            wasLoaded: false,
            selectedCurrency: '',
            currencyList: ['RUB', 'USD'],
            currencyObject: {},
            notCurrencyLoaded: true,
            total_count: 0,
            shown_count: 0
        }
    },
    async mounted() {
        this.objectOfGames = await api.getGeneralInfo();
        let dataPromises = [];
        dataPromises.push(api.getDescriptions().then((data) => {
            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                this.objectOfGames[key].title = value.title;
                this.objectOfGames[key].description = value.description;
                this.objectOfGames[key].shortDescription = String(value.description).substring(0, 200) + '...';
            })
        }));
        dataPromises.push(api.getPosters().then((data) => {
            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                this.objectOfGames[key].boxshotsmall = value;
            })
        }));
        dataPromises.push(api.getPrices().then((data) => {
            //console.log(data)
            Object.entries(data).forEach((entry) => {
                const [key, value] = entry;
                this.objectOfGames[key].country = value.country;
                this.objectOfGames[key].msrp_usd = value.msrp;
                this.objectOfGames[key].msrp = value.msrp;
                this.objectOfGames[key].lprice_usd = value.lprice;
                this.objectOfGames[key].lprice = value.lprice;
                this.objectOfGames[key].currency = value.currency;
            })
        }));
        dataPromises.push(api.getExchanges().then((data) => {
            this.currencyObject = data.quotes;
            Object.entries(data.quotes).forEach((entry) => {
                const [key, value] = entry;
                this.currencyList.push(key.substring(3, 6));
            })
            this.notCurrencyLoaded = false;
        }));

        Promise.all(dataPromises).then(() => {
            Object.entries(this.objectOfGames).forEach((entry) => {
                const [key, value] = entry;
                this.arrayOfGames.push(value);
            });
            //console.log(this.arrayOfGames[0])
            this.arrayOfGames.sort((prev, next) => (prev.title > next.title) - (prev.title < next.title));
            this.wasLoaded = true;
            this.total_count = this.arrayOfGames.length;
        })



    },
    computed: {
        filterList() {
            let tmpArray = [];
            /* -----Фильтрация по типу----- */
            if (this.selectedType && this.selectedType !== "All") {
                tmpArray = this.arrayOfGames.filter(e => e.type === this.selectedType);
                //this.current = tmpArr.length;
            }
            else {
                tmpArray = this.arrayOfGames;
            }
            /* -----END Фильтрация по типу----- */
            /* -----Фильтрация по строке поиска----- */
            tmpArray = tmpArray.filter(e =>
                e.title.toLowerCase().includes(this.searchText.toLowerCase()));
            /* -----END Фильтрация по строке поиска----- */
            /* ----- Пересчет в выбранную валюту ---- */
            if (this.selectedCurrency !== '') {
                if (this.selectedCurrency !== 'USD') {
                    tmpArray.map((e) => {
                        e.currency = this.selectedCurrency;
                        e.lprice = Math.round(this.currencyObject['USD' + this.selectedCurrency] * e.lprice_usd * 100) / 100;
                        e.msrp = Math.round(this.currencyObject['USD' + this.selectedCurrency] * e.msrp_usd * 100) / 100;
                    })
                }
                else {
                    tmpArray.map((e) => {
                        e.currency = this.selectedCurrency;
                        e.lprice = e.lprice_usd;
                        e.msrp = e.msrp_usd;
                    })
                }
            }
            /* -----END Пересчет в выбранную валюту ---- */
            this.shown_count = tmpArray.length;
            return tmpArray;
        }
    }
}
</script>

<style  lang="scss" scoped>
.gamelist {
    margin-top: 40px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 30px;
    transition: 0.3s;

    &-counts {
        font-size: 12px;
        padding-left: 10px;
        padding-bottom: 10px;
        font-style: italic;
    }

    select,
    input {
        padding: 5px;
    }

    &-toolbar {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 20px;
        margin-bottom: 15px;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        background: #fff;
    }

    &-search {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;

        &-input {
            width: 100%;
        }

        &__error {
            color: #ad2d2d;
            text-align: center;
            font-size: 20px;
        }
    }

    &-preloader {
        margin: auto;
        text-align: center;
    }
}</style>
