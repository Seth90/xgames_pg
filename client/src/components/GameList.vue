<template>
    <div class="search_input">
        <select reqired name="" class="typeSelect" id="" v-model="selectedType">
            <option value="" disabled selected>Тип</option>
            <option value="All">Все</option>
            <option value="Game">Игра</option>
            <option value="Durable">Дополнение</option>
            <option value="Application">Приложение</option>
        </select>

        <input type="text" class="searchInput" v-model="searchText" placeholder="LEGO">
        <img class="search_img" src="imgs/search.svg" alt="" width="15" height="15">

        <select reqired name="" :class="{ hidden: notCurrencyLoaded }" class="currencySelect" id=""
            v-model="selectedCurrency">
            <option value="" disabled selected>Выберите валюту</option>
            <option v-for="currency in currencyList" :value="currency">{{ currency }}</option>
        </select>
    </div>
    <div v-if="filterList.length === 0">Ничего не найдено, попробуйте поискать что-то другое!</div>
    <div class="preloader" v-if="!wasLoaded">
        <h4>Идет загрузка данных..</h4>
        <img src="imgs/loading.gif" alt="Loading" />
    </div>


    <AppItem v-if="wasLoaded" v-for="item in filterList" :gameObject="item"/>
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
            currencyList: ['RUB','USD'],
            currencyObject: {},
            notCurrencyLoaded: true
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
            return tmpArray;
        }
    }
}
</script>

<style scoped></style>
