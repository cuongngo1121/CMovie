<template>
  <Teleport to="body">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all w-72"
        :class="{
          'bg-green-900/80 border-green-500/30 text-green-100': toast.type === 'success',
          'bg-amber-900/80 border-amber-500/30 text-amber-100': toast.type === 'warning',
          'bg-red-900/80 border-red-500/30 text-red-100': toast.type === 'error',
          'bg-[#1a1a1a]/90 border-white/10 text-white': toast.type === 'info',
        }"
      >
        <!-- Icons -->
        <span class="text-xl flex-shrink-0">
          <span v-if="toast.type === 'success'">✨</span>
          <span v-else-if="toast.type === 'warning'">⚡</span>
          <span v-else-if="toast.type === 'error'">🔥</span>
          <span v-else>👋</span>
        </span>
        
        <!-- Message -->
        <div class="flex-1 flex flex-col justify-center">
           <p class="text-sm font-semibold leading-tight">{{ toast.title }}</p>
           <p v-if="toast.message" class="text-[11px] opacity-80 leading-tight mt-0.5">{{ toast.message }}</p>
        </div>
        
        <!-- Close -->
        <button @click="removeToast(toast.id)" class="opacity-50 hover:opacity-100 transition-opacity p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);
let toastId = 0;

// Expose a global hook/method for other components to use
const addToast = (toast) => {
  const id = toastId++;
  toasts.value.push({
    id,
    type: toast.type || 'info', // success, warning, error, info
    title: toast.title,
    message: toast.message
  });
  
  setTimeout(() => {
    removeToast(id);
  }, toast.duration || 3000);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// We will attach this to the global Vue instance so we can inject it
defineExpose({ addToast });
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
