<template>
  <section class="py-4 md:py-10 relative overflow-hidden">
    <div class="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <div class="flex items-center gap-2.5 md:gap-4">
          <div class="w-1 md:w-1.5 h-7 md:h-10 bg-red-600 rounded-full"></div>
          <div>
            <h2 class="text-lg md:text-2xl lg:text-3xl font-bold text-white">
              🔥 Có thể bạn sẽ thích
            </h2>
          </div>
        </div>
        <router-link 
          v-if="activeGenre"
          :to="`/the-loai/${activeGenre.slug}`" 
          class="flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 group text-xs md:text-sm"
        >
          <span class="text-red-500 font-semibold">Xem tất cả</span>
          <svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>

      <!-- Genre Tags -->
      <div v-if="categories && categories.length > 0" class="flex flex-wrap gap-2 mb-4 md:mb-6">
        <button 
          v-for="cat in categories" 
          :key="cat.id || cat.slug"
          @click="switchGenre(cat)"
          :class="[
            'px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border',
            activeGenre?.slug === cat.slug 
              ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/25' 
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 animate-pulse">
        <div v-for="n in 12" :key="n" class="aspect-[2/3] bg-white/5 rounded-xl"></div>
      </div>

      <!-- Movies Content -->
      <div v-else-if="filteredMovies.length > 0">
        <!-- Mobile: 3-col grid -->
        <div class="md:hidden">
          <div class="grid grid-cols-3 gap-1.5">
            <div 
              v-for="movie in filteredMovies.slice(0, 12)" 
              :key="movie._id || movie.slug"
            >
              <MovieCard :movie="movie" @click="goToMovieDetails(movie)" />
            </div>
          </div>
        </div>

        <!-- Tablet+ Swiper -->
        <div class="hidden md:block">
          <swiper
            :modules="modules"
            :slides-per-view="4"
            :space-between="16"
            :loop="false"
            :autoplay="{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }"
            :breakpoints="{
              768: { slidesPerView: 4, spaceBetween: 12 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
              1280: { slidesPerView: 6, spaceBetween: 20 }
            }"
            :navigation="{ nextEl: `.rm-next-${componentId}`, prevEl: `.rm-prev-${componentId}` }"
            :pagination="false"
            class="overflow-visible"
          >
            <swiper-slide v-for="movie in filteredMovies" :key="movie._id || movie.slug">
              <MovieCard :movie="movie" @click="goToMovieDetails(movie)" />
            </swiper-slide>
          </swiper>

          <!-- Custom Navigation -->
          <div class="flex items-center justify-end gap-3 mt-4">
            <button :class="`rm-prev-${componentId}`" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button :class="`rm-next-${componentId}`" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-all disabled:opacity-30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-sm">Không tìm thấy phim liên quan</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import MovieCard from './MovieCard.vue'
import 'swiper/css'
import 'swiper/css/navigation'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  currentSlug: { type: String, default: '' }
})

const movieStore = useMovieStore()
const router = useRouter()
const modules = [Autoplay, Navigation]
const loading = ref(false)
const componentId = ref(Math.random().toString(36).substr(2, 9))
const activeGenre = ref(null)
const relatedItems = ref([])

// Filter out the current movie from results
const filteredMovies = computed(() => {
  return relatedItems.value.filter(m => m.slug !== props.currentSlug).slice(0, 24)
})

async function fetchRelated(genreSlug) {
  loading.value = true
  try {
    const items = await movieStore.getMoviesByGenre(genreSlug)
    relatedItems.value = items || []
  } catch (e) {
    console.error('❌ Error fetching related movies', e)
    relatedItems.value = []
  } finally {
    loading.value = false
  }
}

function switchGenre(cat) {
  activeGenre.value = cat
  fetchRelated(cat.slug)
}

// Watch for category changes (when navigating between movies)
watch(
  () => props.categories,
  (newCats) => {
    if (newCats && newCats.length > 0) {
      activeGenre.value = newCats[0]
      fetchRelated(newCats[0].slug)
    }
  },
  { immediate: true, deep: true }
)

function goToMovieDetails(movie) {
  if (movie.slug) {
    router.push({ path: `/movie/${movie.slug}` })
  }
}
</script>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
