<template>
    <div class="product-container">
        <ProductDetails :product="productData"/>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api.js';
import ProductDetails from '@/components/ProductDetails.vue';


const route = useRoute();
const productData = ref({});

onMounted(async () => {
    productData.value = await api.getProduct(route.params.id);
    
})

</script>
<style lang="scss">
    .product-container {
        margin-top: 40px;
        padding: 10px;
        max-width: 1000px;
    }
</style>