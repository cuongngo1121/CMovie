<template>
  <div v-if="isLoading" class="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-500" :class="{ 'opacity-0 pointer-events-none': !isLoading }">
    <div class="relative flex flex-col items-center">
      <!-- Logo / Icon -->
      <div class="mb-6 relative">
        <div class="w-16 h-16 border-t-4 border-r-4 border-red-600 rounded-full animate-spin-slow"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-3xl font-black text-red-600 tracking-tighter">O</span>
        </div>
      </div>
      
      <!-- Text -->
      <h1 class="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 tracking-[0.2em] uppercase animate-pulse">
        Phim Chùa
      </h1>
      
      <!-- Loading Bar -->
      <div class="mt-8 w-48 h-1 bg-gray-900 rounded-full overflow-hidden">
        <div class="h-full bg-red-600 animate-loading-bar w-full origin-left"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

@keyframes loading-bar {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.5); }
  100% { transform: scaleX(1); }
}

.animate-loading-bar {
  animation: loading-bar 1.5s ease-in-out infinite;
}
</style>
