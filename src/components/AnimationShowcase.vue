<template>
  <div class="animation-showcase-section">
    <!-- Section Header (Absolute on top) -->
    <div class="absolute top-0 left-0 w-full z-20 px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <div class="flex items-center justify-between max-w-[1600px] mx-auto pointer-events-auto">
        <div>
          <h2 class="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 flex items-center gap-2 md:gap-3 text-shadow">
            <span class="text-2xl md:text-4xl">✨</span>
            Hoạt Hình Nổi Bật
          </h2>
          <p class="text-gray-200 text-sm md:text-lg text-shadow-sm">Khám phá thế giới anime đầy màu sắc</p>
        </div>
        <router-link 
          to="/animation" 
          class="view-all-link group backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20"
        >
          <span class="group-hover:text-white transition-colors text-sm md:text-base text-yellow-400 font-bold">Xem tất cả</span>
          <svg class="icon group-hover:translate-x-1 transition-transform text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-full bg-gray-900">
      <div class="loading-spinner"></div>
    </div>

    <!-- Swiper Slider (Full Cover) -->
    <swiper
      v-else-if="displayMovies.length > 0"
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :autoplay="{ delay: 6000, disableOnInteraction: false }"
      :effect="'fade'"
      :fade-effect="{ crossFade: true }"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :navigation="true"
      class="animation-swiper"
    >
      <swiper-slide v-for="movie in displayMovies" :key="movie._id || movie.slug">
        <div class="slide-content">
          <!-- Large Background Image (Backdrop) -->
          <div class="slide-background">
            <img 
              :src="getImageUrl(movie.poster_url || movie.thumb_url)" 
              :alt="movie.name"
              class="background-image"
            />
            <!-- Gradient Overlays for readability -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10"></div>
          </div>

          <!-- Content Container -->
          <div class="content-container relative z-20 pt-20 md:pt-24">
            <div class="content-grid">
              <!-- Left: Poster (Floating) -->
              <div class="poster-wrapper hidden lg:block">
                <div class="poster-container">
                  <img 
                    :src="getImageUrl(movie.thumb_url)"
                    :alt="movie.name"
                    class="poster-image"
                  />
                  <div class="poster-reflection"></div>
                </div>
              </div>

              <!-- Right: Detailed Info -->
              <div class="info-container">
                <!-- Badges Row -->
                <div class="badges">
                  <span v-if="movie.quality" class="badge badge-quality">
                    {{ movie.quality }}
                  </span>
                  <span v-if="movie.lang" class="badge badge-lang">{{ movie.lang }}</span>
                  <span v-if="movie.year" class="badge badge-year">{{ movie.year }}</span>
                </div>

                <!-- Title & Subtitle -->
                <div class="title-block">
                  <h3 class="movie-title text-shadow-lg" :title="movie.name">{{ movie.name }}</h3>
                  <p v-if="movie.origin_name" class="movie-subtitle text-shadow">{{ movie.origin_name }}</p>
                </div>

                <!-- Meta Info Grid (Hidden on Mobile) -->
                <div class="meta-grid hidden md:grid">
                  <div v-if="movie.episode_current" class="meta-item">
                    <span class="meta-label">Tập mới nhất:</span>
                    <span class="meta-value highlight">{{ movie.episode_current }}</span>
                  </div>
                  <div v-if="movie.time" class="meta-item">
                    <span class="meta-label">Thời lượng:</span>
                    <span class="meta-value">{{ movie.time }}</span>
                  </div>
                  <div v-if="movie.category && movie.category.length" class="meta-item full-width hidden sm:block">
                    <span class="meta-label">Thể loại:</span>
                    <div class="genre-tags">
                      <span v-for="cat in movie.category.slice(0, 3)" :key="cat.id" class="genre-tag">
                        {{ cat.name }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Description (Hidden on Mobile) -->
                <p v-if="movie.content" class="movie-description hidden md:block drop-shadow-md">
                  {{ truncateText(stripHtml(movie.content), 150) }}
                </p>

                <!-- Action Buttons -->
                <div class="action-buttons">
                  <button @click="goToMovie(movie.slug)" class="btn-primary">
                    <div class="play-icon-wrapper">
                      <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span class="btn-text">Xem Ngay</span>
                  </button>
                  <button class="btn-secondary hidden sm:flex">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Chi Tiết</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Empty State -->
    <div v-else class="empty-state flex justify-center items-center h-full bg-gray-900">
      <p class="empty-text text-gray-400">Chưa có nội dung hoạt hình</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const router = useRouter()
const movieStore = useMovieStore()

const modules = [Navigation, Pagination, Autoplay, EffectFade]
const loading = ref(false)
const displayMovies = ref([])

onMounted(async () => {
  loading.value = true
  try {
    await movieStore.getMoviesByCategory('hoat-hinh')
    const data = movieStore.moviesByCategory['hoat-hinh']
    if (data && data.items) {
      displayMovies.value = data.items.slice(0, 8)
    }
  } finally {
    loading.value = false
  }
})

function getImageUrl(url) {
  const cdn = 'https://img.ophim.live'
  if (!url) return '/placeholder.jpg'
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

function stripHtml(html) {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function truncateText(text, length) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

function goToMovie(slug) {
  router.push(`/movie/${slug}`)
}
</script>

<style scoped>
.animation-showcase-section {
  position: relative;
  width: 100%;
  height: 400px; /* Reduced height for mobile */
  overflow: hidden;
  background: #000;
}

@media (min-width: 768px) {
  .animation-showcase-section {
    height: 700px; /* Taller on desktop */
  }
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 99px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 768px) {
  .view-all-link {
    padding: 10px 24px;
  }
}

.view-all-link:hover {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.icon {
  width: 16px;
  height: 16px;
}

@media (min-width: 768px) {
  .icon {
    width: 20px;
    height: 20px;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(245, 158, 11, 0.3);
  border-top-color: #F59E0B;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;
}

@media (min-width: 768px) {
  .loading-spinner {
    width: 56px;
    height: 56px;
    border-width: 4px;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animation-swiper {
  width: 100%;
  height: 100%;
}

.slide-content {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

/* Background Styles */
.slide-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05); 
  transition: transform 10s ease;
}

.swiper-slide-active .background-image {
  transform: scale(1);
}

/* Content Styles */
.content-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 5%;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  align-items: center;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 300px 1fr;
    gap: 40px;
  }
}

@media (min-width: 1280px) {
  .content-grid {
    grid-template-columns: 350px 1fr;
    gap: 60px;
  }
}

/* Poster Styles */
.poster-wrapper {
  perspective: 1000px;
}

.poster-container {
  position: relative;
  width: 100%;
  border-radius: 20px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: rotateY(5deg);
  transition: transform 0.5s ease;
}

.poster-wrapper:hover .poster-container {
  transform: rotateY(0deg) scale(1.02);
}

.poster-image {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 20px;
}

/* Info Styles */
.info-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 100%;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .info-container {
    gap: 24px;
    max-width: 800px;
  }
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .badge {
    padding: 6px 14px;
    font-size: 13px;
    border-radius: 8px;
  }
}

.badge-quality {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: #fff;
}

.badge-lang {
  background: rgba(255, 255, 255, 0.1);
  color: #E5E7EB;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.badge-year {
  background: #1F2937;
  color: #9CA3AF;
}

.title-block {
  margin-bottom: 4px;
  width: 100%;
}

.movie-title {
  font-size: 28px;
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.2;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 640px) {
  .movie-title {
    font-size: 36px;
  }
}

@media (min-width: 1024px) {
  .movie-title {
    font-size: 56px;
    line-height: 1.1;
    margin-bottom: 8px;
  }
}

.movie-subtitle {
  font-size: 16px;
  color: #F59E0B;
  font-weight: 500;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 768px) {
  .movie-subtitle {
    font-size: 24px;
  }
}

/* Meta Grid */
.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  width: 100%;
}

@media (min-width: 640px) {
  .meta-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    gap: 20px;
    padding: 20px;
    border-radius: 16px;
    width: auto;
  }
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

@media (min-width: 768px) {
  .meta-item {
    gap: 4px;
  }
}

.meta-item.full-width {
  grid-column: 1 / -1;
}

.meta-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #9CA3AF;
  font-weight: 600;
  letter-spacing: 0.5px;
}

@media (min-width: 768px) {
  .meta-label {
    font-size: 12px;
  }
}

.meta-value {
  font-size: 13px;
  color: #E5E7EB;
  font-weight: 500;
}

@media (min-width: 768px) {
  .meta-value {
    font-size: 15px;
  }
}

.meta-value.highlight {
  color: #F59E0B;
  font-weight: 700;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre-tag {
  font-size: 11px;
  color: #D1D5DB;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

@media (min-width: 768px) {
  .genre-tag {
    font-size: 13px;
    padding: 4px 10px;
    border-radius: 6px;
  }
}

.genre-tag:hover {
  background: #F59E0B;
  color: #0F1419;
}

.movie-description {
  font-size: 14px;
  line-height: 1.6;
  color: #D1D5DB;
  max-width: 700px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 768px) {
  .movie-description {
    font-size: 16px;
    line-height: 1.7;
  }
}

/* Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .action-buttons {
    width: auto;
    gap: 16px;
    margin-top: 16px;
  }
}

.btn-primary {
  height: 44px;
  padding: 0 20px;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  border: none;
  border-radius: 10px;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
  flex: 1;
}

@media (min-width: 640px) {
  .btn-primary {
    height: 56px;
    padding: 0 32px;
    border-radius: 12px;
    font-size: 16px;
    gap: 12px;
    flex: initial;
  }
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 28px rgba(245, 158, 11, 0.4);
}

.play-icon-wrapper {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .play-icon-wrapper {
    width: 28px;
    height: 28px;
  }
}

.btn-secondary {
  height: 44px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  flex: 1;
}

@media (min-width: 640px) {
  .btn-secondary {
    height: 56px;
    padding: 0 32px;
    border-radius: 12px;
    font-size: 16px;
    gap: 12px;
    flex: initial;
  }
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

@media (min-width: 640px) {
  .btn-icon {
    width: 24px;
    height: 24px;
  }
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0,0,0,0.7);
}
.text-shadow-sm {
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
</style>
