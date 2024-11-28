import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'registry',
        component: () => import('@/pages/registry/Component.vue')
    },
    {
        path: '/addanimal',
        name: 'add-animal',
        component: () => import('@/pages/add-animal/Component.vue')
    },
    {
        path: '/ui',
        name: 'ui',
        component: () => import('@/pages/UIPage.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

export default router;
