<template>
    <div>
        <Header/>
        <router-view />
        <Footer/>
    </div>
</template>
<script setup>
import Header from "@/components/Layouts/header.vue"
//import GameList from "@/components/GameList.vue"
import Footer from "@/components/Layouts/footer.vue"
</script>
<style lang="scss">
    @import '@/assets/styles/global.scss';
</style>