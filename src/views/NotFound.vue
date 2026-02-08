<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white p-4 text-center">
    <div class="relative mb-8">
      <h1 class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500 animate-pulse">404</h1>
      <div class="absolute -inset-1 blur-2xl bg-red-600/20 rounded-full -z-10"></div>
    </div>
    
    <h2 class="text-3xl md:text-5xl font-bold mb-4">Lạc Đạo Rồi Đạo Hữu Ơi!</h2>
    <p class="text-gray-400 text-lg md:text-xl max-w-lg mb-8">
      Trang này đã bị phong ấn hoặc không tồn tại trong Tam Giới. Hãy quay đầu là bờ!
    </p>

    <router-link 
      to="/" 
      class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      Về Trang Chủ
    </router-link>

    <div class="mt-12 opacity-50">
      <img src="/vue.svg" alt="Logo" class="w-16 h-16 opacity-20 mx-auto grayscale" />
    </div>
  </div>
</template>

<script setup>
// NotFound Component
</script>
