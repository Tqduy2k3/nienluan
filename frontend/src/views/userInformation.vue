<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="text-center">Thông tin tài khoản</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateUserInfo">
              <!-- Username -->
              <div class="mb-3">
                <label
                  for="username"
                  class="form-label"
                  >Tên người dùng</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="userInfo.U_username"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              <!-- Address -->
              <div class="mb-3">
                <label
                  for="address"
                  class="form-label"
                  >Địa chỉ</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  v-model="userInfo.U_address"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <!-- Phone Number -->
              <div class="mb-3">
                <label
                  for="phone"
                  class="form-label"
                  >Số điện thoại</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="phone"
                  v-model="userInfo.U_phone"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <!-- New Password -->
              <div class="mb-3">
                <label
                  for="newPassword"
                  class="form-label"
                  >Mật khẩu mới</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  v-model="newPassword"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <!-- Confirm New Password -->
              <div class="mb-3">
                <label
                  for="confirmNewPassword"
                  class="form-label"
                  >Xác nhận mật khẩu mới</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmNewPassword"
                  v-model="confirmNewPassword"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>

              <!-- Update Button -->
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userInfo = ref({
  U_username: '',
  U_address: '',
  U_phone: ''
});
const newPassword = ref('');
const confirmNewPassword = ref('');
const id = route.params.id;

const loadUserInfo = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data && data.data) {
      userInfo.value = {
        U_username: data.data.U_username || '',
        U_address: data.data.U_address || '',
        U_phone: data.data.U_phone || ''
      };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    alert('Không thể tải thông tin người dùng');
  }
};

const updateUserInfo = async () => {
  if (newPassword.value && newPassword.value !== confirmNewPassword.value) {
    alert('Mật khẩu mới không khớp!');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userInfo.value,
        U_password: newPassword.value || undefined
      })
    });
    const data = await response.json();

    if (response.ok && data.message === 'User updated successfully') {
      alert('Cập nhật thông tin thành công!');
      router.push({ path: '/homepage' });
    } else {
      alert('Cập nhật thất bại: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error updating user information:', error);
    alert('Có lỗi xảy ra khi cập nhật thông tin');
  }
};

onMounted(loadUserInfo);
</script>

<style scoped>
.container {
  margin-top: 50px;
}

.card {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
