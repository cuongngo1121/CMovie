<template>
  <div class="md:hidden relative w-full overflow-hidden bg-black">
    <!-- Auto-scrolling hero -->
    <swiper
      :modules="[Autoplay, Pagination, EffectCreative]"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :speed="800"
      :effect="'creative'"
      :creative-effect="{
        prev: { shadow: true, translate: ['-20%', 0, -1] },
        next: { translate: ['100%', 0, 0] }
      }"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true, el: '.mobile-hero-pagination', dynamicBullets: true }"
      class="w-full aspect-[9/14] max-h-[55vh]"
      @slideChange="onSlideChange"
    >
      <swiper-slide
        v-for="(movie, index) in movies"
        :key="movie._id || index"
        class="relative w-full h-full"
      >
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img
            :src="getImageUrl(movie.poster_url || movie.thumb_url)"
            :alt="movie.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <!-- Cinematic Gradients -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-24"></div>
        </div>

        <!-- Content Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-4 pb-12 z-10">
          <!-- Badges -->
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-lg">
              {{ movie.quality || 'HD' }}
            </span>
            <span class="px-2.5 py-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold rounded-md border border-white/20">
              {{ movie.year }}
            </span>
            <span v-if="movie.lang" class="px-2.5 py-1 bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-medium rounded-md">
              {{ movie.lang }}
            </span>
          </div>

          <!-- Title -->
          <h2 class="text-xl font-black text-white leading-tight mb-0.5 line-clamp-2 drop-shadow-2xl">
            {{ movie.name }}
          </h2>
          <p class="text-white/50 text-xs font-medium mb-3 line-clamp-1">
            {{ movie.origin_name }}
          </p>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="goToWatch(movie)"
              class="flex-1 flex items-center justify-center gap-2 h-10 bg-red-600 text-white rounded-lg font-bold text-xs shadow-xl shadow-red-600/30 active:scale-95 transition-all"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Xem Ngay
            </button>
            <button
              @click="goToDetail(movie)"
              class="w-10 h-10 flex items-center justify-center bg-white/15 backdrop-blur-md rounded-lg border border-white/20 active:scale-95 transition-all"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Custom Pagination -->
    <div class="mobile-hero-pagination absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, EffectCreative } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-creative'

const movieStore = useMovieStore()
const router = useRouter()

onMounted(() => {
  if (!movieStore.movies?.data?.items?.length) {
    movieStore.getNewMovies()
  }
})

const movies = computed(() => {
  const items = movieStore.movies?.data?.items
  return Array.isArray(items) ? items.slice(0, 6) : []
})

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live'
  if (!url) return ''
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

function goToWatch(movie) {
  router.push({ path: `/watch/${movie.slug}` })
}

function goToDetail(movie) {
  router.push({ path: `/movie/${movie.slug}` })
}

function onSlideChange() {
  // Haptic-style feedback placeholder
}
</script>

<style scoped>
:deep(.mobile-hero-pagination .swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  background: white;
  opacity: 0.35;
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.mobile-hero-pagination .swiper-pagination-bullet-active) {
  opacity: 1;
  background: #dc2626;
  width: 20px;
  border-radius: 4px;
}
</style>
