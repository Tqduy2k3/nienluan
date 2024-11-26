<template>
  <nav
    class="navbar navbar-expand bg-dark"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <!-- Shop Logo -->
      <a
        href="/homepage"
        class="navbar-brand"
      >
        <img
          src="/images/logo.jpg"
          alt="Shop Logo"
          class="logo"
        />
      </a>

      <!-- User Info & Cart -->
      <div class="d-flex align-items-center">
        <!-- User Information Link -->
        <div
          class="nav-item me-3"
          v-if="U_id"
        >
          <router-link
            :to="{ name: 'userInformation', params: { id: U_id } }"
            class="nav-link"
          >
            <i class="fas fa-user"></i> Tài khoản
          </router-link>
        </div>

        <!-- Cart Icon -->
        <div class="nav-item me-3">
          <a
            href="/addToCart"
            class="nav-link"
          >
            <i class="fas fa-shopping-basket"></i>
            <span class="badge bg-danger">{{ cartItemCount }}</span>
          </a>
        </div>

        <!-- Logout Button -->
        <button
          @click="logout"
          class="btn btn-outline-light"
          v-if="U_id"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';

// Reactive state
const U_id = ref(null);
const cartItemCount = ref(0);

// Router instance
const router = useRouter();

// Fetch user ID from session storage on mount
onMounted(() => {
  U_id.value = sessionStorage.getItem('userId');
  fetchCartItemCount();
});

// Cleanup the event listener when the component unmounts
onBeforeUnmount(() => {});

// Fetch cart item count from the API
const fetchCartItemCount = async () => {
  try {
    if (U_id.value) {
      const response = await axios.get(`/api/v1/carts/total/${U_id.value}`);
      if (response.data.status === 'success') {
        cartItemCount.value = response.data.data.totalQuantity;
      }
    }
  } catch (error) {
    console.error('Error fetching cart item count:', error);
  }
};

// Handle logout by clearing session storage and redirecting
const logout = () => {
  sessionStorage.removeItem('userId');
  U_id.value = null;
  router.push({ name: 'userLogin' });
};
</script>

<style scoped>
.navbar {
  padding: 1rem;
}

.logo {
  width: 120px;
  height: 65px;
  margin-right: 10px;
}

.navbar-brand {
  color: #fff;
  display: flex;
  align-items: center;
}

.badge {
  font-size: 0.8rem;
  vertical-align: top;
  margin-left: 5px;
}

.nav-link {
  color: #fff;
  display: flex;
  align-items: center;
}

.nav-item .fa-shopping-basket {
  font-size: 1.5rem;
  margin-right: 5px;
}

.btn-outline-light {
  color: #fff;
  border-color: #fff;
}

.btn-outline-light:hover {
  color: #000;
  background-color: #fff;
}
</style>
