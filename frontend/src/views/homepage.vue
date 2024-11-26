<template>
  <div>
    <h1 class="text-center my-4">Danh sách điện thoại</h1>

    <!-- Search Bar on Homepage -->
    <div class="d-flex justify-content-center mb-4">
      <form
        class="d-flex search-bar"
        @submit.prevent="search"
      >
        <input
          v-model="searchQuery"
          type="search"
          class="form-control"
          placeholder="Tìm kiếm sản phẩm..."
        />
        <button
          class="btn btn-outline-secondary"
          type="submit"
        >
          <i class="fas fa-search"></i>
        </button>
      </form>
    </div>

    <div
      v-if="isLoading"
      class="loading"
    >
      Loading products...
    </div>

    <div
      v-else
      class="product-list"
    >
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.P_id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>

    <div class="pagination-container">
      <MainPagination
        :total-pages="metadata.lastPage || 0"
        v-model:currentPage="currentPage"
        :length="5"
      />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted, watch } from 'vue';
import MainPagination from '@/components/MainPagination.vue';
import ProductCard from '@/components/ProductCard.vue';
import qs from 'qs';

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 9;
const metadata = ref({
  lastPage: 0 // Initialize to avoid NaN issues
});
const isLoading = ref(true);
const searchQuery = ref('');

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/products', {
      params: {
        page: currentPage.value,
        itemsPerPage: itemsPerPage,
        P_name: searchQuery.value // Include search query here
      }
    });
    console.log('API Response:', response.data);
    products.value = response.data.data.products.map((product) => ({
      ...product,
      quantity: 1
    }));
    metadata.value = response.data.data.metadata; // Ensure it has lastPage
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isLoading.value = false;
  }
};

const paginatedProducts = computed(() => products.value);

const search = async () => {
  if (!searchQuery.value.trim()) {
    alert('Vui lòng nhập từ khóa tìm kiếm!');
    return;
  }

  currentPage.value = 1; // Reset to the first page on search
  await fetchProducts(); // Fetch products with the updated search query
};

const addToCart = async (product) => {
  console.log('check product', product);
  try {
    const userId = sessionStorage.getItem('userId'); // Get user ID from session storage

    // Check if userId is available
    if (!userId) {
      alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      return; // Exit if user ID is not found
    }

    // Prepare data as application/x-www-form-urlencoded
    const requestBody = qs.stringify({
      C_ID: userId, // Correctly set user ID for the cart
      P_ID: product.P_id, // Product ID
      AP_quantity: product.quantity // Quantity
    });

    // Send POST request to add product to cart
    const response = await axios.post('http://localhost:3000/api/v1/carts/add', requestBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Show success message
    alert(response.data.message || 'Sản phẩm đã được thêm vào giỏ hàng!');
  } catch (error) {
    console.error('Error adding to cart:', error); // Log error details
    alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
  }
};

// Fetch products on component mount and watch for currentPage changes
onMounted(fetchProducts);
watch(currentPage, fetchProducts); // Fetch products whenever currentPage changes
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 1.2em;
  margin: 20px 0;
}

.search-bar {
  max-width: 600px;
  width: 100%;
  margin-right: 15px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  justify-items: center;
}

.pagination-container {
  display: flex;
  justify-content: center; /* Center the pagination */
  padding-top: 5px; /* Add padding to the top */
}
</style>
