<template>
  <nav
    class="navbar navbar-expand bg-dark"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <!-- Shop Logo -->
      <a
        href="/manager"
        class="navbar-brand"
      >
        <img
          src="/images/logo.jpg"
          alt="Shop Logo"
          class="logo"
        />
      </a>

      <!-- Action Buttons -->
      <div class="d-flex">
        <!-- Add Product Button -->
        <button
          class="btn btn-primary me-2"
          @click="addProduct"
        >
          Thêm Sản Phẩm
        </button>

        <!-- Manage Users Button -->
        <router-link
          :to="{ name: 'editUser' }"
          class="btn btn-info me-2"
        >
          Quản Lý Người Dùng
        </router-link>

        <!-- Manage Orders Button -->
        <router-link
          :to="{ name: 'editOrder' }"
          class="btn btn-success"
        >
          Quản Lý Đơn Hàng
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Router instance
const router = useRouter();

// Methods
const addProduct = () => {
  // Redirect or handle the "Add Product" functionality
  router.push({ name: 'addProduct' });
};

const manageUsers = () => {
  // Redirect or handle the "Manage Users" functionality
  router.push({ name: 'editUser' });
};

const manageOrders = () => {
  // Redirect or handle the "Manage Orders" functionality
  router.push({ name: 'editOrder' });
};
</script>

<style scoped>
/* Navbar Styling */
.navbar {
  padding: 1rem;
  background-color: #2c3e50; /* Darker, more modern color */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.navbar-brand {
  color: #ffffff;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  width: 120px;
  height: auto; /* Auto height to maintain aspect ratio */
  margin-right: 10px;
  border-radius: 8px; /* Rounded corners for a modern look */
}

/* Button Styles */
.btn {
  font-weight: 500; /* Slightly bolder text for buttons */
  padding: 0.5rem 1rem; /* Consistent padding */
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease; /* Smooth transition */
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}
.btn-primary:hover {
  background-color: #2980b9; /* Darker shade on hover */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-info {
  background-color: #1abc9c;
  border-color: #1abc9c;
}
.btn-info:hover {
  background-color: #16a085;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-success {
  background-color: #2ecc71;
  border-color: #2ecc71;
}
.btn-success:hover {
  background-color: #27ae60;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

/* Spacing */
.me-2 {
  margin-right: 1rem; /* More spacious margin between buttons */
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: center;
  }

  .d-flex {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .btn {
    width: 100%;
  }
}
</style>
