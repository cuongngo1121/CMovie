<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <!-- Navbar -->
    <NavBar />

    <!-- Animated background particles -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 pt-24 pb-12">
      <div v-if="movie" class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        <!-- Back to Movie Detail Button -->
        <div class="mb-6">
          <button 
            @click="goBackToDetail1"
            class="group flex items-center gap-3 px-6 py-3 bg-gray-800/60 backdrop-blur-xl border border-gray-600/50 rounded-xl hover:bg-gray-700/60 hover:border-gray-500/50 transition-all duration-300 hover:scale-105"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center group-hover:from-red-600 group-hover:to-pink-600 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </div>
            <span class="text-white font-medium group-hover:text-gray-100">Quay về thông tin phim</span>
          </button>
        </div>
        
        <!-- Video Player Section -->
        <div class="mb-8">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div class="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div class="aspect-video w-full">
                <iframe
                  v-if="currentEpisodeLink"
                  :src="currentEpisodeLink"
                  allowfullscreen
                  class="w-full h-full"
                  frameborder="0"
                  ref="playerFrame"
                ></iframe>
                <div v-else class="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                  <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4 opacity-50">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                    <p class="text-lg font-medium">Video không khả dụng</p>
                    <p class="text-sm">Vui lòng thử tập khác</p>
                  </div>
                </div>
              </div>
              
              <!-- Loading overlay -->
              <div v-if="loadingEpisode" class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p class="text-white font-medium">{{ toastMessage }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Movie Info Section -->
        <div class="grid lg:grid-cols-3 gap-8 mb-8">
          
          <!-- Left: Poster and Quick Info -->
          <div class="lg:col-span-1">
            <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              <div class="relative group mb-6">
                <div class="absolute -inset-1 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div class="relative aspect-[2/3] rounded-xl overflow-hidden">
                  <img
                    :src="getImageUrl(movie.thumb_url)"
                    :alt="movie.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <!-- Quick Stats -->
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <span class="text-gray-400 text-sm">Đánh giá</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 text-yellow-400">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="text-white font-semibold">{{ movie.imdb?.vote_average || '8.5' }}</span>
                  </div>
                </div>
                
                <div class="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <span class="text-gray-400 text-sm">Chất lượng</span>
                  <span class="text-green-400 font-semibold">{{ movie.quality }}</span>
                </div>
                
                <div class="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <span class="text-gray-400 text-sm">Ngôn ngữ</span>
                  <span class="text-blue-400 font-semibold">{{ movie.lang }}</span>
                </div>
                
                <div class="flex items-center justify-between py-2">
                  <span class="text-gray-400 text-sm">Năm sản xuất</span>
                  <span class="text-purple-400 font-semibold">{{ movie.year }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Details -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Title and Basic Info -->
            <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h1 class="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                {{ movie.name }}
              </h1>
              <p class="text-xl text-gray-400 mb-4">{{ movie.origin_name }}</p>
              
              <!-- Genre tags -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span 
                  v-for="category in movie.category" 
                  :key="category.id"
                  class="px-3 py-1 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-full text-sm font-medium text-red-300 hover:from-red-600/30 hover:to-pink-600/30 transition-all duration-300"
                >
                  {{ category.name }}
                </span>
              </div>
              
              <!-- Description -->
              <div class="text-gray-300 leading-relaxed">
                <h3 class="text-lg font-semibold mb-3 text-white">Nội dung phim</h3>
                <p class="text-sm md:text-base">
                  {{ movie.content }}
                </p>
              </div>
            </div>

            <!-- Episode Counter -->
            <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">Tổng số tập</h3>
                    <p class="text-gray-400">{{ movie.episode_total }} tập</p>
                  </div>
                </div>
                
                <div class="text-right">
                  <p class="text-sm text-gray-400">Đang xem</p>
                  <p class="text-lg font-bold text-red-400">Tập {{ currentEpisode + 1 }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Episodes Section -->
        <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
            <h2 class="text-2xl font-bold text-white">Danh sách tập phim</h2>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            <button
              v-for="(ep, index) in movie.episodes[0]?.server_data"
              :key="index"
              @click="handleClick(index)"
              :class="[
                'relative group h-12 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden',
                currentEpisode === index
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25 scale-105'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105 border border-gray-600/30 hover:border-gray-500/50'
              ]"
            >
              <!-- Background glow effect for active episode -->
              <div v-if="currentEpisode === index" class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 blur-sm opacity-50"></div>
              
              <!-- Episode number -->
              <span class="relative z-10 flex items-center justify-center h-full">
                {{ ep.name }}
              </span>
              
              <!-- Hover effect overlay -->
              <div class="absolute inset-0 bg-gradient-to-r from-red-600/0 to-pink-600/0 group-hover:from-red-600/10 group-hover:to-pink-600/10 transition-all duration-300"></div>
            </button>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">Bình luận về phim</h2>
          </div>
          
          <!-- Comment input -->
          <div class="mb-6">
            <div class="relative">
              <textarea 
                placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                class="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                rows="3"
              ></textarea>
              <button class="absolute bottom-3 right-3 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg text-sm font-semibold hover:from-red-500 hover:to-pink-500 transition-all duration-300 hover:scale-105">
                Gửi
              </button>
            </div>
          </div>
          
          <!-- Empty comments state -->
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.309 3.064 2.923 3.064.816 0 1.538-.362 2.039-.932C8.38 19.833 12.113 23 16.5 23c4.387 0 8.123-3.167 8.835-7.083.501.57 1.223.932 2.039.932 1.614 0 2.923-1.373 2.923-3.064v-10.5c0-1.691-1.309-3.064-2.923-3.064-.816 0-1.538.362-2.039.932C23.623 1.167 19.887-2 15.5-2S7.377 1.167 6.665 5.083C6.164 4.513 5.442 4.151 4.626 4.151 3.012 4.151 1.703 5.524 1.703 7.215v10.5Z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-300 mb-2">Chưa có bình luận nào</h3>
            <p class="text-gray-400">Hãy là người đầu tiên chia sẻ cảm nhận về bộ phim này!</p>
          </div>
        </div>

        <!-- Toast notification -->
        <div v-if="toastMessage" class="fixed bottom-6 right-6 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-xl px-6 py-4 shadow-2xl z-50 animate-fade-in">
          <p class="text-white font-medium">{{ toastMessage }}</p>
        </div>

      </div>

      <!-- Loading state -->
      <div v-else class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <div class="relative w-20 h-20 mx-auto mb-6">
            <div class="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Đang tải phim...</h2>
          <p class="text-gray-400">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMovieStore } from '../stores/movieStore';
import NavBar from '../components/NavBar.vue';

import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

const loadingPage = ref(true);
const loadingEpisode = ref(false);
const toastMessage = ref('');
const playerFrame = ref(null);

onMounted(async () => {
  const slug = route.params.slug; 
  await movieStore.getMovieDetail(slug);
  await new Promise(resolve => setTimeout(resolve, 1000));
  loadingPage.value = false;
});

const movie = computed(() => movieStore.movieDetail?.data?.item || null);

// Back to movie detail handler
function goBackToDetail1() {
  router.push({ path: `/movie/${movie.value.slug}` });
}

// Episode management
const currentEpisode = ref(0);

const currentEpisodeLink = computed(() => {
  if (!movie.value?.episodes?.[0]?.server_data) return '';
  return movie.value.episodes[0].server_data[currentEpisode.value]?.link_embed || '';
});

// Back to movie detail handler
function goBackToDetail() {
  router.push({ path: `/movie/${movie.value.slug}` });
}

// Episode selection handler
async function handleClick(index) {
  if (index === currentEpisode.value) return;
  
  loadingEpisode.value = true;
  currentEpisode.value = index;
  
  const episodeName = movie.value.episodes[0].server_data[index].name;
  toastMessage.value = `🎬 Đang phát ${episodeName}`;
  
  // Show toast for 3 seconds
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000);
  
  await new Promise(resolve => setTimeout(resolve, 800));
  loadingEpisode.value = false;
  
  await nextTick();
  playerFrame.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Image URL handler
const getImageUrl = (url) => {
  const cdn = 'https://img.ophim.live';
  if (!url) return '';
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`;
};

// Watch for route changes
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    loadingPage.value = true;
    await movieStore.getMovieDetail(newSlug);
    currentEpisode.value = 0;
    toastMessage.value = '';
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadingPage.value = false;
  }
});
</script>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom focus styles */
button:focus {
  outline: 2px solid rgba(239, 68, 68, 0.5);
  outline-offset: 2px;
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Enhanced hover effects */
.group:hover {
  transform: translateZ(0); /* Enable hardware acceleration */
}

/* Loading spinner enhancement */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
  }
}

.animate-spin {
  animation: spin 1s linear infinite, pulse-glow 2s ease-in-out infinite;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .aspect-video {
    border-radius: 1rem;
  }
}

/* Dark theme enhancements */
.bg-gray-800\/50 {
  background-color: rgba(31, 41, 55, 0.5);
}

/* Custom gradient text */
.bg-gradient-to-r.from-white.via-gray-100.to-gray-300 {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Episode grid responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .sm\:grid-cols-4 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>