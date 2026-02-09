<template>
  <div class="min-h-screen bg-primary-dark">
    <NavBar />
    
    <!-- Header Section -->
    <div class="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-5xl font-bold text-primary mb-4">
            Lọc Phim
          </h1>
          <p class="text-text-muted text-lg">Tìm kiếm phim theo sở thích của bạn</p>
        </div>

        <!-- Filters -->
        <MovieFilters 
          v-model="filters"
          @filter-change="applyFilters"
        />

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- Movies Grid -->
        <div v-else-if="filteredMovies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <MovieCard 
            v-for="movie in paginatedMovies" 
            :key="movie._id || movie.slug"
            :movie="movie"
            @click="goToMovieDetails(movie)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 bg-bg-elevated rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v11a2 2 0 002 2h14a2 2 0 002-2V8H3z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-text-secondary mb-2">Không tìm thấy phim</h3>
          <p class="text-text-muted">Thử thay đổi bộ lọc để xem thêm phim</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <div class="flex items-center space-x-2 bg-bg-card rounded-xl p-2 border border-border">
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary hover:bg-bg-elevated hover:text-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <div class="flex space-x-1">
              <template v-for="n in getVisiblePages()" :key="n">
                <button
                  v-if="n !== '...'"
                  @click="changePage(n)"
                  class="min-w-[40px] h-10 rounded-lg transition-all duration-200 text-sm font-medium"
                  :class="n === currentPage 
                    ? 'bg-secondary text-primary-dark shadow-lg' 
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-primary'"
                >
                  {{ n }}
                </button>
                <span v-else class="flex items-center px-2 text-text-muted">...</span>
              </template>
            </div>

            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary hover:bg-bg-elevated hover:text-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Page Info -->
        <div v-if="filteredMovies.length > 0" class="text-center mt-4 text-text-muted text-sm">
          Trang {{ currentPage }} / {{ totalPages }}
          <span class="mx-2">•</span>
          {{ filteredMovies.length }} phim
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import NavBar from '../components/NavBar.vue'
import MovieCard from '../components/MovieCard.vue'
import MovieFilters from '../components/MovieFilters.vue'

const router = useRouter()
const movieStore = useMovieStore()

const category = 'phim-moi-cap-nhat'
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 24

const filters = reactive({
  type: '',
  year: '',
  country: '',
  genre: '',
  sort: 'latest'
})

const movies = computed(() => {
  return movieStore.moviesByCategory[category]?.allMovies || []
})

onMounted(async () => {
  loading.value = true
  try {
    // Check if we already have data
    if (!movies.value.length) {
      // Use 'danh-sach' endpoint for Phim Moi Cap Nhat
      await movieStore.getAllMoviesByCategory(category, 'danh-sach')
    }
  } catch (error) {
    console.error('Error loading movies:', error)
  } finally {
    loading.value = false
  }
})

const filteredMovies = computed(() => {
  let result = [...movies.value]
  
  if (filters.type) {
    const typeMapping = {
      'phim-le': 'single',
      'phim-bo': 'series',
      'hoat-hinh': 'hoathinh',
      'tv-shows': 'tvshows'
    }
    const mappedType = typeMapping[filters.type] || filters.type

    result = result.filter(m => {
      // Check exact type match
      if (m.type === mappedType) return true
      
      // Fallback: Check if type is in category (for some legacy data)
      const categories = Array.isArray(m.category) ? m.category : []
      return categories.some(cat => {
        const catSlug = typeof cat === 'string' ? cat : cat.slug
        return catSlug === filters.type
      })
    })
  }

  if (filters.year) {
    result = result.filter(m => m.year === filters.year || m.year === parseInt(filters.year))
  }
  
  if (filters.country) {
    result = result.filter(m => {
      const countries = Array.isArray(m.country) ? m.country : []
      return countries.some(c => {
        const countrySlug = typeof c === 'string' ? c : c.slug
        return countrySlug === filters.country
      })
    })
  }
  
  if (filters.genre) {
    result = result.filter(m => {
      const categories = Array.isArray(m.category) ? m.category : []
      return categories.some(cat => {
        const catSlug = typeof cat === 'string' ? cat : cat.slug
        return catSlug === filters.genre
      })
    })
  }
  
  if (filters.sort === 'year') {
    result.sort((a, b) => (b.year || 0) - (a.year || 0))
  } else if (filters.sort === 'name') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredMovies.value.length / itemsPerPage))

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMovies.value.slice(start, end)
})

function applyFilters() {
  currentPage.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getVisiblePages() {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) pages.push(i)
    }
    
    if (current < total - 3) pages.push('...')
    if (total > 1) pages.push(total)
  }
  
  return pages
}

function changePage(newPage) {
  if (newPage === '...' || newPage < 1 || newPage > totalPages.value) return
  currentPage.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToMovieDetails(movie) {
  router.push({ path: `/movie/${movie.slug}` })
}
</script>