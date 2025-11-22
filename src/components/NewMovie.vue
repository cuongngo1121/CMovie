<template>
  <div class="w-full px-4 md:px-6 py-8 text-white mt-8 md:mt-12">
    
    <!-- Header section with simplified styling -->
    <div class="flex justify-between items-center mb-6 md:mb-8 px-2 md:px-4">
      <div class="flex items-center gap-3 md:gap-4">
        <div class="w-1 h-6 md:h-8 bg-secondary rounded-full"></div>
        <h2 class="text-2xl md:text-3xl font-bold text-primary">
          {{ title }}
        </h2>
      </div>
      
      <button 
        @click="handleViewAll"
        class="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-secondary rounded-full text-xs md:text-sm font-semibold hover:bg-secondary-light transition-all duration-300 hover:scale-105 text-primary-dark">
        <span>Xem tất cả</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

   

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-2 md:px-4">
      <div v-for="n in 10" :key="n" class="loading-skeleton rounded-2xl aspect-[2/3] bg-bg-card"></div>
    </div>

    <!-- No movies message -->
    <div v-else-if="movies.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🎬</div>
      <h3 class="text-xl font-semibold mb-2">Chưa có phim</h3>
      <p class="text-text-muted">Không tìm thấy phim nào cho danh mục: <strong>{{ category }}</strong></p>
      <button @click="retryLoad" class="mt-4 px-4 py-2 bg-secondary rounded text-primary-dark hover:bg-secondary-light transition-colors">
        Thử lại
      </button>
    </div>
   
    <!-- Enhanced Swiper carousel -->
    <div v-else class="relative group/swiper">
      <swiper
        :modules="[Autoplay, Navigation]"
        :navigation="{
          nextEl: `.custom-next-${componentId}`,
          prevEl: `.custom-prev-${componentId}`,
        }"
        :slides-per-view="2"
        :space-between="16"
        :breakpoints="{
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          768: { slidesPerView: 3.2, spaceBetween: 24 },
          1024: { slidesPerView: 4.2, spaceBetween: 28 },
          1280: { slidesPerView: 5.2, spaceBetween: 32 }
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
          <!-- Movie card with clean design -->
          <div class="relative bg-bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-secondary/10">
            
            <!-- Movie poster container -->
            <div class="relative overflow-hidden aspect-[2/3]">
              <img
                :src="getImageUrl(movie.thumb_url)"
                :alt="movie.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                :loading="index < 5 ? 'eager' : 'lazy'"
                @error="handleImageError"
              />
              
              <!-- Simple dark overlay -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Play button overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div class="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary-light transition-colors duration-200 hover:scale-110 play-button text-primary-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5 md:w-6 md:h-6 ml-1">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Quality badge -->
              <div class="absolute top-2 left-2 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-secondary rounded-md text-[10px] md:text-xs font-bold text-primary-dark">
                {{ movie.quality || 'HD' }}
              </div>
              
              <!-- Year badge -->
              <div class="absolute top-2 right-2 md:top-3 md:right-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-black/60 backdrop-blur-sm rounded-md text-[10px] md:text-xs font-medium">
                {{ movie.year || 'N/A' }}
              </div>

              <!-- Episode count badge for series -->
              <div v-if="movie.episode_current && movie.episode_current !== 'Full'" 
                   class="absolute bottom-2 left-2 md:bottom-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-success/90 backdrop-blur-sm rounded-md text-[10px] md:text-xs font-bold">
                {{ movie.episode_current === 'Hoàn Tất' ? 'Full' : `Tập ${movie.episode_current}` }}
              </div>
            </div>

            <!-- Movie info section -->
            <div class="p-3 md:p-4 space-y-1 md:space-y-2">
              <h3 class="text-sm md:text-base font-bold text-primary group-hover:text-secondary transition-colors duration-300 line-clamp-2 leading-tight min-h-[2.5em]">
                {{ movie.name }}
              </h3>
              
              <p class="text-xs md:text-sm text-text-muted group-hover:text-text-secondary transition-colors duration-300 line-clamp-1">
                {{ movie.origin_name }}
              </p>
              
              <!-- Rating and additional info -->
              <div class="flex items-center justify-between pt-1 md:pt-2">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-3 h-3 md:w-4 md:h-4 text-secondary">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-[10px] md:text-xs text-text-muted">{{ movie.tmdb?.vote_average || '8.0' }}</span>
                </div>
                
                <div class="flex items-center gap-1 text-[10px] md:text-xs text-text-muted">
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
        <div :class="`custom-prev-${componentId} hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full items-center justify-center cursor-pointer hover:bg-secondary transition-all duration-300 hover:scale-110 group border border-border hover:border-secondary opacity-0 group-hover/swiper:opacity-100 -ml-6`">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 group-hover:text-primary-dark">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        <div :class="`custom-next-${componentId} hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full items-center justify-center cursor-pointer hover:bg-secondary transition-all duration-300 hover:scale-110 group border border-border hover:border-secondary opacity-0 group-hover/swiper:opacity-100 -mr-6`">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 group-hover:text-primary-dark">
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
  background: rgba(245, 158, 11, 0.6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.8);
}

@media (min-width: 768px) {
  .movie-swiper {
    padding: 0 10px;
  }
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

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, opacity, background-color, border-color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom focus effect */
.group:focus-within {
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
  outline: none;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>