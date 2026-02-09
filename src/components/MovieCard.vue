<template>
  <div
    class="movie-card-wrapper relative h-full"
    @mouseenter="startHoverTimer"
    @mouseleave="cancelHover"
    ref="wrapperRef"
  >
    <!-- Main Card -->
    <div
      class="movie-card group flat-card rounded-xl overflow-hidden cursor-pointer h-full flex flex-col"
      @click="handleClick"
    >
      <!-- Image Container -->
      <div class="relative aspect-[2/3] overflow-hidden bg-gray-200">
        <img
          :src="getImageUrl(movie.thumb_url || movie.poster_url)"
          :alt="movie.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        <!-- Play Button Overlay -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div class="w-12 h-12 bg-theme-primary rounded-full flex items-center justify-center shadow-lg text-brand hover:scale-110 transition-transform">
            <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        <!-- Badges -->
        <div class="absolute top-2 left-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-brand text-white rounded text-[10px] md:text-xs font-bold shadow-sm">
          {{ movie.quality || 'HD' }}
        </div>
        
        <div class="absolute top-2 right-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-black/60 text-white rounded text-[10px] md:text-xs font-medium backdrop-blur-sm hidden sm:block">
          {{ movie.year }}
        </div>
        
        <div v-if="movie.episode_current && movie.episode_current !== 'Full'" class="absolute bottom-2 left-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-600 text-white rounded text-[10px] md:text-xs font-bold shadow-sm">
          {{ movie.episode_current === 'Hoàn Tất' ? 'FULL' : `TẬP ${movie.episode_current}` }}
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="p-2 md:p-3 flex-1 flex flex-col bg-theme-card">
        <h3 class="text-xs md:text-sm font-bold text-theme-primary group-hover:text-brand transition-colors line-clamp-2 leading-tight mb-0.5 md:mb-1">
          {{ movie.name }}
        </h3>
        
        <p class="text-[10px] md:text-xs text-theme-muted line-clamp-1 mb-1 md:mb-2 opacity-70">
          {{ movie.origin_name }}
        </p>
        
        <div class="mt-auto flex items-center justify-between text-[10px] md:text-xs text-theme-secondary border-t border-theme pt-1.5 md:pt-2">
           <div class="flex items-center gap-1">
            <svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>{{ movie.tmdb?.vote_average || 'N/A' }}</span>
          </div>
           <span class="hidden md:inline">{{ movie.time || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Popup -->
    <Teleport to="body">
      <div
        v-if="showPopup && !isMobile"
        :class="['fixed z-[9999] w-80 bg-theme-card rounded-xl shadow-2xl border border-theme overflow-hidden transition-all duration-200', popupAnimationClass]"
        :style="popupStyle"
        @mouseenter="keepPopupOpen = true; isHoveringPopup = true"
        @mouseleave="handlePopupLeave"
      >
        <!-- Image Preview (Reliable & Beautiful) -->
        <div class="aspect-video relative bg-gray-100 group/image overflow-hidden">
          <div v-if="trailerUrl && getYoutubeEmbedUrl(trailerUrl)" class="absolute inset-0 z-10 w-full h-full bg-black">
             <iframe
              :src="getYoutubeEmbedUrl(trailerUrl)"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              class="w-full h-full pointer-events-none"
            ></iframe>
            <!-- Overlay to capture clicks so dragging doesn't get stuck in iframe -->
            <div @click.stop="handleClick" class="absolute inset-0 z-20 cursor-pointer bg-transparent"></div>
          </div>

          <img 
            v-if="!trailerUrl || !getYoutubeEmbedUrl(trailerUrl)"
            :src="getImageUrl(movie.poster_url || movie.thumb_url)" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
          />
          <div class="absolute inset-0 bg-black/10"></div>
          
          <!-- Play Button (Solid Pastel) -->
          <button v-if="!trailerUrl" @click.stop="handleClick" class="absolute inset-0 flex items-center justify-center group/play z-30">
            <div class="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-brand group-hover/play:scale-110 transition-transform duration-300">
               <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        </div>

        <div class="p-4 bg-white">
          <h3 class="font-bold text-gray-800 text-lg line-clamp-1 mb-1">{{ movie.name }}</h3>
          <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ movie.origin_name }}</p>
          
          <div class="flex gap-2">
            <!-- Solid Color Button (No Gradient) -->
            <button @click.stop="handleClick" class="flex-1 px-4 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm">
              Xem Phim
            </button>
            <button class="w-10 h-10 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:text-brand transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>

          <!-- Meta -->
          <div class="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100 mt-4">
            <span class="flex items-center gap-1 text-yellow-500">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ movie.tmdb?.vote_average || '8.5' }}
            </span>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{{ movie.quality || 'HD' }}</span>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{{ movie.year }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axiosClient from '../api/axiosClient'

const props = defineProps({
  movie: { type: Object, required: true }
})

const emit = defineEmits(['click'])

const wrapperRef = ref(null)
const showPopup = ref(false)
const isHoveringPopup = ref(false)
const keepPopupOpen = ref(false)
const popupStyle = ref({})
const isMobile = ref(false)
const trailerUrl = ref('')
const loadingTrailer = ref(false)
let hoverTimer = null

const popupAnimationClass = computed(() => {
  return showPopup.value ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', closePopup, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', closePopup)
  clearTimeout(hoverTimer)
})

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) closePopup()
}


