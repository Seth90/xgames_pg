<template>
    <div class="appItem">
        <div class="appItem-poster">
            <img :src="gameObject.boxshotsmall" :alt="gameObject.title">
        </div>
        <div class="appItem-about">
            <a :href="gameObject.url" class="appItem-about__title">{{ gameObject.title }}</a>
            <div class="ecosystem">
                <img src="/imgs/Xbox-Game-Pass-Logo.jpg" alt="" v-show="gameObject.gamepassgame === 'true'">
                <img src="/imgs/xbox-live-gold.png" alt="" v-show="gameObject.goldandsilversale === 'true'">
                <img src="/imgs/eaaccess.png" alt="" v-show="gameObject.eaaccessgame === 'true'">
            </div>
            <span class="appItem-about__description">{{ gameObject.description }}</span>
        </div>
        <div class="appItem-price">
            <img src="/imgs/ae.png" alt="" class="appItem-price__flag">
            <div>{{ gameObject.country }}</div>
            <div class="appItem-price__lprice">{{ gameObject.lprice }} {{ gameObject.currency }}</div>
            <div class="appItem-price__msrprpice">{{ gameObject.msrp }} {{ gameObject.currency }}</div>
        </div>
        <div class="appItem-buttons">
            <button class="appItem-buttons__xbox">XBOX.COM</button>
            <button class="appItem-buttons__more">MORE</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    gameObject: {
        type: Object,
        required: false
    }
})
</script>

<style lang="scss">
.appItem {
    display: grid;
    grid-template-columns: 80px 5fr 1fr 1fr;
    column-gap: 10px;
    margin-bottom: 5px;

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
        gap: 10px;

        &__title {
            font-size: 25px;
            margin-top: 10px;
            font-weight: bold;
        }
    }

    &-price {
        &__flag {
            width: 20px;
            height: 15px;
        }
    }

    &-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
}
</style>