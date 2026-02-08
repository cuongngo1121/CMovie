<template>
  <button
    class="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 font-semibold group"
  >
    <span>{{ label }}</span>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5 transform transition-transform group-hover:translate-x-1" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Xem Ngay'
  }
});
</script>
