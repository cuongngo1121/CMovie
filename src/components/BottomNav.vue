<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10 pb-safe lg:hidden">
    <div class="flex items-center justify-around h-16">
      <router-link 
        to="/" 
        class="flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 hover:text-white transition-colors"
        active-class="text-red-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px] font-medium">Trang chủ</span>
      </router-link>

      <router-link 
        to="/tim-kiem" 
        class="flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 hover:text-white transition-colors"
        active-class="text-red-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-[10px] font-medium">Tìm kiếm</span>
      </router-link>

      <router-link 
        to="/danh-sach/phim-le" 
        class="flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 hover:text-white transition-colors"
        active-class="text-red-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <span class="text-[10px] font-medium">Phim Lẻ</span>
      </router-link>

      <button 
        @click="$emit('open-menu')"
        class="flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span class="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['open-menu'])
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
