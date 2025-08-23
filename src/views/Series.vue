<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <NavBar />
    
    <!-- Header Section -->
    <div class="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Phim Bộ
          </h1>
          <p class="text-gray-400 text-lg">Khám phá bộ sưu tập phim bộ hấp dẫn</p>
        </div>

        <!-- Loading State -->
        <div v-if="movieStore.loading" class="flex justify-center items-center py-20">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div class="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>

        <!-- Movies Grid -->
        <div v-else-if="movies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <div 
          @click="goToMovieDetails(movie)"
            v-for="movie in movies" 
            :key="movie._id"
            class="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-700/50"
          >
            <!-- Movie Poster -->
            <div class="relative aspect-[2/3] overflow-hidden">
              <img 
                :src="getImageUrl(movie.thumb_url)" 
                :alt="movie.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              <!-- Overlay Gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Play Button Overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              <!-- Quality Badge -->
              <div class="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                HD
              </div>
            </div>

            <!-- Movie Info -->
            <div class="p-3">
              <h3 class="text-white text-sm font-semibold line-clamp-2 leading-tight group-hover:text-red-400 transition-colors duration-300">
                {{ movie.name }}
              </h3>
              <p class="text-gray-400 text-xs mt-1">{{ movie.year || '2024' }}</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v11a2 2 0 002 2h14a2 2 0 002-2V8H3z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-300 mb-2">Chưa có phim nào</h3>
          <p class="text-gray-500">Danh sách phim đang được cập nhật...</p>
        </div>

        <!-- Pagination -->
        <div v-if="params && params.totalPages > 1" class="flex justify-center mt-12">
          <div class="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50">
            <!-- Previous Button -->
            <button 
              @click="changePage(params.currentPage - 1)"
              :disabled="params.currentPage === 1"
              class="px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Page Numbers -->
            <div class="flex space-x-1">
              <template v-for="n in getVisiblePages()" :key="n">
                <button
                  v-if="n !== '...'"
                  @click="changePage(n)"
                  class="min-w-[40px] h-10 rounded-lg transition-all duration-200 text-sm font-medium"
                  :class="n === params.currentPage 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
                >
                  {{ n }}
                </button>
                <span v-else class="flex items-center px-2 text-gray-500">...</span>
              </template>
            </div>

            <!-- Next Button -->
            <button 
              @click="changePage(params.currentPage + 1)"
              :disabled="params.currentPage === params.totalPages"
              class="px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Page Info -->
        <div v-if="params" class="text-center mt-4 text-gray-400 text-sm">
          Trang {{ params.currentPage }} / {{ params.totalPages }} 
          <span class="mx-2">•</span>
          {{ movies.length }} phim
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, computed, onMounted } from "vue"
import { useMovieStore } from "../stores/movieStore"
import { useRouter } from 'vue-router'
const router = useRouter()
const movieStore = useMovieStore()

const category = 'phim-bo'
const page = ref(1)
const limit = 24
const key = computed(() => `${category}-page-${page.value}`)

onMounted(() => {
  movieStore.getMovies(category, page.value, limit)
})

const movies = computed(() => movieStore.moviesByCategory[key.value]?.items || [])
const params = computed(() => movieStore.moviesByCategory[key.value]?.params || null)

// Pagination logic - show smart page numbers
function getVisiblePages() {
  if (!params.value) return []
  
  const current = params.value.currentPage
  const total = params.value.totalPages
  const pages = []

  if (total <= 7) {
    // Show all pages if total is small
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Smart pagination for large page counts
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
}

// Change page function
function changePage(newPage) {
  if (!params.value || newPage === '...') return
  if (newPage < 1 || newPage > params.value.totalPages) return
  
  page.value = newPage
  movieStore.getMovies(category, page.value, limit)
  
  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Handle image URL
function getImageUrl(url) {
  const cdn = "https://img.ophim.live"
  if (!url) return "/placeholder-movie.jpg" // fallback image
  return url.startsWith("http") 
    ? url 
    : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

function goToMovieDetails(movie) {
  console.log('Navigating to movie details for slug:', movie.slug);
  router.push({ path: `/movie/${movie.slug}` });
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animation-delay-150 {
  animation-delay: 150ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #ef4444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}
</style>