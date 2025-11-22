<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-12 text-white relative overflow-hidden">
    <!-- Background Glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none">
      <div class="absolute top-20 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-[1600px] mx-auto">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">
          <div class="w-1.5 h-10 bg-gradient-to-b from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-2 text-shadow">
              Phim Mới Cập Nhật
            </h2>
            <p class="text-text-muted text-lg">Những bộ phim hot nhất vừa ra mắt</p>
          </div>
        </div>
        
        <!-- View All Button -->
        <router-link 
          to="/movies" 
          class="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 group backdrop-blur-md"
        >
          <span class="text-secondary font-medium group-hover:text-secondary-light">Xem tất cả</span>
          <svg class="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="movieStore.loading" class="relative">
        <swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="2"
          :space-between="16"
          :breakpoints="{
            640: { slidesPerView: 3.2, spaceBetween: 20 },
            768: { slidesPerView: 4.2, spaceBetween: 24 },
            1024: { slidesPerView: 5.2, spaceBetween: 28 },
            1280: { slidesPerView: 6.2, spaceBetween: 32 }
          }"
          class="pb-12 !overflow-visible"
        >
          <swiper-slide v-for="n in 6" :key="n" class="h-auto">
            <SkeletonCard class="h-full" />
          </swiper-slide>
        </swiper>
      </div>

      <!-- Movies Swiper -->
      <div v-else-if="movies.length > 0" class="relative group/swiper">
        <swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="2"
          :space-between="16"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }"
          :loop="true"
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
            640: { slidesPerView: 3.2, spaceBetween: 20 },
            768: { slidesPerView: 4.2, spaceBetween: 24 },
            1024: { slidesPerView: 5.2, spaceBetween: 28 },
            1280: { slidesPerView: 6.2, spaceBetween: 32 }
          }"
          class="pb-12 !overflow-visible"
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

        <!-- Custom Navigation Buttons -->
        <button class="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-secondary backdrop-blur-md rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 -ml-6 opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:ml-0 text-white hover:text-black border border-white/10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <button class="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-secondary backdrop-blur-md rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 -mr-6 opacity-0 group-hover/swiper:opacity-100 group-hover/swiper:mr-0 text-white hover:text-black border border-white/10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Custom Pagination -->
        <div class="swiper-pagination-custom flex justify-center mt-8"></div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-text-secondary mb-2">Đang tải phim mới...</h3>
        <p class="text-text-muted">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { onMounted, computed } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import { useRouter } from 'vue-router'
import MovieCard from './MovieCard.vue'
import SkeletonCard from './SkeletonCard.vue'

const movieStore = useMovieStore()
const router = useRouter()

const movies = computed(() => {
  const items = movieStore.movies?.data?.items
  return Array.isArray(items) ? items.slice(0, 24) : []
})

onMounted(() => {
  movieStore.getNewMovies()
})

const goToMovieDetails = (movie) => {
  if (movie.slug) {
    router.push(`/movie/${movie.slug}`)
  }
}
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* Custom Pagination Dots */
:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: #F59E0B;
  width: 24px;
  border-radius: 4px;
}
</style>