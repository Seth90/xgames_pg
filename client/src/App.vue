<template>
    <div class="main">
        <Header />
        <div class="main-view">
            <NavBar/>
            <router-view />
        </div>

        <Footer />
    </div>
</template>
<script setup>
import Header from "@/components/Layouts/header.vue"
import NavBar from "@/components/NavBar.vue"
import Footer from "@/components/Layouts/footer.vue"

</script>
<style lang="scss">
@import '@/assets/styles/global.scss';

.main {
    margin: auto;
    max-width: 1440px;
    &-view {
        display: grid;
        grid-template-columns: 1fr 5fr;
    }
}
</style>