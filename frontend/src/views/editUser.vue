<template>
  <div>
    <h1>Danh sách người dùng</h1>

    <!-- Search Bar -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Nhập tên người dùng và nhấn Enter để tìm kiếm"
      @keyup.enter="searchUser"
    />

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên người dùng</th>
          <th>Số điện thoại</th>
          <th>Địa chỉ</th>
          <th>Vai trò</th>
          <th>Ngày tạo</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.U_id"
        >
          <td>{{ user.U_id }}</td>
          <td>{{ user.U_username }}</td>
          <td>{{ user.U_phone }}</td>
          <td>{{ user.U_address }}</td>
          <td>{{ user.U_role }}</td>
          <td>{{ formatDate(user.U_created_at) }}</td>
          <td>
            <button @click="deleteUser(user.U_id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-container">
      <MainPagination
        :totalPages="totalPages"
        :currentPage="currentPage"
        @update:currentPage="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
import dayjs from 'dayjs';
import MainPagination from '@/components/MainPagination.vue';

const users = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const usersPerPage = 100;
const searchQuery = ref('');

const fetchUsers = async () => {
  try {
    const params = {
      page: currentPage.value,
      limit: usersPerPage,
      name: searchQuery.value
    };

    const response = await axios.get('/api/v1/users', { params });

    if (response.data && response.data.data) {
      users.value = response.data.data.users;
      totalPages.value = Math.ceil(response.data.data.total / usersPerPage);
    } else {
      users.value = [];
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
  }
};

const deleteUser = async (userId) => {
  if (!userId) return;
  try {
    const response = await axios.delete(`/api/v1/users/${userId}/delete`);
    if (response.data && response.data.data) {
      alert(response.data.data.message);
    }
    await fetchUsers();
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error.response ? error.response.data : error.message);
  }
};

const formatDate = (date) => {
  const parsedDate = dayjs(date);
  return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD HH:mm') : 'Invalid Date';
};

const onPageChange = (newPage) => {
  currentPage.value = newPage;
  fetchUsers();
};

const searchUser = async () => {
  currentPage.value = 1;
  await fetchUsers();
};

onMounted(fetchUsers);
</script>

<style scoped>
input[type='text'] {
  display: block;
  margin: 20px auto;
  padding: 10px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

h1 {
  display: flex;
  justify-content: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4caf50;
  color: white;
}

tr:hover {
  background-color: #f1f1f1;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #d32f2f;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }

  thead tr {
    display: none;
  }

  tr {
    margin-bottom: 10px;
    border: 1px solid #ddd;
  }

  td {
    text-align: right;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>
