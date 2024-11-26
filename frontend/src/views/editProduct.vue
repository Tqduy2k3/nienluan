<template>
  <div class="edit-product">
    <h1>Chỉnh sửa sản phẩm</h1>
    <form @submit.prevent="updateProduct">
      <div class="form-group">
        <label for="name">Tên sản phẩm:</label>
        <input
          type="text"
          v-model="productForm.P_name"
        />
      </div>
      <div class="form-group">
        <label for="price">Giá:</label>
        <input
          type="number"
          v-model="productForm.P_price"
        />
      </div>
      <div class="form-group">
        <label for="description">Mô tả:</label>
        <textarea v-model="productForm.P_description"></textarea>
      </div>
      <button type="submit">Cập nhật sản phẩm</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
const message = ref('');
const productForm = ref({});
const route = useRoute();
const productId = parseInt(route.params.id, 10); // Ensure the ID is an integer

const fetchProductDetails = async () => {
  if (!productId) {
    message.value = 'ID sản phẩm không hợp lệ.';
    return;
  }

  try {
    const response = await axios.get(`/api/v1/products/${productId}`);
    const productData = response.data.data;
    productForm.value = {
      P_ID: productData.P_ID,
      P_name: productData.P_name,
      P_price: productData.P_price,
      P_description: productData.P_description
    };
  } catch (error) {
    console.error('Error fetching product details:', error.response ? error.response.data : error);
    message.value = 'Không thể tải chi tiết sản phẩm.';
  }
};

const updateProduct = async () => {
  const updatedProduct = {
    P_ID: productForm.value.P_ID,
    P_name: productForm.value.P_name || undefined,
    P_price: productForm.value.P_price !== null ? productForm.value.P_price : undefined,
    P_description: productForm.value.P_description || undefined
  };

  try {
    const response = await axios.put(`/api/v1/products/${productId}`, updatedProduct);
    message.value = response.data.message || 'Cập nhật sản phẩm thành công!';
  } catch (error) {
    console.error('Error updating product:', error.response ? error.response.data : error);
    message.value =
      'Có lỗi xảy ra khi cập nhật sản phẩm: ' +
      (error.response ? error.response.data.message : 'Lỗi không xác định');
  }
};

onMounted(fetchProductDetails);
</script>

<style scoped>
h1 {
  text-align: center;
}

.edit-product {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #45a049;
}

p {
  margin-top: 20px;
  color: #333;
  text-align: center;
}
</style>
