<template>
  <div class="search-wrapper" ref="wrapperRef">
    <!-- Search container — always rendered, width animates -->
    <div
      :class="['search-container', { 'is-open': isSearchOpen }]"
      @click="!isSearchOpen && openSearch()"
    >
      <!-- Search icon (always visible) -->
      <button
        class="search-icon-btn"
        @click.stop="isSearchOpen ? goToSearchPage() : openSearch()"
        aria-label="Search"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>

      <!-- Input (visible when open) -->
      <input
        v-show="isSearchOpen"
        ref="searchInput"
        v-model="searchQuery"
        @input="handleInput"
        @keydown.enter="goToSearchPage"
        @keydown.escape="closeSearch"
        type="text"
        :placeholder="placeholder"
        class="search-input-field"
      />

      <!-- Close button -->
      <button
        v-show="isSearchOpen && searchQuery"
        @click.stop="clearQuery"
        class="close-btn"
        aria-label="Clear"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Dropdown Results -->
    <transition name="dropdown-fade">
      <div
        v-if="isSearchOpen && showDropdown"
        class="results-dropdown"
        @mousedown.prevent
      >
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <span class="loading-text">Đang tìm kiếm...</span>
        </div>

        <div v-else-if="searchResults.length > 0" class="results-list">
          <div
            v-for="movie in searchResults"
            :key="movie._id || movie.slug"
            @click="goToMovie(movie.slug)"
            class="result-item"
          >
            <img
              :src="getImageUrl(movie.thumb_url || movie.poster_url)"
              :alt="movie.name"
              class="result-poster"
              @error="handleImageError"
            />
            <div class="result-details">
              <h4 class="result-title">{{ movie.name }}</h4>
              <div class="result-meta">
                <span v-if="movie.year" class="meta-tag">{{ movie.year }}</span>
                <span v-if="movie.quality" class="meta-tag">{{ movie.quality }}</span>
              </div>
            </div>
          </div>

          <button @click="goToSearchPage" class="view-all-button">
            <span>Xem tất cả kết quả</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div v-else-if="noResults" class="no-results-state">
          <svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="no-results-title">Không tìm thấy kết quả</p>
          <small class="no-results-hint">Thử từ khóa khác</small>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isSearchOpen && showDropdown"
        @click="closeSearch"
        class="backdrop-overlay"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'

const router = useRouter()
const movieStore = useMovieStore()

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Tìm kiếm phim...'
  }
})

const wrapperRef = ref(null)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(false)
const showDropdown = ref(false)
const searchInput = ref(null)
let searchTimeout = null

const noResults = computed(() => {
  return searchQuery.value.trim().length > 0 && !loading.value && searchResults.value.length === 0
})

async function openSearch() {
  isSearchOpen.value = true
  await nextTick()
  searchInput.value?.focus()
}

function closeSearch() {
  isSearchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false
}

function clearQuery() {
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false
  searchInput.value?.focus()
}

// Close on click outside
function handleClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target) && isSearchOpen.value && !showDropdown.value) {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(searchTimeout)
})

async function handleInput() {
  clearTimeout(searchTimeout)
  const query = searchQuery.value.trim()
  
  if (query.length < 2) {
    searchResults.value = []
    showDropdown.value = false
    return
  }

  showDropdown.value = true
  loading.value = true

  searchTimeout = setTimeout(async () => {
    try {
      const result = await movieStore.searchMovies(query)
      if (result && result.items) {
        searchResults.value = result.items.slice(0, 5)
      }
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

function goToSearchPage() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/tim-kiem', query: { q: searchQuery.value.trim() } })
    closeSearch()
  }
}

function goToMovie(slug) {
  router.push(`/movie/${slug}`)
  closeSearch()
}

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live'
  if (!url) return '/placeholder.jpg'
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

function handleImageError(e) {
  e.target.src = '/placeholder.jpg'
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  z-index: 100;
}

/* Container that smoothly animates width */
.search-container {
  display: flex;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1A1F26;
  border: 1px solid transparent;
  overflow: hidden;
  transition: width 0.3s ease, border-color 0.3s ease, background-color 0.2s ease;
  cursor: pointer;
}

.search-container:hover {
  background-color: rgba(245, 158, 11, 0.15);
}

.search-container.is-open {
  width: 300px;
  border-color: #374151;
  cursor: default;
  background-color: #1A1F26;
}

.search-container.is-open:hover {
  background-color: #1A1F26;
}

.search-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  width: 40px;
  height: 38px;
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  transition: color 0.2s ease;
}

.search-icon-btn:hover {
  color: #F59E0B;
}

.search-input-field {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #F9FAFB;
  font-size: 14px;
  padding-right: 8px;
}

.search-input-field::placeholder {
  color: #6B7280;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #252D36;
  color: #F9FAFB;
}

/* Dropdown */
.results-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
  background-color: #1A1F26;
  border: 1px solid #374151;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  z-index: 102;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #F59E0B;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #9CA3AF;
  font-size: 14px;
}

.results-list {
  padding: 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #374151;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.result-item:hover {
  background-color: #252D36;
}

.result-item:last-child {
  border-bottom: none;
}

.result-poster {
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.result-details {
  flex: 1;
  min-width: 0;
}

.result-title {
  color: #F9FAFB;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-meta {
  display: flex;
  gap: 8px;
}

.meta-tag {
  font-size: 12px;
  padding: 2px 8px;
  background-color: #252D36;
  color: #9CA3AF;
  border-radius: 4px;
}

.view-all-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.view-all-button:hover {
  background-color: #F59E0B;
  color: #0F1419;
}

.no-results-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.no-results-icon {
  width: 48px;
  height: 48px;
  color: #9CA3AF;
  margin-bottom: 12px;
}

.no-results-title {
  color: #E5E7EB;
  font-size: 16px;
  margin: 0 0 4px 0;
}

.no-results-hint {
  color: #9CA3AF;
  font-size: 13px;
}

/* Backdrop — no blur for performance */
.backdrop-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
.results-dropdown::-webkit-scrollbar {
  width: 6px;
}
.results-dropdown::-webkit-scrollbar-track {
  background: transparent;
}
.results-dropdown::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}
.results-dropdown::-webkit-scrollbar-thumb:hover {
  background: #F59E0B;
}

/* Mobile */
@media (max-width: 768px) {
  .search-container.is-open {
    width: 100%;
  }

  .results-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    width: 100%;
    max-height: 60vh;
  }

  .result-poster {
    width: 40px;
    height: 56px;
  }

  .result-title {
    font-size: 13px;
  }

  .meta-tag {
    font-size: 11px;
    padding: 2px 6px;
  }
}
</style>