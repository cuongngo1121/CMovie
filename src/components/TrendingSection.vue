<template>
  <div class="relative w-full py-12 overflow-hidden transition-all duration-700">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <div 
        v-if="featuredMovie"
        class="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 blur-sm opacity-40"
        :style="{ backgroundImage: `url(${getImageUrl(featuredMovie.poster_url || featuredMovie.thumb_url)})` }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-dark/90 via-primary-dark/80 to-primary-dark z-10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/60 to-transparent z-10"></div>
    </div>

    <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">
          <div class="w-1.5 h-10 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-2 text-shadow">
              Xu Hướng Hôm Nay
            </h2>
            <p class="text-gray-300 text-lg">Top phim được xem nhiều nhất</p>
          </div>
        </div>
        <router-link 
          to="/movies" 
          class="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all duration-300 group backdrop-blur-md"
        >
          <span class="text-yellow-500 font-medium group-hover:text-yellow-400">Xem tất cả</span>
          <svg class="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </router-link>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <!-- Featured Skeleton -->
        <div class="lg:col-span-2 aspect-video bg-gray-800/50 rounded-3xl"></div>
        <!-- List Skeleton -->
        <div class="flex flex-col gap-4">
          <div v-for="n in 4" :key="n" class="flex gap-4 p-3 rounded-xl bg-gray-800/30 border border-white/5">
            <div class="w-24 aspect-[2/3] bg-gray-700 rounded-lg"></div>
            <div class="flex-1 py-2 space-y-2">
              <div class="h-4 bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Featured Item (Large) -->
        <div 
          v-if="featuredMovie"
          class="lg:col-span-2 relative group cursor-pointer rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          @click="goToMovie(featuredMovie.slug)"
        >
          <div class="aspect-video w-full h-full relative">
            <img 
              :src="getImageUrl(featuredMovie.poster_url || featuredMovie.thumb_url)" 
              :alt="featuredMovie.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
            
            <div class="absolute bottom-0 left-0 p-8 w-full">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-md uppercase tracking-wider shadow-lg">
                  #1 Trending
                </span>
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-md border border-white/10">
                  {{ featuredMovie.quality || 'HD' }}
                </span>
                <span class="px-3 py-1 bg-black/40 backdrop-blur-md text-gray-200 text-xs font-bold rounded-md border border-white/10">
                  {{ featuredMovie.year }}
                </span>
              </div>
              
              <h3 class="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight group-hover:text-yellow-400 transition-colors text-shadow-lg">
                {{ featuredMovie.name }}
              </h3>
              <p class="text-gray-200 line-clamp-2 mb-6 text-lg max-w-2xl drop-shadow-md">
                {{ stripHtml(featuredMovie.content) }}
              </p>
              
              <div class="flex items-center gap-4">
                <button class="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl flex items-center gap-2 transition-all transform hover:translate-y-[-2px] shadow-lg shadow-yellow-500/20">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Xem Ngay
                </button>
                <button class="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl transition-all border border-white/10">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Top List (Vertical) -->
        <div class="flex flex-col gap-4">
          <div 
            v-for="(movie, index) in topList" 
            :key="movie._id"
            class="flex gap-4 p-3 rounded-xl bg-black/20 hover:bg-white/10 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
            @click="goToMovie(movie.slug)"
          >
            <div class="relative w-24 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
              <img 
                :src="getImageUrl(movie.thumb_url)" 
                :alt="movie.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute top-1 left-1 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-md flex items-center justify-center text-white font-bold text-xs border border-white/10">
                {{ index + 2 }}
              </div>
            </div>
            
            <div class="flex flex-col justify-center flex-1 min-w-0">
              <h4 class="text-white font-bold text-lg mb-1 truncate group-hover:text-yellow-400 transition-colors">
                {{ movie.name }}
              </h4>
              <p class="text-gray-400 text-sm mb-2 truncate">{{ movie.origin_name }}</p>
              <div class="flex items-center gap-3 text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ (Math.random() * 2 + 7).toFixed(1) }}
                </span>
                <span>•</span>
                <span>{{ movie.year }}</span>
                <span class="px-1.5 py-0.5 bg-white/10 rounded text-[10px] border border-white/10">{{ movie.quality || 'HD' }}</span>
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
</style>
