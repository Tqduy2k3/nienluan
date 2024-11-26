<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="text-center">Đăng nhập</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
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

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                >
                  Đăng nhập
                </button>
              </div>

              <!-- Registration Prompt -->
              <div class="mt-3 text-center">
                <small>
                  Chưa có tài khoản?
                  <router-link
                    :to="{ name: 'userSignup' }"
                    class="text-primary"
                  >
                    Đăng ký
                  </router-link>
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
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('U_username', username.value);
    formData.append('U_password', password.value);

    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.message === 'Login successful') {
      alert('Đăng nhập thành công!');
      sessionStorage.setItem('userId', data.user.id); // Adjust 'data.user.id' based on your response structure

      const U_role = data.user.role;

      if (U_role === 'user') {
        router.push({ path: '/homepage' });
      } else if (U_role === 'admin') {
        router.push({ path: '/manager' });
      } else {
        alert('Vai trò người dùng không xác định.');
      }
    } else {
      alert('Đăng nhập thất bại: ' + (data.message || 'Invalid credentials'));
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Đã xảy ra lỗi khi đăng nhập: ' + error.message);
  }
};
</script>

<style scoped>
/* Tổng thể */
.container {
  margin-top: 50px;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-header {
  background-color: #0066cc;
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
  color: #333333;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #dddddd;
  padding: 10px 15px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #0066cc;
  box-shadow: 0px 0px 5px rgba(0, 102, 204, 0.3);
}

.text-primary {
  color: #0066cc;
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
  background-color: #004a99;
  transform: scale(1.02);
}

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
