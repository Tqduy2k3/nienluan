<template>
  <div class="add-product">
    <h1>Thêm Sản phẩm</h1>
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="name">Tên sản phẩm:</label>
        <input
          v-model="productName"
          type="text"
          id="name"
          required
        />
      </div>

      <div class="form-group">
        <label for="price">Giá:</label>
        <input
          v-model.number="productPrice"
          type="number"
          id="price"
          step="0.01"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Mô tả:</label>
        <textarea
          v-model="productDescription"
          id="description"
          required
        ></textarea>
      </div>

      <!-- File input for image upload -->
      <div class="form-group">
        <label for="image">Hình ảnh:</label>
        <input
          @change="handleFileUpload"
          type="file"
          id="image"
          accept="image/*"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
      >
        <span v-if="loading">Đang thêm...</span>
        <span v-else>Thêm sản phẩm</span>
      </button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const productName = ref('');
const productPrice = ref(0);
const productDescription = ref('');
const productImage = ref(null);
const message = ref('');
const loading = ref(false);

const handleFileUpload = (event) => {
  productImage.value = event.target.files[0];
};

const addProduct = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('P_name', productName.value);
    formData.append('P_price', productPrice.value);
    formData.append('P_description', productDescription.value);
    formData.append('P_avatarFile', productImage.value);

    const response = await axios.post('/api/v1/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    message.value = 'Sản phẩm đã được thêm thành công!';
    resetForm();
  } catch (error) {
    message.value = 'Lỗi khi thêm sản phẩm: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  productName.value = '';
  productPrice.value = 0;
  productDescription.value = '';
  productImage.value = null;
};
</script>

<style scoped>
h1 {
  display: flex;
  justify-content: center;
}

.add-product {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 8px;
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
