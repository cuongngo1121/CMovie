<template>
  <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black opacity-0 animate-fade-in-bg"></div>

    <div class="relative z-10 flex flex-col items-center">
      <!-- Logo Icon -->
      <div class="mb-4 opacity-0 animate-reveal-icon">
        <div class="w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)]">
          <span class="text-4xl font-black text-white">O</span>
        </div>
      </div>

      <!-- Main Text -->
      <h1 class="text-4xl md:text-6xl font-black text-white tracking-[0.3em] uppercase overflow-hidden">
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 0.5s;">P</span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 0.6s;">H</span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 0.7s;">I</span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 0.8s;">M</span>
        <span class="inline-block w-4"></span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 0.9s;">C</span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 1.0s;">H</span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 1.1s;">Ù</span>
        <span class="inline-block animate-reveal-text-up opacity-0" style="animation-delay: 1.2s;">A</span>
      </h1>

      <!-- Slogan / Subtext -->
      <p class="mt-4 text-gray-500 text-sm tracking-widest uppercase opacity-0 animate-fade-in-up" style="animation-delay: 1.5s;">
        Xem phim không quảng cáo
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['finish'])
const router = useRouter()

let timer = null
// Total duration: 1.2s (text) + 1s (hold) + 1s (extra)
const SPLASH_DURATION = 3500 

onMounted(() => {
  document.body.style.overflow = 'hidden'

  timer = setTimeout(() => {
    router.push({ name: 'Home' })
    emit('finish')
  }, SPLASH_DURATION)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
@keyframes reveal-icon {
  0% { transform: scale(0.5) rotate(-90deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes reveal-text-up {
  0% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in-up {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in-bg {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-reveal-icon {
  animation: reveal-icon 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-reveal-text-up {
  animation: reveal-text-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-bg {
  animation: fade-in-bg 1s ease-out forwards;
}
</style>