function startHoverTimer() {
  if (isMobile.value) return
  hoverTimer = setTimeout(() => {
    calculatePosition()
    showPopup.value = true
    fetchTrailer()
  }, 400)
}

async function fetchTrailer() {
  if (trailerUrl.value) return 
  if (props.movie.trailer_url) {
    trailerUrl.value = props.movie.trailer_url
    return
  }
  
  loadingTrailer.value = true
  try {
     const res = await axiosClient.get(`v1/api/phim/${props.movie.slug}`)
     trailerUrl.value = res.data?.movie?.trailer_url || ''
  } catch (e) {
     console.error('Failed to fetch trailer for popup', e)
  } finally {
     loadingTrailer.value = false
  }
}

function getYoutubeEmbedUrl(url) {
  if (!url) return ''
  const match = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  if (match && match[1]) {
    // Autoplay, Mute (required for autoplay), Controls=0, ModestBranding, Loop, Playlist (for loop)
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${match[1]}&rel=0`;
  }
  return '';
}

function cancelHover() {
  clearTimeout(hoverTimer)
  if (!keepPopupOpen.value) {
    setTimeout(() => {
      if (!isHoveringPopup.value) closePopup()
    }, 100)
  }
}

function handlePopupLeave() {
  closePopup()
}

function closePopup() {
  showPopup.value = false
  isHoveringPopup.value = false
  keepPopupOpen.value = false
  clearTimeout(hoverTimer)
  // Clear trailer URL to stop video when closed (optional, helps performance)
  // But maybe better to keep if user hovers back quickly? 
  // For now let's keep it simply cached in component instance
}

function calculatePosition() {
  if (!wrapperRef.value) return
  
  const rect = wrapperRef.value.getBoundingClientRect()
  const popupW = 320
  const viewportW = window.innerWidth
  const padding = 16
  
  let left = rect.right + 10
  // Flip to left if not enough space
  if (left + popupW > viewportW - padding) {
    left = rect.left - popupW - 10
  }
  // Clamp horizontal
  if (left < padding) left = padding
  
  // Center vertical
  let top = rect.top + (rect.height / 2) - 150 // 150 approx half popup height
  
  // Clamp vertical
  if (top < padding) top = padding + 60
  if (top + 300 > window.innerHeight - padding) top = window.innerHeight - 300 - padding

  popupStyle.value = { 
    top: `${top}px`, 
    left: `${left}px` 
  }
}

function handleClick() {
  emit('click')
}

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live'
  if (!url) return '/placeholder-movie.jpg'
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}
</script>

<style scoped>
.flat-card {
  will-change: transform;
}
</style>
