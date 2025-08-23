<template>
  <div class="w-full px-6 py-8 text-white mt-12 relative overflow-hidden">
    <NavBar />
    <!-- Background gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
    
    <!-- Header section -->
    <div class="flex flex-col gap-6 mb-8 px-4 relative z-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Phim Theo Thể Loại
          </h2>
        </div>
      </div>

      <!-- Category Selection Dropdown -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-red-500/50 transition-all duration-300 min-w-[280px]"
          >
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ selectedCategory.icon }}</span>
              <span class="font-semibold">{{ selectedCategory.name }}</span>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke-width="2" 
              stroke="currentColor" 
              :class="['w-5 h-5 transition-transform duration-200', isDropdownOpen ? 'rotate-180' : '']"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-show="isDropdownOpen"
            class="absolute top-full left-0 mt-2 w-full max-w-md bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar"
          >
            <div class="p-2">
              <div 
                v-for="category in categories" 
                :key="category.slug"
                @click="selectCategory(category)"
                class="flex items-center gap-3 px-4 py-3 hover:bg-red-600/20 rounded-lg cursor-pointer transition-colors duration-200 group"
              >
                <span class="text-xl">{{ category.icon }}</span>
                <span class="font-medium group-hover:text-red-400">{{ category.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Movie count and controls -->
        <div class="flex items-center gap-4 ml-auto">
          <div class="flex items-center gap-2 text-gray-400 text-sm">
            <span>{{ movieCount }} phim</span>
            <div v-if="isLoading" class="flex items-center gap-1">
              <div class="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-xs">Đang tải...</span>
            </div>
          </div>
          
          <button 
            @click="toggleExpanded"
            class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full text-sm font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105"
          >
            <span>{{ isExpanded ? 'Thu gọn' : 'Xem thêm' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                 :class="['w-4 h-4 transition-transform duration-300', isExpanded ? 'rotate-180' : '']">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      <div v-for="n in 12" :key="n" class="loading-skeleton rounded-2xl aspect-[2/3] bg-gray-800"></div>
    </div>

    <!-- No movies message -->
    <div v-else-if="allMovies.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🎬</div>
      <h3 class="text-xl font-semibold mb-2">Chưa có phim</h3>
      <p class="text-gray-400">Không tìm thấy phim nào thuộc thể loại {{ selectedCategory.name }}</p>
    </div>

    <!-- Enhanced Movie Grid -->
    <div v-else class="relative">
      <div 
        :class="[
          'grid gap-6 transition-all duration-500 ease-in-out',
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
          isExpanded ? 'max-h-none' : 'max-h-[800px] overflow-hidden'
        ]"
      >
        <div
          v-for="(movie, index) in displayedMovies"
          :key="movie.slug || index"
          class="group cursor-pointer movie-card"
          @click="goToMovieDetails(movie)"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Movie card with enhanced design -->
          <div class="relative bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 h-full">
            
            <!-- Movie poster container -->
            <div class="relative overflow-hidden aspect-[2/3]">
              <img
                :src="getImageUrl(movie.thumb_url)"
                :alt="movie.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                :loading="index < 8 ? 'eager' : 'lazy'"
                @error="handleImageError"
              />
              
              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Play button overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div class="w-16 h-16 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/90 transition-colors duration-200 hover:scale-110 play-button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" class="w-6 h-6 ml-1">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Quality badge -->
              <div class="absolute top-3 left-3 px-2 py-1 bg-red-600/90 backdrop-blur-sm rounded-md text-xs font-bold">
                {{ movie.quality || 'HD' }}
              </div>
              
              <!-- Year badge -->
              <div class="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs font-medium">
                {{ movie.year || 'N/A' }}
              </div>

              <!-- Episode count badge for series -->
              <div v-if="movie.episode_current && movie.episode_current !== 'Full'" 
                   class="absolute bottom-3 left-3 px-2 py-1 bg-green-600/90 backdrop-blur-sm rounded-md text-xs font-bold">
                {{ movie.episode_current === 'Hoàn Tất' ? 'Full' : `Tập ${movie.episode_current}` }}
              </div>
            </div>

            <!-- Movie info section -->
            <div class="p-4 space-y-2 flex-1">
              <h3 class="text-sm font-bold text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2 leading-tight">
                {{ movie.name }}
              </h3>
              
              <p class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 line-clamp-1">
                {{ movie.origin_name }}
              </p>
              
              <!-- Rating and additional info -->
              <div class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-3 h-3 text-yellow-400">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-xs text-gray-400">{{ movie.tmdb?.vote_average || '8.0' }}</span>
                </div>
                
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{{ movie.time || '120m' }}</span>
                </div>
              </div>

              <!-- Countries -->
              <div v-if="movie.country && movie.country.length > 0" class="flex flex-wrap gap-1 pt-2">
                <span 
                  v-for="country in movie.country.slice(0, 2)" 
                  :key="country.id"
                  class="px-2 py-1 bg-gray-700/50 text-xs rounded-md text-gray-300"
                >
                  {{ country.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fade overlay when collapsed -->
      <div 
        v-if="!isExpanded && allMovies.length > initialDisplayCount"
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"
      ></div>
    </div>

    <!-- Pagination controls -->
    <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 gap-2">
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:opacity-50 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
      >
        ← Trước
      </button>

      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
            page === currentPage 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:opacity-50 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
      >
        Sau →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import { useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';

const router = useRouter();
const movieStore = useMovieStore();

// Reactive state
const isDropdownOpen = ref(false);
const isExpanded = ref(false);
const isLoading = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);
const apiPage = ref(1);
const itemsPerPage = 24;
const initialDisplayCount = 18;
const hasMorePages = ref(true);
const totalItems = ref(0);

// Categories data with icons
const categories = ref([
  { slug: 'hanh-dong', name: 'Hành Động', icon: '💥' },
  { slug: 'tinh-cam', name: 'Tình Cảm', icon: '💖' },
  { slug: 'hai-huoc', name: 'Hài Hước', icon: '😂' },
  { slug: 'co-trang', name: 'Cổ Trang', icon: '🏛️' },
  { slug: 'tam-ly', name: 'Tâm Lý', icon: '🧠' },
  { slug: 'hinh-su', name: 'Hình Sự', icon: '🔍' },
  { slug: 'chien-tranh', name: 'Chiến Tranh', icon: '⚔️' },
  { slug: 'the-thao', name: 'Thể Thao', icon: '⚽' },
  { slug: 'vo-thuat', name: 'Võ Thuật', icon: '🥊' },
  { slug: 'vien-tuong', name: 'Viễn Tưởng', icon: '🚀' },
  { slug: 'phieu-luu', name: 'Phiêu Lưu', icon: '🗺️' },
  { slug: 'khoa-hoc', name: 'Khoa Học', icon: '🧪' },
  { slug: 'kinh-di', name: 'Kinh Dị', icon: '👻' },
  { slug: 'am-nhac', name: 'Âm Nhạc', icon: '🎵' },
  { slug: 'than-thoai', name: 'Thần Thoại', icon: '⚡' },
  { slug: 'tai-lieu', name: 'Tài Liệu', icon: '📚' },
  { slug: 'gia-dinh', name: 'Gia Đình', icon: '👨‍👩‍👧‍👦' },
  { slug: 'chinh-kich', name: 'Chính Kịch', icon: '🎭' },
  { slug: 'bi-an', name: 'Bí Ẩn', icon: '🔮' },
  { slug: 'hoc-duong', name: 'Học Đường', icon: '🎓' },
  { slug: 'kinh-dien', name: 'Kinh Điển', icon: '🏆' },
  { slug: 'phim-18', name: 'Phim 18+', icon: '🔞' }
]);

const selectedCategory = ref(categories.value[0]); // Default to first category

// Load movies when component mounts
onMounted(async () => {
  await loadAllMoviesForCategory(selectedCategory.value.slug);
});

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative');
  if (!dropdown) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Computed properties
const allMovies = computed(() => {
  const categoryData = movieStore.moviesByCategory[selectedCategory.value.slug];
  if (!categoryData || !categoryData.allMovies) return [];
  return categoryData.allMovies;
});

const movieCount = computed(() => totalItems.value || allMovies.value.length);

const totalPages = computed(() => {
  return Math.ceil(allMovies.value.length / itemsPerPage);
});

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allMovies.value.slice(start, end);
});

const displayedMovies = computed(() => {
  const moviesToShow = paginatedMovies.value;
  return isExpanded.value ? moviesToShow : moviesToShow.slice(0, initialDisplayCount);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
async function loadAllMoviesForCategory(categorySlug) {
  isLoading.value = true;

  try {
    console.log(`🎬 Loading all movies for category ${categorySlug}...`);

    // Attempt to load all movies
    const allMoviesData = await movieStore.getAllMoviesByCategory(categorySlug);
    totalItems.value = allMoviesData.length;
    
    if (!movieStore.moviesByCategory[categorySlug]) {
      movieStore.moviesByCategory[categorySlug] = {};
    }
    movieStore.moviesByCategory[categorySlug].allMovies = allMoviesData;

    console.log(`✅ Successfully loaded ${allMoviesData.length} movies for ${categorySlug}`);
  } catch (error) {
    console.error('❌ Error loading all movies:', error);

    // Fallback to single page fetch
    try {
      await movieStore.getMoviesByCategory(categorySlug);
      const fallbackItems = movieStore.moviesByCategory[categorySlug]?.items || [];

      totalItems.value = fallbackItems.length;
      if (!movieStore.moviesByCategory[categorySlug]) {
        movieStore.moviesByCategory[categorySlug] = {};
      }
      movieStore.moviesByCategory[categorySlug].allMovies = fallbackItems;

      console.log(`🔄 Fallback loaded ${fallbackItems.length} movies for ${categorySlug}`);
    } catch (fallbackError) {
      console.error('❌ Fallback loading also failed:', fallbackError);
      totalItems.value = 0;
      movieStore.moviesByCategory[categorySlug] = {
        allMovies: []
      };
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

async function selectCategory(category) {
  if (selectedCategory.value.slug !== category.slug) {
    selectedCategory.value = category;
    currentPage.value = 1;
    isExpanded.value = false;
    isDropdownOpen.value = false;
    
    // Check if we already have all movies for this category
    const existingData = movieStore.moviesByCategory[category.slug];
    if (existingData && existingData.allMovies && existingData.allMovies.length > 0) {
      console.log(`📋 Using cached data for ${category.slug}: ${existingData.allMovies.length} movies`);
    } else {
      await loadAllMoviesForCategory(category.slug);
    }
  } else {
    isDropdownOpen.value = false;
  }
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    isExpanded.value = false;
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goToMovieDetails(movie) {
  console.log('🎬 Navigating to movie:', movie.slug);
  router.push({ path: `/movie/${movie.slug}` });
}

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live';
  if (!url) return '/placeholder-movie.jpg';
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`;
}

function handleImageError(event) {
  event.target.src = '/placeholder-movie.jpg';
}
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.6);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.8);
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Movie card animations */
.movie-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced hover effects */
.group:hover {
  transform: translateY(-8px) scale(1.02);
}

.play-button {
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group:hover .play-button {
  transform: scale(1);
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading-skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1) 25%, 
    rgba(255, 255, 255, 0.2) 50%, 
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Enhanced text gradient */
.bg-gradient-to-r.from-white.via-gray-100.to-gray-300 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions */
* {
  transition-property: transform, opacity, background-color, border-color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
.group:focus-within {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
  outline: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid { gap: 1rem; }
  .movie-card h3 { font-size: 0.75rem; }
  .movie-card p { font-size: 0.625rem; }
}

@media (min-width: 1536px) {
  .2xl\:grid-cols-6 {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}

/* Button hover effects */
button:disabled {
  cursor: not-allowed;
  transform: none !important;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* Dropdown animation */
.relative > div:last-child {
  animation: slideDown 0.2s ease-out;
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
</style>