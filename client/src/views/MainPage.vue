<template>
    <div class="mainpage">
        SLIDER HERE
        <div class="mainpage-slider">
            <Slider :cs_data="comingSoonGames" />
        </div>
        <div class="mainpage-cs">
            {{ comingSoonGames }}
        </div>
    </div>
</template>
<script>
import Slider from '@/components/Slider.vue';
import api from '@/api.js'

let comingSonnGames = await api.getComingSoonGames();

export default {
    components: { Slider },
    data() {
        return {
            comingSoonGames: {}
        }
    },
    methods: {
        async GetCSData() {
            this.comingSoonGames = await api.getComingSoonGames();

        }
    },
    mounted() {
        this.GetCSData();
    }
}
</script>
<style lang="scss" scoped>
.mainpage {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-slider {
        max-width: 90%;
    }
}
</style>