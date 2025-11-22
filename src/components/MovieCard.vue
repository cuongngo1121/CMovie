<template>
  <div
    class="group relative bg-bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border hover:border-secondary cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Movie Poster -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <img 
        :src="getImageUrl(movie.thumb_url || movie.poster_url)" 
        :alt="movie.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Dark overlay on hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Hover Info Overlay -->
      <div class="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
        <!-- Title -->
        <h3 class="text-white font-bold text-sm md:text-base mb-2 line-clamp-2">
          {{ movie.name }}
        </h3>
        
        <!-- Meta Info -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span v-if="movie.year" class="px-2 py-1 bg-secondary text-primary-dark rounded text-xs font-semibold">
            {{ movie.year }}
          </span>
          <span v-if="movie.quality" class="px-2 py-1 bg-bg-elevated text-primary rounded text-xs font-semibold">
            {{ movie.quality }}
          </span>
          <span v-if="movie.lang" class="px-2 py-1 bg-bg-elevated text-primary rounded text-xs font-semibold">
            {{ movie.lang }}
          </span>
        </div>
        
        <!-- Episode Info -->
        <p v-if="movie.episode_current" class="text-success text-xs font-semibold mb-2">
          {{ movie.episode_current === 'Hoàn Tất' || movie.episode_current === 'Full' ? 'Hoàn thành' : `Tập ${movie.episode_current}` }}
        </p>
        
        <!-- Categories -->
        <div v-if="movie.category && movie.category.length > 0" class="flex flex-wrap gap-1 mb-2">
          <span 
            v-for="(cat, index) in movie.category.slice(0, 2)" 
            :key="index"
            class="text-text-muted text-xs"
          >
            {{ cat.name || cat }}{{ index < Math.min(movie.category.length - 1, 1) ? ', ' : '' }}
          </span>
        </div>
        
        <!-- Play Button -->
        <div class="flex items-center justify-center mt-2">
          <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-light transition-colors text-primary-dark">
            <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Quality Badge (always visible) -->
      <div v-if="movie.quality" class="absolute top-2 left-2 px-2 py-1 bg-secondary text-primary-dark text-xs rounded font-semibold">
        {{ movie.quality }}
      </div>
      
      <!-- Year Badge (always visible) -->
      <div v-if="movie.year" class="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded font-medium">
        {{ movie.year }}
      </div>
    </div>

    <!-- Movie Info (visible on mobile/non-hover) -->
    <div class="p-3 md:group-hover:hidden">
      <h3 class="text-white text-sm font-semibold line-clamp-2 leading-tight group-hover:text-secondary transition-colors duration-300">
        {{ movie.name }}
      </h3>
      <p class="text-text-muted text-xs mt-1">{{ movie.origin_name || movie.year }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live'
  if (!url) return '/placeholder-movie.jpg'
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
