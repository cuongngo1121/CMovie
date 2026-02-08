<template>
  <div class="relative w-full py-8 md:py-12 overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <div 
        v-if="featuredMovie"
        class="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 blur-sm opacity-30 md:opacity-40"
        :style="{ backgroundImage: `url(${getImageUrl(featuredMovie.poster_url || featuredMovie.thumb_url)})` }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-dark/95 via-primary-dark/85 to-primary-dark z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/60 to-transparent z-10"></div>
    </div>

    <div class="relative z-20 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 md:mb-8">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-1 md:w-1.5 h-8 md:h-10 bg-brand rounded-full"></div>
          <div>
            <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Xu Hướng Hôm Nay
            </h2>
            <p class="text-gray-300 text-sm md:text-base lg:text-lg hidden sm:block">Top phim được xem nhiều nhất</p>
          </div>
        </div>
        <router-link 
          to="/movies" 
          class="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 hover:bg-gray-100 border border-theme rounded-full transition-all duration-300 group text-sm md:text-base text-brand font-medium"
        >
          <span class="hidden sm:inline">Xem tất cả</span>
          <svg class="w-4 h-4 md:w-5 md:h-5 text-brand group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 animate-pulse">
        <div class="lg:col-span-2 aspect-video bg-gray-800/50 rounded-2xl md:rounded-3xl"></div>
        <div class="flex flex-col gap-3 md:gap-4">
          <div v-for="n in 4" :key="n" class="flex gap-3 md:gap-4 p-2 md:p-3 rounded-xl bg-gray-800/30 border border-white/5">
            <div class="w-16 md:w-24 aspect-[2/3] bg-gray-700 rounded-lg"></div>
            <div class="flex-1 py-2 space-y-2">
              <div class="h-3 md:h-4 bg-gray-700 rounded w-3/4"></div>
              <div class="h-2 md:h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <!-- Featured Item (Large) -->
        <div 
          v-if="featuredMovie"
          class="lg:col-span-2 relative group cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          @click="goToMovie(featuredMovie.slug)"
        >
          <div class="aspect-video w-full h-full relative">
            <img 
              :src="getImageUrl(featuredMovie.poster_url || featuredMovie.thumb_url)" 
              :alt="featuredMovie.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
            
            <div class="absolute bottom-0 left-0 p-4 md:p-8 w-full">
              <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
                <span class="px-2 md:px-3 py-1 bg-brand text-white text-[10px] md:text-xs font-bold rounded-md uppercase tracking-wider shadow-sm">
                  #1 Trending
                </span>
                <span class="px-2 md:px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold rounded-md border border-white/10">
                  {{ featuredMovie.quality || 'HD' }}
                </span>
                <span class="px-2 md:px-3 py-1 bg-black/40 backdrop-blur-md text-gray-200 text-[10px] md:text-xs font-bold rounded-md border border-white/10">
                  {{ featuredMovie.year }}
                </span>
              </div>
              
              <h3 class="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 leading-tight group-hover:text-brand-light transition-colors shadow-none">
                {{ featuredMovie.name }}
              </h3>
              <p class="text-gray-200 text-xs sm:text-sm md:text-lg line-clamp-1 md:line-clamp-2 mb-3 md:mb-6 max-w-2xl text-shadow-sm">
                {{ stripHtml(featuredMovie.content) }}
              </p>
              
              <div class="flex items-center gap-2 md:gap-4">
                <button class="px-4 md:px-8 py-2 md:py-3 bg-brand hover:bg-brand-hover text-white text-xs md:text-base font-bold rounded-lg md:rounded-xl flex items-center gap-2 transition-all transform hover:translate-y-[-2px] shadow-sm">
                  <svg class="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span class="hidden sm:inline">Xem Ngay</span>
                  <span class="sm:hidden">Xem</span>
                </button>
                <button class="px-3 md:px-6 py-2 md:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs md:text-base font-semibold rounded-lg md:rounded-xl transition-all border border-white/20 hidden sm:block">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Top List (Vertical) -->
        <div class="flex flex-col gap-2 md:gap-4">
          <div 
            v-for="(movie, index) in topList" 
            :key="movie._id"
            class="flex gap-2 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-xl bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all cursor-pointer group active:scale-[0.98]"
            @click="goToMovie(movie.slug)"
          >
            <div class="relative w-16 sm:w-20 md:w-24 aspect-[2/3] flex-shrink-0 rounded-md md:rounded-lg overflow-hidden shadow-lg">
              <img 
                :src="getImageUrl(movie.thumb_url)" 
                :alt="movie.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-0.5 md:top-1 left-0.5 md:left-1 w-5 h-5 md:w-6 md:h-6 bg-black/60 backdrop-blur-sm rounded-md flex items-center justify-center text-white font-bold text-[10px] md:text-xs border border-white/10">
                {{ index + 2 }}
              </div>
            </div>
            
            <div class="flex flex-col justify-center flex-1 min-w-0">
              <h4 class="text-white font-bold text-sm md:text-lg mb-0.5 md:mb-1 truncate group-hover:text-yellow-400 transition-colors">
                {{ movie.name }}
              </h4>
              <p class="text-gray-400 text-xs md:text-sm mb-1 md:mb-2 truncate">{{ movie.origin_name }}</p>
              <div class="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ (Math.random() * 2 + 7).toFixed(1) }}
                </span>
                <span class="hidden sm:inline">•</span>
                <span class="hidden sm:inline">{{ movie.year }}</span>
                <span class="px-1 md:px-1.5 py-0.5 bg-white/10 rounded text-[9px] md:text-[10px] border border-white/10">{{ movie.quality || 'HD' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import { useRouter } from 'vue-router'

const movieStore = useMovieStore()
const router = useRouter()
const loading = ref(true)

const movies = computed(() => {
  const items = movieStore.movies?.data?.items || []
  return items
})

const featuredMovie = computed(() => movies.value[0])
const topList = computed(() => movies.value.slice(1, 5))

onMounted(async () => {
  try {
    if (!movieStore.movies?.data?.items?.length) {
      await movieStore.getNewMovies()
    }
  } finally {
    loading.value = false
  }
})

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live'
  if (!url) return '/placeholder-movie.jpg'
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function goToMovie(slug) {
  router.push(`/movie/${slug}`)
}
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0,0,0,0.7);
}

/* Smooth mobile interactions */
@media (max-width: 1024px) {
  .group {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
