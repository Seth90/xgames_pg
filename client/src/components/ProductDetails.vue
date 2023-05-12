<template>
    <div class="product">
        <div class="product-top">
            <div class="product-top">
                <div class="product-top-poster"><img :src="product.poster_url" :alt="product.title"></div>
                <div class="product-top-middle">
                    <div class="product-top__title">{{ product.title }}</div>
                    <div class="product-top__description">{{ product.description }}</div>
                    <div class="product-top__type">{{ product.type }}</div>
                    <div>
                        <div v-if="product.multiplayer !== 'false'">MULTIPLAYER</div>
                        <div v-if="product.coop !== 'false'">Coop</div>
                        <div v-if="product.goldandsilversale !== 'false'">GOLD</div>
                        <div v-if="product.eaaccessgame !== 'false'">EAACCESS</div>
                        <img src="/imgs/Xbox-Game-Pass-Logo.jpg" alt="" v-if="product.gamepass !== 'false'">
                    </div>
                </div>

            </div>
        </div>
        <!-- <button @click="SortList('price')">BY PRICE</button>
        <button @click="SortList('country')">BY COUNTRY</button> -->
        <div class="product-prices">
            <div class="product-price-item">
                <div></div>
                <div @click="SortList('country')" class="product-price-item__text">Country</div>
                <div @click="SortList('price')" class="product-price-item__text">SellPrice</div>
                <div>Price</div>
                <div>Discount</div>
                <div>Link</div>
            </div>
            <div class="product-price-item" v-for="price in product.prices" :key="price.country">

                <div><img class="product-price-item__flag" :src="this.flags[this.сountriesShortToFull[price.country]]"
                        :alt="price.country"></div>
                <div>{{ this.сountriesShortToFull[price.country] }}</div>
                <div>{{ price.listprice }} {{ price.currency }}</div>
                <div><s><i>{{ price.msrpprice }} {{ price.currency }}</i></s></div>
                <div>{{ Math.round((price.msrpprice - price.listprice) / price.msrpprice * 100).toString() + "%"
                }}</div>
                <div><a href="xbox">XBOX</a></div>
            </div>
        </div>
    </div>
</template>

<script setup>
//import { ref, onMounted } from 'vue';
//import api from '@/api.js';

// const product = ref({});
// const props = defineProps({
//     // product: {
//     //     type: Object,
//     //     required: true,
//     //     default: {
//     //         prices: []
//     //     }
//     // },
//     id: {
//         type: String,
//         required: true
//     }
// })
// onMounted(async () => {
//     product.value = await api.getProduct(props.id);
// })

</script>
<script>
import api from '@/api.js';
export default {
    props: ['id'],
    data() {
        return {
            product: {}
        }
    },
    methods: {
        async GetData() {
            this.product = await api.getProduct(this.id);
        },
        SortList(type) {
            if (type === 'price') {
                this.product.prices.sort((a, b) => a.listprice - b.listprice);
            }
            else if (type === 'country') {
                this.product.prices.sort((a, b) => a.country.localeCompare(b.country));
            }
        }
    },
    mounted() {
        this.GetData()
    }
}
</script>

<style lang="scss" scoped>
.product {
    &-top {
        display: flex;
        justify-content: left;
        align-items: flex-start;
        margin-bottom: 20px;


        &-middle {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: left;
        }

        &-poster {
            margin-right: 20px;

            img {
                display: block;
                width: 140px;
                height: 210px;
                border-radius: 3px;
            }
        }

        &__title {
            font-size: 20px;
            margin-top: 5px;
            margin-bottom: 10px;
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
            margin-bottom: 15px;
        }

        &__type {
            font-weight: lighter;
            font-style: italic;
            opacity: 0.8;
            margin-bottom: 10px;
        }

    }

    &-price {
        &-item {
            display: grid;
            grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr;
            gap: 20px;
            text-align: center;
            margin-bottom: 10px;
            border-radius: 3px;
            border: 1px solid rgb(233, 233, 233);
            padding: 10px;

            &__flag {
                width: 30px;
                height: 20px;
            }
            &__text {
                color: #0883d2;
                text-decoration: underline;
                cursor: pointer;
                &:hover {
                    filter: brightness(70%);
                }
            }
        }
    }
}
</style>