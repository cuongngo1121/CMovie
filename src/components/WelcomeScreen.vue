<template>
  <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
    <!-- Cinematic Lighting / Ambient Glow (Performance Optimized) -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_60%)]">
      <!-- Vignette -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
    </div>
    
    <!-- Top & Bottom Cinematic Bars (Letterbox) -->
    <div class="absolute inset-x-0 top-0 h-10 md:h-20 bg-black transform origin-top animate-letterbox-top z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"></div>
    <div class="absolute inset-x-0 bottom-0 h-10 md:h-20 bg-black transform origin-bottom animate-letterbox-bottom z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"></div>

    <div class="relative z-10 flex flex-col items-center justify-center w-full px-4">
      <!-- 3D Cinematic Abstract Logo Assembly -->
      <div class="relative w-28 h-28 md:w-40 md:h-40 mb-8 md:mb-12 group">
        <!-- Glowing Core -->
        <div class="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.4)_0%,transparent_70%)] animate-glow-pulse"></div>
        
        <!-- Rotating Cinematic Lens Rings -->
        <svg class="absolute inset-0 w-full h-full text-white/5 animate-spin-slow-reverse" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 6" />
        </svg>
        <svg class="absolute inset-0 w-full h-full text-red-500/30 animate-spin-slow" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="20 40 10 30" stroke-linecap="round" />
        </svg>
        <!-- Drawing Ring -->
        <svg class="absolute inset-0 w-full h-full text-red-600" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="214" stroke-dashoffset="214" class="animate-draw-circle" stroke-linecap="round" />
        </svg>

        <!-- Center Play Icon Assembly -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="relative w-10 h-10 md:w-16 md:h-16 flex items-center justify-center translate-x-[2px] md:translate-x-1 animate-pop-in">
            <svg class="w-full h-full text-red-600 filter drop-shadow-[0_0_12px_rgba(220,38,38,0.9)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 4v16l13-8z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Typography Sequence -->
      <div class="relative flex flex-col items-center">
        <!-- Premium Text Reveal -->
        <div class="overflow-hidden pb-4 md:pb-6 relative w-full flex justify-center">
          <h1 class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-white to-gray-400 uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-scale-down-text whitespace-nowrap">
            <span class="inline-block animate-tracking-in pr-2">PHIM CHÙA</span>
          </h1>
          <!-- Light Sweep Over Text -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 -translate-x-full animate-shimmer skew-x-12 mix-blend-overlay"></div>
        </div>
      </div>

      <!-- Slogan / Subtitle with elegant fade -->
      <p class="mt-2 text-gray-400 text-[10px] sm:text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase font-light opacity-0 animate-fade-in-up-delay text-center">
        Trải nghiệm <span class="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">điện ảnh</span> đỉnh cao
      </p>

      <!-- Minimalist Progress Bar -->
      <div class="mt-10 md:mt-16 w-40 md:w-64 h-[2px] md:h-[3px] bg-white/5 rounded-full overflow-hidden opacity-0 animate-fade-in-delay relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        <div class="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-800 via-red-500 to-red-400 -translate-x-full animate-progress-bar shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['finish'])

let timer = null
// Animation sequence is perfectly timed for 3.5 seconds
const SPLASH_DURATION = 3500 

onMounted(() => {
  document.body.style.overflow = 'hidden'

  timer = setTimeout(() => {
    emit('finish')
  }, SPLASH_DURATION)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
/* Keyframes */
@keyframes letterbox-top {
  0% { transform: scaleY(0); }
  20% { transform: scaleY(1); }
  85% { transform: scaleY(1); }
  100% { transform: scaleY(0); }
}

@keyframes letterbox-bottom {
  0% { transform: scaleY(0); }
  20% { transform: scaleY(1); }
  85% { transform: scaleY(1); }
  100% { transform: scaleY(0); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

@keyframes spin-slow-reverse {
  to { transform: rotate(-360deg); }
}

@keyframes draw-circle {
  0% { stroke-dashoffset: 214; transform: rotate(-90deg); transform-origin: center; filter: blur(4px); }
  40% { stroke-dashoffset: 0; transform: rotate(90deg); filter: blur(0); }
  100% { stroke-dashoffset: 0; transform: rotate(270deg); }
}

@keyframes pop-in {
  0% { transform: scale(0) translateX(0); opacity: 0; filter: blur(10px); }
  30% { transform: scale(0) translateX(0); opacity: 0; }
  50% { transform: scale(1.2) translateX(4px); opacity: 1; filter: blur(0); }
  60% { transform: scale(1) translateX(4px); }
  100% { transform: scale(1) translateX(4px); opacity: 1; }
}

@keyframes tracking-in {
  0% { letter-spacing: -0.5em; opacity: 0; filter: blur(12px); transform: translateZ(-100px); }
  35% { letter-spacing: -0.5em; opacity: 0; }
  65% { letter-spacing: 0.3em; opacity: 1; filter: blur(0); transform: translateZ(0); }
  100% { letter-spacing: 0.3em; opacity: 1; }
}

@keyframes scale-down-text {
  0%, 35% { transform: scale(1.5); }
  65% { transform: scale(1); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0%, 50% { transform: translateX(-100%) skewX(12deg); }
  80%, 100% { transform: translateX(200%) skewX(12deg); }
}

@keyframes fade-in-up-delay {
  0%, 65% { opacity: 0; transform: translateY(20px); filter: blur(5px); }
  85%, 100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

@keyframes fade-in-delay {
  0%, 40% { opacity: 0; }
  50%, 100% { opacity: 1; }
}

@keyframes progress-bar {
  0%, 40% { transform: translateX(-100%); }
  90%, 100% { transform: translateX(0); }
}

/* Animation Classes */
.animate-letterbox-top { animation: letterbox-top 3.5s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
.animate-letterbox-bottom { animation: letterbox-bottom 3.5s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
.animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
.animate-spin-slow-reverse { animation: spin-slow-reverse 12s linear infinite; }
.animate-draw-circle { animation: draw-circle 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-pop-in { animation: pop-in 3.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-tracking-in { animation: tracking-in 3.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; }
.animate-scale-down-text { animation: scale-down-text 3.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards; }
.animate-shimmer { animation: shimmer 3.5s ease-in-out forwards; }
.animate-fade-in-up-delay { animation: fade-in-up-delay 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in-delay { animation: fade-in-delay 3.5s ease-out forwards; }
.animate-progress-bar { animation: progress-bar 3.5s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
</style>
