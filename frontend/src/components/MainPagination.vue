<template>
  <nav>
    <ul class="pagination">
      <li
        class="page-item"
        :class="{ disabled: currentPage === 1 }"
      >
        <a
          role="button"
          class="page-link"
          @click.prevent="updatePage(currentPage - 1)"
        >
          &laquo;
        </a>
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <a
          role="button"
          class="page-link"
          @click.prevent="updatePage(page)"
        >
          {{ page }}
        </a>
      </li>
      <li
        class="page-item"
        :class="{ disabled: currentPage === totalPages }"
      >
        <a
          role="button"
          class="page-link"
          @click.prevent="updatePage(currentPage + 1)"
        >
          &raquo;
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

// Props to define totalPages, currentPage, and length of the pagination window
const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    default: 5 // Default length of pagination
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

// Emit event to update currentPage
const emit = defineEmits(['update:currentPage']);

// Method to update the page number
const updatePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page);
  }
};

// Computed property to calculate the visible page numbers
const pages = computed(() => {
  const pageNumbers = [];
  const half = Math.floor(props.length / 2);
  let start = props.currentPage - half;
  let end = props.currentPage + half;

  // Adjust start and end if they go out of range
  if (start <= 0) {
    start = 1;
    end = props.length;
  }
  if (end > props.totalPages) {
    end = props.totalPages;
    start = end - props.length + 1;
    if (start <= 0) start = 1;
  }

  // Push the visible pages to the pageNumbers array
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
});
</script>

<style scoped>
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  color: #007bff;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
  color: #6c757d;
}

.page-item.active .page-link {
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
}

.page-link:hover {
  background-color: #f0f0f0;
}
</style>
