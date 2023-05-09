<template>
    <div class="product-container">
        <ProductDetails :id="productId"/>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ProductDetails from '@/components/ProductDetails.vue';


const route = useRoute();
const productId = route.params.id;
//route.params.id

</script>
<style lang="scss">
    .product-container {
        margin-top: 40px;
        padding: 10px;
        max-width: 1000px;
    }
</style>