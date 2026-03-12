<template>
  <div class="min-h-screen bg-primary-dark">
    <NavBar />
    
    <!-- Header Section -->
    <div class="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Search Header -->
        <div class="mb-6">
          <h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
            Kết quả tìm kiếm
          </h1>
          
          <!-- Search Input for Mobile/Desktop -->
          <div class="mb-6 max-w-2xl">
            <SearchBox 
              :initial-query="searchQuery" 
              placeholder="Nhập tên phim cần tìm..." 
              class="w-full"
            />
          </div>

          <p v-if="!loading && movies.length > 0 && searchQuery" class="text-text-muted">
            Tìm thấy {{ movies.length }} kết quả cho "<span class="text-secondary">{{ searchQuery }}</span>"
          </p>
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

        <!-- Search Results Grid -->
        <div v-else-if="filteredMovies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          <MovieCard 
            v-for="movie in filteredMovies" 
            :key="movie._id || movie.slug"
            :movie="movie"
            @click="goToMovieDetails(movie)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20 animate-fade-in-up">
          <div class="w-24 h-24 mx-auto mb-4 bg-bg-elevated rounded-full flex items-center justify-center border border-white/5 shadow-lg">
            <span class="text-5xl">🕵️‍♂️</span>
          </div>
          <h3 class="text-xl md:text-2xl font-bold text-primary mb-2">Tìm hoài không thấy!</h3>
          <p class="text-text-muted mb-6">Chắc đạo diễn chưa kịp quay phim "<span class="text-secondary font-bold">{{ searchQuery }}</span>" rồi. Thử đổi từ khóa khác xem sao bạn ei 🎬</p>
          <button 
            @click="$router.push('/')"
            class="px-6 py-3 bg-gradient-to-r from-secondary to-yellow-600 hover:from-yellow-400 hover:to-secondary text-primary-dark rounded-xl font-bold shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all hover:-translate-y-1 active:scale-95"
          >
            Quay đầu là bờ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import NavBar from '../components/NavBar.vue'
import MovieCard from '../components/MovieCard.vue'
import SearchBox from '../components/SearchBox.vue'
import MovieFilters from '../components/MovieFilters.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const searchQuery = ref('')
const loading = ref(false)

const filters = ref({
  year: '',
  country: '',
  genre: '',
  sort: 'latest'
})

const movies = computed(() => {
  const results = movieStore.searchResults
  return Array.isArray(results) ? results : []
})

const filteredMovies = computed(() => {
  let result = [...movies.value]
  
  if (filters.value.year) {
    result = result.filter(m => m.year === filters.value.year || m.year === parseInt(filters.value.year))
  }
  
  if (filters.value.country) {
    result = result.filter(m => {
      const countries = Array.isArray(m.country) ? m.country : []
      return countries.some(c => {
        const countrySlug = typeof c === 'string' ? c : c.slug
        return countrySlug === filters.value.country
      })
    })
  }
  
  if (filters.value.genre) {
    result = result.filter(m => {
      const categories = Array.isArray(m.category) ? m.category : []
      return categories.some(cat => {
        const catSlug = typeof cat === 'string' ? cat : cat.slug
        return catSlug === filters.value.genre
      })
    })
  }
  
  if (filters.value.sort === 'year') {
    result.sort((a, b) => (b.year || 0) - (a.year || 0))
  } else if (filters.value.sort === 'name') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }
  
  return result
})

function applyFilters() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for query param changes
watch(() => route.query.q, async (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery
    await performSearch(newQuery)
  }
}, { immediate: true })

async function performSearch(query) {
  if (!query) return
  
  loading.value = true
  try {
    await movieStore.searchMovies(query)
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

function goToMovieDetails(movie) {
  router.push(`/movie/${movie.slug}`)
}
</script>

<style scoped>
</style>
