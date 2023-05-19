<template>
    <div class="main">
        <Header />
        <div class="main-view">
            <router-view />
        </div>

        <Footer />
    </div>
</template>
<script setup>
import Header from "@/components/Layouts/header.vue"
import Footer from "@/components/Layouts/footer.vue"

</script>
<style lang="scss">
@import '@/assets/styles/global.scss';

.main {
    max-width: 1440px;
    min-height: 100vh; 
    margin: auto; 
    display:flex; 
    flex-direction:column; 
    justify-content: space-between;
    // &-view {
    //     display: flex;
    //     justify-content: center;
    //     align-items: start;
    // }
}
</style>