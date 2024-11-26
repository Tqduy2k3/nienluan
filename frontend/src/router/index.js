import { createWebHistory, createRouter } from 'vue-router';
import homepage from '@/views/homepage.vue';
import manager from '@/views/manager.vue';
import editUser from '@/views/editUser.vue';
import editProduct from '@/views/editProduct.vue';
import addProduct from '@/views/addProduct.vue';
import ProductDetails from '@/views/productDetails.vue';
import editOrder from '@/views/editOrder.vue';
const routes = [
  {
    path: '/homepage',
    name: 'homepage',
    component: homepage
  },
  {
    path: '/manager',
    name: 'manager',
    component: manager
  },
  {
    path: '/editUser',
    name: 'editUser',
    component: editUser
  },
  {
    path: '/editOrder',
    name: 'editOrder',
    component: editOrder
  },
  {
    path: '/addProduct',
    name: 'addProduct',
    component: addProduct
  },
  {
    path: '/appheader',
    name: 'appheader',
    component: () => import('@/components/AppHeader.vue') // Ensure AppHeader.vue exists
  },
  {
    path: '/',
    name: 'userSignup',
    component: () => import('@/views/userSignup.vue')
  },
  {
    path: '/userLogin',
    name: 'userLogin',
    component: () => import('@/views/userLogin.vue')
  },
  ,
  {
    path: '/addToCart',
    name: 'addToCart',
    component: () => import('@/views/addToCart.vue')
  },
  {
    path: '/editProduct/:id',
    name: 'editProduct',
    component: editProduct,
    props: true
  },
  {
    path: '/userInformation/:id',
    name: 'userInformation',
    component: () => import('@/views/userInformation.vue') // Ensure AppHeader.vue exists
  },
  {
    path: '/products/:id',
    name: 'productDetails',
    component: ProductDetails,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
