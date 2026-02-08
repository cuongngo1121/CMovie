<template>
  <div class="w-full py-8 md:py-12 text-white relative">
    <!-- Background Glow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-48 md:w-64 h-48 md:h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-48 md:w-64 h-48 md:h-64 bg-secondary/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-6 md:mb-8">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-1 md:w-1.5 h-8 md:h-10 bg-gradient-to-b from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <div>
            <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Phim Mới Cập Nhật
            </h2>
            <p class="text-text-muted text-sm md:text-base lg:text-lg hidden sm:block">Những bộ phim hot nhất vừa ra mắt</p>
          </div>
        </div>
        
        <!-- View All Button -->
        <router-link 
          to="/movies" 
          class="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 group backdrop-blur-md text-sm md:text-base"
        >
          <span class="text-secondary font-medium group-hover:text-secondary-light hidden sm:inline">Xem tất cả</span>
          <svg class="w-4 h-4 md:w-5 md:h-5 text-secondary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="movieStore.loading" class="relative">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          <SkeletonCard v-for="n in 6" :key="n" />
        </div>
      </div>

      <!-- Movies Swiper -->
      <div v-else-if="movies.length > 0" class="relative group/swiper">
        <swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="2.3"
          :space-between="12"
          :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }"
          :loop="movies.length > 6"
          :navigation="{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom'
          }"
          :pagination="{
            el: '.swiper-pagination-custom',
            clickable: true,
            dynamicBullets: true
          }"
          :breakpoints="{
            480: { slidesPerView: 2.5, spaceBetween: 14 },
            640: { slidesPerView: 3.2, spaceBetween: 16 },
            768: { slidesPerView: 3.5, spaceBetween: 20 },
            1024: { slidesPerView: 4.5, spaceBetween: 24 },
            1280: { slidesPerView: 5.5, spaceBetween: 28 },
            1536: { slidesPerView: 6.2, spaceBetween: 32 }
          }"
          class="pb-10 md:pb-12 !overflow-visible"
        >
          <swiper-slide
            v-for="(movie, index) in movies"
            :key="movie._id || index"
            class="h-auto"
          >
            <MovieCard 
              :movie="movie" 
              @click="goToMovieDetails(movie)"
              class="h-full"
            />
          </swiper-slide>
        </swiper>

        <!-- Custom Navigation Buttons - Desktop Only -->
        <button class="swiper-button-prev-custom hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-black/60 hover:bg-secondary backdrop-blur-md rounded-full items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 -ml-5 opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:ml-0 text-white hover:text-black border border-white/10">
          <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button class="swiper-button-next-custom hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-black/60 hover:bg-secondary backdrop-blur-md rounded-full items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 -mr-5 opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:mr-0 text-white hover:text-black border border-white/10">
          <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Custom Pagination -->
        <div class="swiper-pagination-custom !bottom-0 flex items-center justify-center gap-1.5 md:gap-2"></div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 md:py-20">
        <div class="text-4xl md:text-6xl mb-4">🎬</div>
        <h3 class="text-lg md:text-xl font-semibold mb-2">Chưa có phim</h3>
        <p class="text-text-muted text-sm md:text-base">Hãy quay lại sau để xem nội dung mới</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import MovieCard from './MovieCard.vue'
import SkeletonCard from './SkeletonCard.vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

const router = useRouter()
const movieStore = useMovieStore()

const movies = computed(() => {
  const allMovies = movieStore.movies?.data?.items || movieStore.movies?.items || []
  return allMovies.slice(0, 24)
})


function goToMovieDetails(movie) {
  router.push({ path: `/movie/${movie.slug}` })
}
</script>

<style scoped>
/* Custom Pagination Dots */
:deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
  transition: all 0.3s;
}

@media (min-width: 768px) {
  :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
  }
}

:deep(.swiper-pagination-bullet-active) {
  background: linear-gradient(135deg, #F59E0B, #EF4444);
  width: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

@media (min-width: 768px) {
  :deep(.swiper-pagination-bullet-active) {
    width: 24px;
  }
}

/* Smooth transitions */
.swiper {
  transition: all 0.3s ease;
}

/* Mobile touch area improvements */
@media (max-width: 768px) {
  :deep(.swiper-slide) {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>