<template>
  <div class="w-full px-6 py-8 text-white mt-12 relative overflow-hidden">
    <!-- Background gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
    
    <!-- Header section with enhanced styling -->
    <div class="flex justify-between items-center mb-8 px-4 relative z-10">
      <div class="flex items-center gap-4">
        <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          {{ title }}
        </h2>
      </div>
      
      <button 
        @click="handleViewAll"
        class="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-sm font-semibold hover:from-red-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
        <span>Xem tất cả</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

   

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
      <div v-for="n in 10" :key="n" class="loading-skeleton rounded-2xl aspect-[2/3] bg-gray-800"></div>
    </div>

    <!-- No movies message -->
    <div v-else-if="movies.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🎬</div>
      <h3 class="text-xl font-semibold mb-2">Chưa có phim</h3>
      <p class="text-gray-400">Không tìm thấy phim nào cho danh mục: <strong>{{ category }}</strong></p>
      <button @click="retryLoad" class="mt-4 px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700">
        Thử lại
      </button>
      
      <!-- Debug raw data -->
      <div class="mt-4 p-4 bg-gray-800 rounded text-xs text-left">
        <p><strong>Raw Store Data:</strong></p>
        <pre>{{ JSON.stringify(movieStore.moviesByCategory[category], null, 2) }}</pre>
      </div>
    </div>
   
    <!-- Enhanced Swiper carousel -->
    <div v-else class="relative">
      <swiper
        :modules="[Autoplay, Navigation]"
        :navigation="{
          nextEl: `.custom-next-${componentId}`,
          prevEl: `.custom-prev-${componentId}`,
        }"
        :slides-per-view="1"
        :space-between="24"
        :breakpoints="{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 28 },
          1280: { slidesPerView: 5, spaceBetween: 32 }
        }"
        :autoplay="{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }"
        :loop="movies.length > 5"
        class="movie-swiper pb-4"
      >
        <swiper-slide
          v-for="(movie, index) in movies"
          :key="movie.slug || index"
          class="group cursor-pointer"
          @click="goToMovieDetails(movie)"
        >
          <!-- Movie card with enhanced design -->
          <div class="relative bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            
            <!-- Movie poster container -->
            <div class="relative overflow-hidden aspect-[2/3]">
              <img
                :src="getImageUrl(movie.thumb_url)"
                :alt="movie.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                :loading="index < 5 ? 'eager' : 'lazy'"
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
            <div class="p-4 space-y-2">
              <h3 class="text-base font-bold text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2 leading-tight">
                {{ movie.name }}
              </h3>
              
              <p class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 line-clamp-1">
                {{ movie.origin_name }}
              </p>
              
              <!-- Rating and additional info -->
              <div class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 text-yellow-400">
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
            </div>
          </div>
        </swiper-slide>

        <!-- Custom navigation buttons with unique IDs -->
        <div :class="`custom-prev-${componentId} absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600/80 transition-all duration-300 hover:scale-110 group border border-gray-600/50 hover:border-red-500/50`">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 group-hover:text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        <div :class="`custom-next-${componentId} absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600/80 transition-all duration-300 hover:scale-110 group border border-gray-600/50 hover:border-red-500/50`">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 group-hover:text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { onMounted, computed, ref } from 'vue';
import { useMovieStore } from '../stores/movieStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const movieStore = useMovieStore();

// Unique component ID for navigation buttons
const componentId = ref(Math.random().toString(36).substr(2, 9));

const props = defineProps({
  title: { 
    type: String,
    default: 'Recently Updated'
  },
  category: {
    type: String,
    default: 'phim-moi'
  }
});

// Load movies when component mounts
onMounted(async () => {
  console.log(`🎬 NewMovie component mounted for category: ${props.category}`);
  await loadMovies();
});

// Function to load movies
async function loadMovies() {
  try {
    console.log(`📡 Making API call for category: ${props.category}`);
    await movieStore.getMoviesByCategory(props.category);
    
    const categoryData = movieStore.moviesByCategory[props.category];
    console.log(`📋 Store data after API call:`, categoryData);
    
    if (categoryData?.items) {
      console.log(`✅ Successfully loaded ${categoryData.items.length} movies for ${props.category}`);
    } else {
      console.warn(`⚠️ No items found in store for category: ${props.category}`);
    }
  } catch (error) {
    console.error(`❌ Error loading movies for ${props.category}:`, error);
  }
}

// Retry load function
async function retryLoad() {
  console.log(`🔄 Retrying to load movies for ${props.category}`);
  // Clear existing data first
  if (movieStore.moviesByCategory[props.category]) {
    delete movieStore.moviesByCategory[props.category];
  }
  await loadMovies();
}

// Computed property for store data (for debugging)
const storeData = computed(() => {
  return movieStore.moviesByCategory[props.category] || null;
});

// Computed property to get movies
const movies = computed(() => {
  const categoryData = movieStore.moviesByCategory[props.category];
  
  // Try different possible paths
  let items = [];
  
  if (categoryData?.items) {
    items = categoryData.items;
  } else if (categoryData?.data?.items) {
    items = categoryData.data.items;
  } else if (categoryData?.data?.data?.items) {
    items = categoryData.data.data.items;
  }
  
  const finalItems = Array.isArray(items) ? items.slice(0, 24) : [];
  
  console.log(`🎬 Movies computed for ${props.category}:`, finalItems.length, 'items');
  
  return finalItems;
});

// Loading state
const isLoading = computed(() => {
  return movieStore.loading;
});

// Methods
function goToMovieDetails(movie) {
  if (movie.slug) {
    console.log('🎬 Navigating to movie details:', movie.slug);
    router.push({ path: `/movie/${movie.slug}` });
  } else {
    console.error('❌ Movie slug not found:', movie);
  }
}

function handleViewAll() {
  router.push(`/category/${props.category}`);
}

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live';
  if (!url) return '/placeholder-movie.jpg';
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`;
}

function handleImageError(event) {
  console.warn('🖼️ Image load error:', event.target.src);
  event.target.src = '/placeholder-movie.jpg';
}
</script>

<style scoped>
/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
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

/* Swiper custom styles */
.movie-swiper {
  padding: 0 60px;
}

.movie-swiper .swiper-slide {
  height: auto;
}

/* Enhanced hover effects */
.group:hover {
  transform: translateY(-8px);
}

.play-button {
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group:hover .play-button {
  transform: scale(1);
}

/* Custom navigation button animations */
[class*="custom-prev-"],
[class*="custom-next-"] {
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.movie-swiper:hover [class*="custom-prev-"],
.movie-swiper:hover [class*="custom-next-"] {
  opacity: 1;
  visibility: visible;
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

/* Glassmorphism effect for cards */
.movie-swiper .swiper-slide > div {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Enhanced text gradient */
.bg-gradient-to-r.from-white.via-gray-100.to-gray-300 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, opacity, background-color, border-color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom glow effect for focused elements */
.group:focus-within {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
  outline: none;
}

/* Enhanced mobile responsiveness */
@media (max-width: 640px) {
  .movie-swiper {
    padding: 0 20px;
  }
  
  [class*="custom-prev-"],
  [class*="custom-next-"] {
    width: 10px;
    height: 10px;
  }
}
</style>