import {createRouter, createWebHistory} from 'vue-router';
import Index from '@/views/Index.vue';
import Product from '@/views/Product.vue'
import MainPage from '@/views/MainPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: MainPage
        },
        {
            path: '/allDeals',
            name: 'Index',
            component: Index
        },
        {
            path: '/products/:id',
            name: 'Product',
            component: Product
        }
    ]
})

export default router;