<template>
  <div class="animate-pulse flex flex-col h-full">
    <!-- Image Skeleton -->
    <div class="relative aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden mb-3">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer"></div>
      <!-- Badge Skeleton -->
      <div class="absolute top-2 left-2 w-12 h-5 bg-gray-700 rounded-md"></div>
      <div class="absolute top-2 right-2 w-16 h-5 bg-gray-700 rounded-md"></div>
    </div>
    
    <!-- Title Skeleton -->
    <div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
    
    <!-- Subtitle Skeleton -->
    <div class="h-3 bg-gray-800 rounded w-1/2"></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite linear;
}
</style>
