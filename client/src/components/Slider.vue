<template>
    <div class="slider">
    <swiper :navigation="true" :modules="modules" class="mySwiper">
        <swiper-slide class="slide"><div class="tmp_slide">Slide 1</div> </swiper-slide>
        <swiper-slide class="slide">Slide 2</swiper-slide>
        <swiper-slide class="slide">Slide 3</swiper-slide>
        <swiper-slide class="slide">Slide 4</swiper-slide>
        <swiper-slide class="slide">Slide 5</swiper-slide>
        <swiper-slide class="slide">Slide 6</swiper-slide>
        <swiper-slide class="slide">Slide 7</swiper-slide>
        <swiper-slide class="slide">Slide 8</swiper-slide>
        <swiper-slide class="slide">Slide 9</swiper-slide>
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
    components: {
        Swiper,
        SwiperSlide,
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
.tmp_slide {
    min-height: 500px;
}
.slider {
    max-width: 1440px;
}
.slide {
    //max-width: 1440px !important;
    background: grey;
    padding: 30px;
}
</style>