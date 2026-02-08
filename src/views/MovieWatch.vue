<template>
  <div class="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-amber-500/30">
    <NavBar />

    <!-- Immersive Player Section -->
    <div class="relative w-full bg-black pt-20 pb-8 md:pt-24 md:pb-12 shadow-2xl z-10 overflow-hidden">
      <!-- Dynamic Background Glow -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-amber-600/10 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
        <div class="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-yellow-600/5 rounded-full blur-[100px] opacity-30 animate-float"></div>
        <div class="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[100px] opacity-30 animate-float-delayed"></div>
      </div>

      <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Breadcrumb / Back Navigation -->
        <div class="flex items-center gap-2 mb-6 text-sm text-gray-400">
          <button 
            @click="goBackToDetail"
            class="flex items-center gap-2 hover:text-amber-400 transition-colors group"
          >
            <div class="p-1 rounded-full bg-white/5 group-hover:bg-amber-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </div>
            <span>Quay lại thông tin phim</span>
          </button>
          <span class="text-gray-600">/</span>
          <span class="text-gray-200 truncate max-w-[200px] md:max-w-md">{{ movie?.name }}</span>
          <span class="text-gray-600">/</span>
          <span class="text-amber-500 font-medium">Tập {{ currentEpisode + 1 }}</span>
        </div>

        <!-- Player Container -->
        <div class="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <!-- Main Player Area (3 cols) -->
          <div class="lg:col-span-3">
            <div class="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] border border-amber-500/10 group">
              <!-- Ambient Light Effect -->
              <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <!-- Video Player (Artplayer) -->
              <VideoPlayer
                v-if="videoUrl && isM3U8"
                :option="playerOptions"
                class="w-full h-full z-20 relative rounded-xl overflow-hidden"
              />
              
              <!-- Fallback Iframe -->
              <iframe
                v-else-if="videoUrl"
                :src="videoUrl"
                allowfullscreen
                class="w-full h-full z-20 relative"
                frameborder="0"
                ref="playerFrame"
              ></iframe>

              <!-- Empty State -->
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-500 z-10">
                <div class="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                </div>
                <p class="text-lg font-medium text-gray-400">Chọn tập phim để bắt đầu xem</p>
              </div>

              <!-- Loading Overlay -->
              <div v-if="loadingEpisode" class="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 transition-opacity duration-300">
                <div class="relative w-16 h-16 mb-4">
                  <div class="absolute inset-0 border-4 border-red-900/30 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full animate-spin-slow"></div>
                  <div class="absolute inset-3 border-4 border-red-900/20 rounded-full"></div>
                  <div class="absolute inset-3 border-4 border-transparent border-b-red-500 rounded-full animate-spin-reverse"></div>
                </div>
                <p class="text-red-500 font-bold animate-pulse tracking-wide">{{ toastMessage || 'Đang tải tập phim...' }}</p>
              </div>
            </div>

            <!-- Player Controls / Info -->
            <div class="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  {{ movie?.name }}
                  <span class="px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20">HD</span>
                </h1>
                <p class="text-gray-400 text-lg">{{ movie?.origin_name }}</p>
              </div>
              
              <div class="flex items-center gap-3">
                <button class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 rounded-lg transition-all duration-300 text-sm font-medium group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </svg>
                  <span class="group-hover:text-white transition-colors">Chia sẻ</span>
                </button>
                <button class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 rounded-lg transition-all duration-300 text-sm font-bold text-black shadow-lg shadow-amber-600/20 hover:shadow-amber-500/40 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Thêm vào DS
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar (Episodes & Info) -->
          <div class="lg:col-span-1 flex flex-col h-full">
            <div class="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full max-h-[600px] lg:max-h-[calc(100vh-150px)] sticky top-24 shadow-xl">
              <!-- Sidebar Header -->
              <div class="p-4 border-b border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center">
                <h3 class="text-lg font-bold flex items-center gap-2 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Danh sách tập
                </h3>
                <span class="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-white/5">{{ movie?.episode_total || '?' }} tập</span>
              </div>

              <!-- Episode Grid -->
              <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <div class="grid grid-cols-4 lg:grid-cols-3 gap-2">
                  <button
                    v-for="(ep, index) in movie?.episodes?.[0]?.server_data"
                    :key="index"
                    @click="handleClick(index)"
                    :class="[
                      'relative px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border group overflow-hidden',
                      currentEpisode === index
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-400/50 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105 z-10'
                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:border-amber-500/30 hover:text-white'
                    ]"
                  >
                    <span class="relative z-10">{{ ep.name }}</span>
                    <!-- Shine effect for active -->
                    <div v-if="currentEpisode === index" class="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-50"></div>
                    <!-- Hover glow -->
                    <div class="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Left Column: Info & Comments -->
        <div class="lg:col-span-2 space-y-10">
          <!-- Synopsis -->
          <section class="animate-fade-in-up">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-amber-400 to-yellow-600 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
              Nội dung phim
            </h3>
            <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 leading-relaxed text-gray-300 hover:border-amber-500/20 transition-colors duration-300 shadow-lg">
              {{ movie?.content }}
            </div>
          </section>

          <!-- Comments -->
          <section class="animate-fade-in-up delay-100">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              Bình luận
            </h3>
            <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 shadow-lg">
              <div class="flex gap-4 mb-6">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center shrink-0 shadow-inner border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-300">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="relative">
                    <textarea 
                      placeholder="Viết bình luận của bạn..." 
                      class="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all min-h-[100px] resize-y shadow-inner"
                    ></textarea>
                    <div class="absolute bottom-2 right-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex justify-end mt-3">
                    <button class="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black rounded-lg text-sm font-bold transition-all duration-300 shadow-lg shadow-amber-600/20 hover:shadow-amber-500/40 hover:-translate-y-0.5">
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div class="text-center py-12 border-t border-white/5">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </div>
                <p class="text-gray-500 font-medium">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Related Info -->
        <div class="lg:col-span-1 space-y-8 animate-fade-in-left">
          <!-- Movie Stats -->
          <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 shadow-lg hover:border-amber-500/20 transition-colors duration-300">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-amber-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Thông tin phim
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b border-white/5 group">
                <span class="text-gray-400 group-hover:text-gray-300 transition-colors">Trạng thái</span>
                <span class="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">{{ movie?.episode_current }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/5 group">
                <span class="text-gray-400 group-hover:text-gray-300 transition-colors">Năm phát hành</span>
                <span class="text-white font-medium">{{ movie?.year }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/5 group">
                <span class="text-gray-400 group-hover:text-gray-300 transition-colors">Thời lượng</span>
                <span class="text-white font-medium">{{ movie?.time }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-white/5 group">
                <span class="text-gray-400 group-hover:text-gray-300 transition-colors">Quốc gia</span>
                <span class="text-white font-medium">{{ movie?.country?.[0]?.name }}</span>
              </div>
              <div class="py-3">
                <span class="text-gray-400 block mb-3">Thể loại</span>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="cat in movie?.category" 
                    :key="cat.id"
                    class="px-3 py-1 bg-white/5 hover:bg-amber-500/10 rounded-full text-xs text-gray-300 hover:text-amber-400 border border-white/5 hover:border-amber-500/30 transition-all duration-300 cursor-default"
                  >
                    {{ cat.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '../stores/movieStore';
import NavBar from '../components/NavBar.vue';
import VideoPlayer from '../components/VideoPlayer.vue';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

const loadingPage = ref(true);
const loadingEpisode = ref(false);
const toastMessage = ref('');
const playerFrame = ref(null);
const currentEpisode = ref(0);

onMounted(async () => {
  const slug = route.params.slug; 
  await movieStore.getMovieDetail(slug);
  loadingPage.value = false;
});

const movie = computed(() => movieStore.movieDetail?.data?.item || null);

const currentEpisodeData = computed(() => {
  return movie.value?.episodes?.[0]?.server_data[currentEpisode.value];
});

const videoUrl = computed(() => {
  // Prioritize m3u8 for Artplayer, fallback to embed for iframe
  return currentEpisodeData.value?.link_m3u8 || currentEpisodeData.value?.link_embed || '';
});

const isM3U8 = computed(() => {
  return videoUrl.value?.includes('.m3u8');
});

const playerOptions = computed(() => ({
  url: videoUrl.value,
  poster: movie.value?.poster_url || movie.value?.thumb_url,
  title: `${movie.value?.name} - Tập ${currentEpisodeData.value?.name}`,
  volume: 0.7,
  isLive: false,
  muted: false,
  autoplay: true,
  pip: true,
  autoSize: false,
  autoMini: true,
  screenshot: true,
  setting: true,
  loop: false,
  flip: true,
  playbackRate: true,
  aspectRatio: true,
  fullscreen: true,
  fullscreenWeb: true,
  subtitleOffset: true,
  miniProgressBar: true,
  mutex: true,
  backdrop: true,
  playsInline: true,
  autoPlayback: true,
  airplay: true,
  theme: '#F59E0B',
  lang: 'vi',
  icons: {
    loading: '<img src="/loading.svg" width="50">'
  }
}));

function goBackToDetail() {
  if (movie.value?.slug) {
    router.push({ path: `/movie/${movie.value.slug}` });
  } else {
    router.push('/');
  }
}

async function handleClick(index) {
  if (index === currentEpisode.value) return;
  
  loadingEpisode.value = true;
  currentEpisode.value = index;
  
  const episodeName = movie.value.episodes[0].server_data[index].name;
  toastMessage.value = `Đang tải tập ${episodeName}...`;
  
  // Simulate loading delay for smoother UX
  await new Promise(resolve => setTimeout(resolve, 800));
  loadingEpisode.value = false;
  toastMessage.value = '';
  
  await nextTick();
  playerFrame.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    loadingPage.value = true;
    await movieStore.getMovieDetail(newSlug);
    currentEpisode.value = 0;
    loadingPage.value = false;
  }
});
</script>

<style scoped>
/* Custom Scrollbar for Sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.4);
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 1.5s linear infinite;
}

@keyframes spin-reverse {
  to { transform: rotate(-360deg); }
}

.animate-spin-reverse {
  animation: spin-reverse 2s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 12s ease-in-out infinite reverse;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in-left {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in-left {
  animation: fade-in-left 0.6s ease-out forwards;
}

.delay-100 {
  animation-delay: 0.1s;
}
</style>