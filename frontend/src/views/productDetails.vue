<template>
  <div>
    <div v-if="product">
      <h1>{{ product.U_name }}</h1>
      <img
        :src="product.U_image_url"
        alt="Product Image"
      />
      <p>Price: {{ formatPrice(product.U_price) }}</p>
      <p>Description: {{ product.U_description }}</p>
    </div>
    <div v-else>
      <p>Loading product details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const id = route.params.id;

const fetchProductDetails = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/products/${id}`);
    if (!response.ok) {
      throw new Error('Could not fetch product details');
    }
    product.value = await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

onMounted(fetchProductDetails);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
</script>
