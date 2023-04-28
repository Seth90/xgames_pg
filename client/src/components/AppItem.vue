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
                <img :src="this.flags[this.сountriesShortToFull[gameObject.country]]" :alt="gameObject.country"
                    class="appitem-price-country__flag">
                <div>{{ сountriesShortToFull[gameObject.country] }}</div>
            </div>
            <div class="appitem-price__lprice">{{ gameObject.lprice }} {{ gameObject.currency }}</div>
            <div class="appitem-price__msrprpice"><s><i>{{ gameObject.msrp }} {{ gameObject.currency }}</i></s></div>
        </div>
        <div class="appitem-buttons">
            <div class="appitem-buttons__xbox button">
                <a :href="gameObject.url.replace('en-us', this.urlRegion[gameObject.country])" target="_blank">XBOX.COM ↗</a>
            </div>

            <router-link :to="`products/${gameObject.id}`">
                <div class="appitem-buttons__more button">MORE</div>
            </router-link>
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


</script>

<style lang="scss" scoped>
.appitem {
    display: grid;
    grid-template-columns: 80px 5fr 1fr 1fr;
    column-gap: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid rgb(192, 192, 192);
    padding: 5px;


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