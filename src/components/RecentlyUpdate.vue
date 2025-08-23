<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 py-8 text-white relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
    
    <!-- Section Header -->
    <div class="relative z-10 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Phim Mới Cập Nhật
          </h2>
          <p class="text-gray-400 text-lg">Những bộ phim hot nhất được cập nhật gần đây</p>
        </div>
        
        <!-- View All Button -->
        <button class="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-full hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <span class="font-medium">Xem tất cả</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      
      <!-- Decorative Line -->
      <div class="mt-6 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full w-24"></div>
    </div>

    <!-- Loading State -->
    <div v-if="movieStore.loading" class="flex justify-center items-center py-20">
      <div class="flex space-x-2">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>

    <!-- Movies Swiper -->
    <div v-else-if="movies.length > 0" class="relative">
      <swiper
        :modules="[Autoplay, Navigation, Pagination]"
        :slides-per-view="1.2"
        :space-between="20"
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
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          768: { slidesPerView: 3.2, spaceBetween: 24 },
          1024: { slidesPerView: 4.2, spaceBetween: 28 },
          1280: { slidesPerView: 5.2, spaceBetween: 32 },
          1536: { slidesPerView: 6.2, spaceBetween: 36 }
        }"
        class="pb-16 movie-swiper"
      >
        <swiper-slide
          v-for="(movie, index) in movies"
          :key="movie._id || index"
          class="group"
        >
          <div 
            class="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-700/30 hover:border-red-500/50"
            @click="goToMovieDetails(movie)"
          >
            <!-- Movie Poster Container -->
            <div class="relative aspect-[2/3] overflow-hidden">
              <img 
                :src="getImageUrl(movie.thumb_url)" 
                :alt="movie.name"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              <!-- Gradient Overlays -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-red-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Play Button -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-300 hover:from-red-400 hover:to-pink-400">
                  <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              <!-- Status Badges -->
              <div class="absolute top-3 left-3 flex space-x-2">
                <span class="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                  NEW
                </span>
                <span class="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                  HD
                </span>
              </div>

              <!-- Rating Badge -->
              <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-white text-xs font-medium">{{ (Math.random() * 2 + 8).toFixed(1) }}</span>
              </div>
            </div>

            <!-- Movie Info -->
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              <h3 class="text-white text-sm font-bold mb-1 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                {{ movie.name }}
              </h3>
              <div class="flex items-center justify-between text-xs text-gray-300">
                <span>{{ movie.year || '2024' }}</span>
                <span class="flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                  </svg>
                  <span>Xem ngay</span>
                </span>
              </div>
            </div>

            <!-- Shine Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
          </div>
        </swiper-slide>
      </swiper>

      <!-- Custom Navigation Buttons -->
      <div class="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 cursor-pointer">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </div>
      
      <div class="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 cursor-pointer">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>

      <!-- Custom Pagination -->
      <div class="swiper-pagination-custom flex justify-center mt-6"></div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-300 mb-2">Đang tải phim mới...</h3>
      <p class="text-gray-500">Vui lòng chờ trong giây lát</p>
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

const movieStore = useMovieStore()
const router = useRouter()

const movies = computed(() => {
  const items = movieStore.movies?.data?.items
  console.log('🎬 Recently Updated::', items)
  return Array.isArray(items) ? items.slice(0, 24) : []
})

onMounted(() => {
  movieStore.getNewMovies()
})

const getImageUrl = (url) => {
  const cdn = 'https://img.ophim.live'
  if (!url) return '/placeholder-movie.jpg' // fallback image
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

const goToMovieDetails = (movie) => {
  if (movie.slug) {
    router.push(`/movie/${movie.slug}`)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom Swiper Styles */
.movie-swiper {
  padding-left: 60px;
  padding-right: 60px;
  margin-left: -60px;
  margin-right: -60px;
}

@media (max-width: 768px) {
  .movie-swiper {
    padding-left: 20px;
    padding-right: 20px;
    margin-left: -20px;
    margin-right: -20px;
  }
  
  .swiper-button-prev-custom,
  .swiper-button-next-custom {
    display: none;
  }
}

/* Custom Pagination Dots */
:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: linear-gradient(45deg, #ef4444, #ec4899);
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

:deep(.swiper-pagination-bullet-active-main) {
  background: linear-gradient(45deg, #ef4444, #ec4899);
}

/* Hover Effects */
.swiper-button-prev-custom:hover,
.swiper-button-next-custom:hover {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .movie-swiper {
    overflow: visible;
  }
}

/* Animation for NEW badge */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}
</style>