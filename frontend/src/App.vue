<template>
  <div>
    <!-- Conditionally Render the Appropriate Header -->
    <component
      :is="currentHeader"
      v-if="!hideHeader"
    />
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppHeaderAdmin from './components/AppHeaderAdmin.vue';

export default {
  components: {
    AppHeader,
    AppHeaderAdmin
  },
  setup() {
    const route = useRoute();

    // Compute if the header should be hidden based on the current route
    const hideHeader = computed(() => {
      // Hide the header on specific routes
      return route.name === 'userLogin' || route.name === 'userSignup';
    });

    // Compute the current header component based on the route
    const currentHeader = computed(() => {
      // Use `AppHeaderAdmin` if the route is `manager`, otherwise use `AppHeader`
      return route.name === 'manager' ||
        route.name === 'editUser' ||
        route.name === 'editProduct' ||
        route.name === 'addProduct' ||
        route.name === 'editOrder'
        ? 'AppHeaderAdmin'
        : 'AppHeader';
    });

    return {
      hideHeader,
      currentHeader
    };
  }
};
</script>
