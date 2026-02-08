<template>
  <div class="relative w-full h-screen min-h-[600px] bg-black overflow-hidden group">
    <swiper
      :slides-per-view="1"
      :modules="[Autoplay, Pagination, EffectFade]"
      :effect="'fade'"
      :loop="true"
      :speed="1000"
      :pagination="{ 
        clickable: true,
        el: '.hero-pagination'
      }"
      :autoplay="{
        delay: 8000,
        disableOnInteraction: false
      }"
      class="h-full w-full"
    >
      <swiper-slide
        v-for="(movie, index) in movies"
        :key="index"
        class="relative h-full w-full"
      >
        <!-- Background Image with Ken Burns Effect -->
        <div class="absolute inset-0 overflow-hidden">
          <img
            class="w-full h-full object-cover object-center animate-ken-burns"
            :src="getImageUrl(movie.thumb_url || movie.poster_url)"
            :alt="movie.name"
            loading="lazy"
          >
          <!-- Cinematic Gradients -->
          <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent h-40"></div>
        </div>

        <!-- Content Content -->
        <div class="absolute inset-0 flex items-center">
          <div class="container mx-auto px-4 md:px-12 max-w-[1536px] pt-20">
            <div class="max-w-4xl space-y-6">
              <!-- Movie Title -->
              <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl opacity-0 animate-slide-up" style="animation-delay: 0.2s;">
                {{ movie.name }}
              </h1>
              
              <!-- Origin Name -->
              <p class="text-2xl md:text-3xl text-white/80 font-light italic opacity-0 animate-slide-up" style="animation-delay: 0.4s;">
                 {{ movie.origin_name }}
              </p>

              <!-- Meta Row -->
              <div class="flex items-center gap-4 text-base md:text-lg font-medium text-gray-200 opacity-0 animate-slide-up" style="animation-delay: 0.6s;">
                <span class="text-[#46d369] font-bold">98% Match</span>
                <span class="text-gray-400">•</span>
                <span>{{ movie.year }}</span>
                <span class="text-gray-400">•</span>
                <span class="border border-white/30 px-2 py-0.5 rounded text-sm bg-black/30 backdrop-blur-sm">{{ movie.quality || 'HD' }}</span>
                <span class="text-gray-400">•</span>
                <span>{{ movie.lang }}</span>
              </div>

              <!-- Description -->
              <p class="text-gray-300 text-lg md:text-xl line-clamp-3 max-w-2xl leading-relaxed drop-shadow-lg opacity-0 animate-slide-up" style="animation-delay: 0.8s;">
                 {{ movie.content || 'Một siêu phẩm điện ảnh không thể bỏ lỡ. Khám phá ngay thế giới phim đặc sắc với chất lượng hình ảnh tuyệt đỉnh...' }}
              </p>

              <!-- Buttons -->
              <div class="flex flex-wrap gap-4 pt-6 opacity-0 animate-slide-up" style="animation-delay: 1s;">
                <button
                  @click="goToMovieWatch(movie)"
                  class="group flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-red-600/20"
                >
                  <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>Phát Ngay</span>
                </button>
                
                <button
                  @click="goToMovieDetails(movie)"
                  class="group flex items-center gap-3 px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-md hover:scale-105"
                >
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Thông Tin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Custom Pagination -->
    <div class="hero-pagination absolute bottom-12 right-12 z-20 flex gap-3 justify-end"></div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'
import { onMounted, computed } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import { useRouter } from 'vue-router'

const movieStore = useMovieStore()
const router = useRouter()

onMounted(() => {
  movieStore.getNewMovies()
})

const getImageUrl = (url) => {
  if (!url) return ''
  const cdn = 'https://img.ophim.live'
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

const movies = computed(() => {
  const items = movieStore.movies?.data?.items
  return Array.isArray(items) ? items.slice(0, 5) : []
})

function goToMovieDetails(movie) {
  router.push({ path: `/movie/${movie.slug}` })
}

function goToMovieWatch(movie) {
  router.push({ path: `/watch/${movie.slug}` })
}
</script>

<style scoped>
/* Ken Burns Effect */
@keyframes kenBurns {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}

.animate-ken-burns {
  animation: kenBurns 20s linear infinite alternate;
}

/* Staggered Slide Up Animation */
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Pagination Styling */
:deep(.hero-pagination .swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: white;
  opacity: 0.3;
  border-radius: 50%;
  transition: all 0.4s ease;
  margin: 0 6px !important;
  position: relative;
}

:deep(.hero-pagination .swiper-pagination-bullet::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 1px solid white;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

:deep(.hero-pagination .swiper-pagination-bullet-active) {
  opacity: 1;
  background: #E50914;
  width: 12px;
  height: 12px;
}

:deep(.hero-pagination .swiper-pagination-bullet-active::after) {
  opacity: 1;
  border-color: #E50914;
  transform: translate(-50%, -50%) scale(1.5);
}
</style>
