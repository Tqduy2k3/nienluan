<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="text-center">Đăng ký tài khoản</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
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
                  v-model="username"
                  placeholder="Nhập tên người dùng"
                  required
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
                  v-model="address"
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>

              <!-- Phone number -->
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
                  v-model="phone"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label
                  for="password"
                  class="form-label"
                  >Mật khẩu</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <!-- Confirm Password -->
              <div class="mb-3">
                <label
                  for="confirmPassword"
                  class="form-label"
                  >Xác nhận mật khẩu</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-3 text-center">
                <small>
                  Bằng việc đăng ký, bạn đã đồng ý với
                  <span class="text-primary">CellphoneD</span> về
                  <a
                    href="#"
                    class="text-primary"
                    >điều khoản dịch vụ</a
                  >
                  &amp;
                  <a
                    href="#"
                    class="text-primary"
                    >chính sách bảo mật</a
                  >
                </small>
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                >
                  Đăng ký
                </button>
              </div>

              <!-- Login Prompt -->
              <div class="mt-3 text-center">
                <small>
                  Bạn đã có tài khoản?
                  <router-link
                    :to="{ name: 'userLogin' }"
                    class="text-primary"
                    >Đăng nhập</router-link
                  >
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive data variables
const username = ref('');
const address = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');

// Register function
const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu và xác nhận mật khẩu không khớp.');
    return;
  }

  try {
    const newUser = {
      U_username: username.value,
      U_address: address.value,
      U_phone: phone.value,
      U_password: password.value
    };

    const response = await fetch('/api/v1/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      alert('Đăng ký thành công!');
      router.push({ path: '/userLogin' });
    } else {
      alert('Đăng ký thất bại: ' + data.message);
    }
  } catch (error) {
    alert('Đã xảy ra lỗi khi đăng ký: ' + error.message);
  }
};
</script>

<style scoped>
/* Tổng thể */

.container {
  margin-top: 50px;
  background-image: url(/frontend/public/images/background.jpeg) !important;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15); /* Đổ bóng hiện đại */
  overflow: hidden;
}

.card-header {
  background-color: #0066cc; /* Xanh dương đậm */
  color: #ffffff;
  padding: 20px;
  text-align: center;
  border-bottom: none;
}

.card-header h3 {
  font-size: 1.5rem;
  margin: 0;
}

.card-body {
  padding: 2rem;
}

.form-label {
  font-weight: 600;
  color: #333333; /* Màu xám tối để dễ đọc */
}

.form-control {
  border-radius: 8px;
  border: 1px solid #dddddd;
  padding: 10px 15px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #0066cc; /* Tô màu khi chọn vào input */
  box-shadow: 0px 0px 5px rgba(0, 102, 204, 0.3);
}

.text-primary {
  color: #0066cc; /* Sử dụng màu xanh dương đậm nhất quán */
}

.btn-primary {
  background-color: #0066cc;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 15px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.btn-primary:hover {
  background-color: #004a99; /* Xanh dương đậm hơn khi hover */
  transform: scale(1.02); /* Tạo hiệu ứng phóng to nhẹ khi hover */
}

/* Điều khoản và đăng nhập */
.text-center small {
  color: #666666;
}

.text-center a {
  color: #0066cc;
  text-decoration: none;
}

.text-center a:hover {
  color: #004a99;
  text-decoration: underline;
}
</style>
