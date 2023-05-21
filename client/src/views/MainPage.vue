<template>
    <div class="mainpage">
        TOP PAID:
        <div class="mainpage-slider">
            <Slider :cs_data="comingSoonGames" />
        </div>
        <div class="mainpage-cs" id="comingsoon">
            <GameGrid :csObj="comingSoonGames" />
        </div>
    </div>
</template>
<script>
import Slider from '@/components/Slider.vue';
import api from '@/api.js';
import GameGrid from '@/components/GameGrid.vue';


//let comingSonnGames = await api.getComingSoonGames();

export default {
    components: { Slider, GameGrid },
    data() {
        return {
            comingSoonGames: {}
        }
    },
    methods: {
        async GetCSData() {
            // this.comingSoonGames = await api.getComingSoonGames();
            api.getComingSoonGames().then((d) => this.comingSoonGames = d);
        }
    },
    mounted() {
        this.GetCSData();
        const anchors = document.querySelectorAll('a[href*="#"]')

        for (let anchor of anchors) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault()

                const blockID = anchor.getAttribute('href').substr(1)

                document.getElementById(blockID).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            })
        }
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

    &-cs {
        max-width: 90%;
        margin-bottom: 30px;
    }
}
</style>