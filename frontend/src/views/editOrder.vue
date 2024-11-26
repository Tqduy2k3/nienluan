<template>
  <div>
    <h1>Danh sách đơn hàng</h1>

    <table :key="orderListKey">
      <!-- Sử dụng orderListKey để ép Vue render lại -->
      <thead>
        <tr>
          <th>ID</th>
          <th>ID người dùng</th>
          <th>ID khách hàng</th>
          <th>Trạng thái</th>
          <th>Ngày tạo</th>
          <th>Tổng giá</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.O_ID"
        >
          <td>{{ order.O_ID }}</td>
          <td>{{ order.U_ID }}</td>
          <td>{{ order.C_ID }}</td>
          <td>{{ order.O_status }}</td>
          <td>{{ formatDate(order.O_created) }}</td>
          <td>{{ order.O_total_price }}</td>
          <td>
            <button @click="toggleOrderStatus(order)">
              {{ order.O_status === 'pending' ? 'Mark as Completed' : 'Mark as Pending' }}
            </button>
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
import dayjs from 'dayjs';
import MainPagination from '@/components/MainPagination.vue';
import qs from 'qs';

const orders = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const ordersPerPage = 9;
const orderListKey = ref(0); // Biến key cho danh sách đơn hàng

const fetchOrders = async () => {
  try {
    const params = {
      page: currentPage.value,
      limit: ordersPerPage
    };

    const response = await axios.get('http://localhost:3000/api/v1/orders', { params });

    if (response.data && response.data.data) {
      orders.value = response.data.data.orders;
      totalPages.value = Math.ceil(response.data.data.metadata.totalRecords / ordersPerPage);
    } else {
      orders.value = [];
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
  }
};
const toggleOrderStatus = async (order) => {
  const newStatus = order.O_status === 'pending' ? 'completed' : 'pending';

  try {
    const response = await axios.put(
      `http://localhost:3000/api/v1/orders/${order.O_ID}`,
      qs.stringify({
        status: newStatus,
        totalPrice: order.O_total_price
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('API response:', response.data); // Kiểm tra nội dung phản hồi

    if (response.data && response.data.message === 'Order updated successfully') {
      alert(`Order status updated to ${newStatus}`);
      await fetchOrders();
    } else {
      console.error('Cập nhật thất bại:', response.data);
    }
    if (response.data && response.data.success) {
      alert(`Order status updated to ${newStatus}`);

      // Gọi lại fetchOrders để đồng bộ dữ liệu
      await fetchOrders();
    } else {
      console.error('Cập nhật thất bại:', response.data);
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
  }
};

const formatDate = (date) => {
  return dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD HH:mm') : 'Invalid Date';
};

const onPageChange = (newPage) => {
  currentPage.value = newPage;
  fetchOrders();
};

onMounted(fetchOrders);
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
