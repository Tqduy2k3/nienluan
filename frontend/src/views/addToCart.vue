<template>
  <div>
    <h2 class="text-center my-4">Giỏ Hàng</h2>

    <div class="cart-list">
      <div
        v-for="item in cartItems"
        :key="item.P_id"
        class="cart-item"
      >
        <img
          :src="`public/upload/${item.P_image_url}`"
          alt="Product Image"
          class="cart-item-image"
        />
        <div class="cart-item-details">
          <h3>{{ item.P_name }}</h3>
          <p class="cart-item-price">{{ item.P_price }} VND</p>
          <p class="cart-item-quantity">Số lượng: {{ item.AP_quantity }}</p>
          <button
            class="remove-button"
            @click="removeFromCart(item.P_id)"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>

    <div class="cart-summary text-center my-4">
      <p class="total-price">Tổng Giá: {{ totalPrice }} VND</p>
      <button
        class="checkout-button"
        @click="checkout"
      >
        Thanh Toán
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';

const cartItems = ref([]); // Store cart items
const totalPrice = ref(0); // Total price of the cart

// Props
const props = defineProps({
  cartId: {
    type: Number,
    required: true
  }
});

// Fetch cart items from the backend API
const fetchCartItems = async () => {
  const userId = sessionStorage.getItem('userId'); // Get user ID from session storage
  if (!userId) {
    console.error('User ID not found in session storage');
    return; // Exit if user ID is not found
  }

  try {
    const response = await axios.get(`/api/v1/carts/${userId}`); // Use user ID as cart ID
    if (response.data.status === 'success') {
      cartItems.value = response.data.data.products; // Assign fetched products to cartItems
      totalPrice.value = response.data.data.totalPrice; // Set the total price
    } else {
      console.error('Failed to fetch cart data');
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};

// Remove an item from the cart
const removeFromCart = async (productId) => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    console.error('User ID not found in session storage');
    return;
  }

  try {
    // Call the API to remove the item from the cart
    const response = await axios.delete(`/api/v1/carts/${productId}/${userId}`);

    if (response.data.status === 'success') {
      // Update cart items locally by removing the item with the specified productId
      cartItems.value = cartItems.value.filter((item) => item.P_id !== productId);
      // Recalculate total price after removal
      totalPrice.value = cartItems.value.reduce(
        (total, item) => total + item.P_price * item.AP_quantity,
        0
      );
      console.log(`Product with ID ${productId} removed successfully.`);
    } else {
      console.error('Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

// Handle checkout process
const checkout = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    console.error('User ID not found in session storage');
    return;
  }

  try {
    // Call the API to create a new order
    const response = await axios.post('/api/v1/orders', {
      userId: userId,
      cartId: userId,
      totalPrice: totalPrice.value,
      status: 'pending'
    });

    if (response.data && response.data.message === 'Order created successfully') {
      console.log('Order created successfully');
      // Clear the cart or navigate to a success page
      cartItems.value = []; // Clear local cart items
      totalPrice.value = 0; // Reset total price
      alert('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.');
    } else {
      console.error('Failed to create order');
    }
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

// Fetch cart items when the component is mounted
onMounted(fetchCartItems);
</script>

<style scoped>
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}

.cart-item-details {
  flex-grow: 1;
}

.cart-item-price {
  font-size: 1.2em;
  color: #28a745;
}

.cart-summary {
  border-top: 2px solid #ddd;
  padding-top: 10px;
}

.total-price {
  font-size: 1.5em;
  font-weight: bold;
}

.checkout-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
}

.checkout-button:hover {
  background-color: #0056b3;
}

.remove-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}
</style>
