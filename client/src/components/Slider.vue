<template>
    <!-- !!!!!NEED TO FIX CLASSNAMES!!!-->
    <div class="slider">
        <swiper :navigation="true" :modules="modules" class="mySwiper" :loop="true" :pagination="{
            clickable: true,
        }">
            <swiper-slide v-for="game in cs_data">
                <div class="slide">
                    <div class="slide-poster">
                        <img :src="game.boxshot" :alt="game.title" />
                    </div>
                    <div class="slide-info">
                        <div class="slide-info__title">{{ game.title }}</div>
                        <div class="slide-info__preorder">{{ game.preOrderReleaseDate }}</div>
                        <div class="slide-info__orig">{{ game.originalReleaseDate }}</div>
                        <div class="slide-info__type">{{ game.type }}</div>
                    </div>

                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper';

export default {
    props: ['cs_data'],
    components: {
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            data: this.cs_data
        }
    },
    setup() {
        return {
            modules: [Navigation],
        };
    },
};
</script>

<style lang="scss">
@import 'swiper/css';
@import 'swiper/css/navigation';

.slider {
    max-width: 1440px;

}

.slide {
    //max-width: 1440px !important;
    background: rgb(228, 225, 225);
    padding: 50px;
    display: flex;
    justify-content: start;
    gap: 30px;
    align-items: center;
    min-height: 500px;

    &-info {
        &__title {
            font-size: 4em;
            font-weight: bold;
        }
    }

}
</style>