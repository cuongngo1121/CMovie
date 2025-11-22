<template>
  <div class="relative w-full h-[500px] md:h-[700px] bg-primary-dark overflow-hidden">
    <swiper
      :slides-per-view="1"
      :modules="[Autoplay, Pagination, EffectFade]"
      :effect="'fade'"
      :loop="true"
      :pagination="{ 
        clickable: true,
        el: '.custom-pagination'
      }"
      class="h-full"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false
      }"
    >
      <swiper-slide
        v-for="(movie, index) in movies"
        :key="index"
        class="relative"
      >
        <!-- Background Image with Overlay -->
        <div class="absolute inset-0">
          <img
            class="w-full h-full object-cover"
            :src="getImageUrl(movie.thumb_url)"
            :alt="movie.name"
          >
          <!-- Dark gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent"></div>
        </div>

        <!-- Content -->
        <div class="relative h-full flex items-center">
          <div class="container mx-auto px-4 md:px-12 max-w-7xl">
            <div class="max-w-2xl">
              <!-- Title -->
              <h1 class="text-3xl md:text-6xl font-bold text-primary mb-2 md:mb-4 line-clamp-2">
                {{ movie.name }}
              </h1>
              
              <!-- Origin Name -->
              <p class="text-lg md:text-2xl text-text-secondary mb-4 md:mb-6 line-clamp-1">
                {{ movie.origin_name }}
              </p>

              <!-- Meta Info -->
              <div class="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                <span class="px-3 py-1 md:px-4 md:py-2 bg-secondary text-primary-dark rounded-lg text-xs md:text-sm font-semibold">
                  {{ movie.year || '2024' }}
                </span>
                <span class="px-3 py-1 md:px-4 md:py-2 bg-bg-elevated text-primary rounded-lg text-xs md:text-sm font-semibold border border-border">
                  {{ movie.time || '120 phút' }}
                </span>
                <span class="px-3 py-1 md:px-4 md:py-2 bg-bg-elevated text-primary rounded-lg text-xs md:text-sm font-semibold border border-border">
                  {{ movie.type || 'Phim lẻ' }}
                </span>
                <span v-if="movie.lang" class="hidden md:inline-block px-4 py-2 bg-bg-elevated text-primary rounded-lg text-sm font-semibold border border-border">
                  {{ movie.lang }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3 md:gap-4">
                <button
                  @click="goToMovieWatch(movie)"
                  class="group flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-secondary hover:bg-secondary-light text-primary-dark rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-secondary/50"
                >
                  <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Xem Ngay</span>
                </button>
                
                <button
                  @click="goToMovieDetails(movie)"
                  class="group flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-bg-elevated hover:bg-bg-card text-primary rounded-xl font-semibold text-base md:text-lg transition-all duration-300 border-2 border-border hover:border-secondary"
                >
                  <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Chi Tiết</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Custom Pagination -->
    <div class="custom-pagination absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2"></div>
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
  const cdn = 'https://img.ophim.live'
  if (!url) return ''
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

const movies = computed(() => {
  const items = movieStore.movies?.data?.items
  console.log('🎬 Banner Movies:', items)
  return Array.isArray(items) ? items.slice(0, 5) : []
})

function goToMovieDetails(movie) {
  console.log('Navigating to movie details for slug:', movie.slug)
  router.push({ path: `/movie/${movie.slug}` })
}

function goToMovieWatch(movie) {
  console.log('Navigating to watch movie for slug:', movie.slug)
  router.push({ path: `/watch/${movie.slug}` })
}
</script>

<style scoped>
/* Custom pagination dots */
:deep(.custom-pagination .swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
  transition: all 0.3s ease;
  border-radius: 4px;
}

:deep(.custom-pagination .swiper-pagination-bullet-active) {
  background: #F59E0B;
  width: 24px;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
}

@media (min-width: 768px) {
  :deep(.custom-pagination .swiper-pagination-bullet) {
    width: 12px;
    height: 12px;
    border-radius: 6px;
  }

  :deep(.custom-pagination .swiper-pagination-bullet-active) {
    width: 32px;
  }
}
</style>
