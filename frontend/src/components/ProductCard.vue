<template>
  <div class="product-card">
    <img
      class="product-image"
      :src="imageUrl"
      :alt="product.P_name"
    />
    <h5>{{ product.P_name }}</h5>
    <p>Giá: {{ formatCurrency(product.P_price) }}</p>
    <button @click="addToCart">Thêm giỏ hàng</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Define the props for the product
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// Define emit function for adding to cart event
const emit = defineEmits(['add-to-cart']);

// Computed property for image URL
const imageUrl = computed(() => `/public/upload/${props.product.P_image_url}`);

// Format the price as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Add the product to the cart and emit event
const addToCart = () => {
  emit('add-to-cart', props.product);
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 8px;
}

h5,
p {
  margin-bottom: 10px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
</style>
