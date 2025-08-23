<template>
  <div class="fui-search-input-effect text-black">
    <input type="checkbox" id="check" v-model="checked" />
    <div class="search-box">
      <input 
        type="text" 
        placeholder="Tìm kiếm phim..." 
        v-model="searchQuery"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @focus="checked = true"
        ref="searchInput"
      />
      <label for="check" class="icon" @click="handleIconClick">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z"
            fill="currentColor"
          />
        </svg>
      </label>
    </div>

    <!-- Search Results Dropdown -->
    <div v-if="showResults && (searchResults.length > 0 || loading || searchQuery.trim())" class="search-results">
      <!-- Loading -->
      <div v-if="loading" class="search-loading">
        <div class="spinner"></div>
        <span>Đang tìm kiếm...</span>
      </div>

      <!-- Results -->
      <div v-else-if="searchResults.length > 0" class="results-list">
        <div 
          v-for="movie in searchResults" 
          :key="movie._id"
          class="result-item"
          @click="goToMovie(movie.slug)"
        >
          <div class="result-poster">
            <img 
              :src="movie.poster_url || movie.thumb_url" 
              :alt="movie.name"
              @error="handleImageError"
            />
          </div>
          <div class="result-info">
            <h4 class="result-title">{{ movie.name }}</h4>
            <p class="result-year">{{ movie.year }} • {{ movie.quality }}</p>
            <p class="result-category">{{ movie.category?.join(', ') }}</p>
          </div>
        </div>
        
        <!-- View all results -->
        <div v-if="totalResults > searchResults.length" class="view-all-btn" @click="viewAllResults">
          <span>Xem tất cả {{ totalResults }} kết quả</span>
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="searchQuery.trim() && !loading" class="no-results">
        <i class="fas fa-search"></i>
        <p>Không tìm thấy phim nào với từ khóa "{{ searchQuery }}"</p>
        <small>Thử tìm kiếm với từ khóa khác</small>
      </div>
    </div>

    <!-- Overlay -->
    <div 
      v-if="showResults" 
      class="search-overlay"
      @click="closeResults"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'

const router = useRouter()
const movieStore = useMovieStore()

// Reactive data
const checked = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const loading = ref(false)
const totalResults = ref(0)
const searchInput = ref(null)

// Debounce timer
let debounceTimer = null

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    showResults.value = true
    debounceSearch(newQuery)
  } else {
    showResults.value = false
    searchResults.value = []
  }
})

// Watch checked state
watch(checked, (isChecked) => {
  if (isChecked && searchInput.value) {
    setTimeout(() => {
      searchInput.value.focus()
    }, 300)
  } else if (!isChecked) {
    showResults.value = false
    searchQuery.value = ''
    searchResults.value = []
  }
})

// Methods
const debounceSearch = (query) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    performSearch(query)
  }, 300)
}

const performSearch = async (query) => {
  if (!query.trim()) return

  loading.value = true
  
  try {
    const result = await movieStore.searchMovies(query.trim())
    if (result) {
      searchResults.value = result.items?.slice(0, 8) || [] // Hiển thị tối đa 8 kết quả
      totalResults.value = result.items?.length || 0
    }
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const handleInput = (event) => {
  searchQuery.value = event.target.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    goToSearchPage()
  }
}

const handleIconClick = () => {
  if (checked.value && searchQuery.value.trim()) {
    goToSearchPage()
  }
}

const goToMovie = (slug) => {
  closeResults()
  router.push(`/movie/${slug}`)
}



const goToSearchPage = () => {
  closeResults()
  router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.value.trim())}`)
}

const viewAllResults = () => {
  goToSearchPage()
}

const closeResults = () => {
  showResults.value = false
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-movie.jpg'
}

// Click outside handler
const handleClickOutside = (event) => {
  const searchBox = event.target.closest('.fui-search-input-effect')
  if (!searchBox) {
    checked.value = false
    showResults.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<style scoped>
.fui-search-input-effect {
  max-width: 400px;
  width: 100%;
  position: relative;
  z-index: 1000;
}

.fui-search-input-effect .search-box {
  position: relative;
  height: 50px;
  max-width: 50px;
  margin: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  transition: all 0.3s ease;
}

.fui-search-input-effect input[type='checkbox']:checked ~ .search-box {
  max-width: 380px;
}

.fui-search-input-effect .search-box input {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 25px;
  background: #fff;
  outline: none;
  border: none;
  padding-left: 20px;
  padding-right: 60px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.fui-search-input-effect .search-box input:focus {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
}

.fui-search-input-effect .search-box .icon {
  position: absolute;
  right: -2px;
  top: 0;
  width: 50px;
  background: #fff;
  height: 100%;
  text-align: center;
  line-height: 50px;
  color: #e74c3c;
  font-size: 20px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fui-search-input-effect input[type='checkbox']:checked ~ .search-box .icon {
  background: #e74c3c;
  color: #fff;
  width: 60px;
  border-radius: 0 25px 25px 0;
}

.fui-search-input-effect input[type='checkbox'] {
  display: none;
}

/* Search Results */
.search-results {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1001;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.results-list {
  padding: 10px 0;
}

.result-item {
  display: flex;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-item:last-child {
  border-bottom: none;
}

.result-poster {
  width: 50px;
  height: 70px;
  margin-right: 12px;
  flex-shrink: 0;
}

.result-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.result-info {
  flex: 1;
  overflow: hidden;
}

.result-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-year {
  font-size: 12px;
  color: #666;
  margin: 0 0 2px 0;
}

.result-category {
  font-size: 11px;
  color: #999;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 15px;
  background: #f8f9fa;
  color: #e74c3c;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.view-all-btn:hover {
  background: #e9ecef;
}

.no-results {
  padding: 30px 20px;
  text-align: center;
  color: #666;
}

.no-results i {
  font-size: 2rem;
  color: #ddd;
  margin-bottom: 10px;
}

.no-results p {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.no-results small {
  color: #999;
  font-size: 12px;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
}

/* Responsive */
@media (max-width: 480px) {
  .fui-search-input-effect {
    max-width: 100%;
  }
  
  .fui-search-input-effect input[type='checkbox']:checked ~ .search-box {
    max-width: calc(100vw - 40px);
  }

  .search-results {
    left: -10px;
    right: -10px;
  }

  .result-item {
    padding: 8px 12px;
  }

  .result-poster {
    width: 40px;
    height: 56px;
    margin-right: 10px;
  }

  .result-title {
    font-size: 13px;
  }

  .result-year {
    font-size: 11px;
  }
}
</style>