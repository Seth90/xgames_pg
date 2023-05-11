<template>
    <nav>
        <div class="nf navigation">
            <div class="navigation-item item">
                <img src="/imgs/link.png" />

            </div>
            <div class="navigation-item canhide">Главная</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Скидки недели</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Все предложения</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Nav1</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Nav1</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Nav1</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Nav1</div>
            <div class="navigation-item item"><img src="/imgs/link.png" /></div>
            <div class="navigation-item canhide">Nav1</div>
            <!-- <div class="navigation-iconside "> -->

            <!-- </div>
            <Transition>
                <div class="navigation-textside" v-if="!isShortMenu">

                    
                    
                    <div class="navigation-item item">Nav1</div>
                    <div class="navigation-item item">Nav1</div>
                    <div class="navigation-item item">Nav1</div>
                    <div class="navigation-item item">Nav1</div>
                    
                </div>
            </Transition> -->
        </div>
    </nav>
</template>
<script>
import Header from '@/components/Layouts/header.vue';

export default {
    props: ['isShort'],
    components: { Header },
    data() {
        return {
            isShortMenu: false
        }
    },
    mounted() {
        var toggle = false;
        document.querySelector('.header-menu').addEventListener('click', () => {
            let divs = document.querySelectorAll('.canhide');
            if (toggle) {
                divs.forEach((e) => {
                    e.classList.toggle('hidden');
                })
                let n = document.querySelector('.navigation');
                n.classList.toggle('ns');
                n.classList.toggle('nf');
            }
            else {
                divs.forEach((e) => {
                    e.classList.toggle('hidden');
                })
                let n = document.querySelector('.navigation');
                n.classList.toggle('nf');
                n.classList.toggle('ns');
            }
            toggle = !toggle;
        })
    }
}
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

nav {
    //width: 100%;
}
.nf {
    display: grid;
    grid-template-columns: 1fr 6fr;
    gap: 10px;
}
.ns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    width: 55px !important;
}

.navigation {
    /* display: grid;
    grid-template-columns: 1fr 6fr;
    gap: 10px; */
    width: 100%;
    padding: 10px;
    transition: 0.3s;
    border: 1px solid red;


    &-item {
        border: 1px solid grey;
        padding: 5px;
        white-space: nowrap
    }

    &-iconside {

        //width: 50px;
        img {
            display: block;
        }
    }

    &-textside {
        display: block;
        width: 100%;
    }
}

.hidden {
    display: none;
}
</style>