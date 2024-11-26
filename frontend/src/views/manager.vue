<template>
  <div>
    <h1 class="text-center my-4">Quản lý sản phẩm</h1>

    <!-- Search Bar -->
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

    <!-- Product List Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên sản phẩm</th>
          <th>Giá (VND)</th>
          <th>Mô tả</th>
          <th>Hình ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.P_id"
        >
          <td>{{ product.P_id }}</td>
          <td>{{ product.P_name }}</td>
          <td>{{ formatCurrency(product.P_price) }}</td>
          <td>{{ product.P_description }}</td>
          <td>
            <img
              class="product-image"
              :src="getImageUrl(product.P_image_url)"
              alt="Product Image"
            />
          </td>
          <td>
            <router-link
              :to="{ name: 'editProduct', params: { id: product.P_id } }"
              class="btn btn-sm btn-primary"
            >
              Edit
            </router-link>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteProduct(product.P_id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
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
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import MainPagination from '@/components/MainPagination.vue';

const products = ref([]);
const currentPage = ref(1);
const metadata = ref({ lastPage: 0 });
const searchQuery = ref('');

// Fetch Products from API with Pagination and Search Query
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/products', {
      params: {
        page: currentPage.value,
        P_name: searchQuery.value // Include search query in API call
      }
    });
    products.value = response.data.data.products;
    metadata.value = response.data.data.metadata;
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Error fetching products. Please try again later.');
  }
};

// Function to Trigger Search
const search = async () => {
  if (!searchQuery.value.trim()) {
    alert('Vui lòng nhập từ khóa tìm kiếm!');
    return;
  }
  currentPage.value = 1; // Reset to the first page on search
  await fetchProducts(); // Fetch products with the updated search query
};

const getImageUrl = (imageUrl) => {
  const uploadImagePath = `http://localhost:3000/public/upload/${imageUrl}`;
  return imageUrl ? uploadImagePath : '';
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`http://localhost:3000/api/v1/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  }
};

onMounted(fetchProducts);
watch(currentPage, fetchProducts);
</script>

<style scoped>
.product-image {
  width: 110px;
  height: 120px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 5px;
}

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
