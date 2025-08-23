<template>
  <div class="flex flex-col max-w-[1536px] mx-auto justify-center bg-primary-dark items-center">
    <!-- NavBar -->
    <NavBar />
    <div class="h-[72px]"></div>

    <!-- Nội dung phim -->
    <div v-if="movie" class="w-full">
      <!-- Trailer / Poster -->
      <div class="watching w-full max-w-[1536px] mx-auto px-4 lg:px-6">
        <div v-if="movie?.trailer_url" class="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <iframe
            :src="getYoutubeEmbedUrl(movie.trailer_url)"
            frameborder="0"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>

        <div v-else class="aspect-video bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
          <img
            :src="getImageUrl(movie.poster_url)"
            alt="Poster phim"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Thông tin mô tả -->
      <div class="description flex flex-col lg:flex-row gap-8 mt-10 w-full max-w-[1536px] mx-auto px-4 lg:px-6">
        <!-- Thumbnail -->
        <div class="w-full lg:w-[300px] aspect-[2/3] rounded-lg overflow-hidden shadow-md">
          <img
            :src="getImageUrl(movie.thumb_url)"
            alt="Thumbnail phim"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Movie Info -->
        <div class="flex flex-col gap-4 flex-1 text-white">
          <p class="text-3xl font-bold text-secondary">{{ movie.name }}</p>

          <ViewDetailBtn
            @click="goToMovieWatch(movie)"
            class="w-48"
            label=" Xem Ngay"
          />

          <div>
            <p class="text-lg font-semibold text-secondary mt-6">Nội dung:</p>
            <p class="text-gray-300 leading-relaxed">{{ movie.content }}</p>
          </div>

          <div class="flex gap-2">
            <p class="text-lg font-semibold text-secondary">Thể loại:</p>
            <p class="text-gray-300">{{ movie.category.map(cat => cat.name).join(', ') }}</p>
          </div>

          <div class="flex gap-2">
            <p class="text-lg font-semibold text-secondary">Quốc gia:</p>
            <p class="text-gray-300">{{ movie.country.map(c => c.name).join(', ') }}</p>
          </div>

          <div class="flex gap-2">
            <p class="text-lg font-semibold text-secondary">Năm phát hành:</p>
            <p class="text-gray-300">{{ movie.year }}</p>
          </div>

          <div class="flex gap-2">
            <p class="text-lg font-semibold text-secondary">Đạo diễn:</p>
            <p class="text-gray-300">{{ movie.director[0] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Đang tải -->
    <div v-else class="text-white text-center py-10">
      <p>Đang tải thông tin phim... ⏳</p>
    </div>
<!-- Bình luận -->
      <div
        class="comments w-full max-w-screen-lg mt-10 p-6 bg-gray-800/40 rounded-2xl shadow-inner"
      >
        <h2 class="text-xl md:text-2xl font-bold mb-4 text-secondary">💬 Bình luận về phim</h2>
        <div class="flex flex-col gap-3 text-gray-400">
          <p>Chưa có bình luận nào. Hãy là người đầu tiên để lại bình luận!</p>
        </div>
      </div>
    <!-- Có thể bạn sẽ thích -->
    <NewMovie
      v-if="movie"
      title="🎥 Có thể bạn sẽ thích"
      category="phim-moi"
    />
  </div>
</template>



<script setup>
 import NavBar from '../components/NavBar.vue';
 import { computed, onMounted, ref, watch } from 'vue';
 import { useMovieStore } from '../stores/movieStore';
 import ViewDetailBtn from '../components/ViewDetailBtn.vue';
 import NewMovie from '../components/NewMovie.vue';
 const movieStore = useMovieStore();


 import { useRoute, useRouter } from 'vue-router';

const route = useRoute();   // ✅ Lấy thông tin route hiện tại (params, query...)
const router = useRouter(); // ✅ Dùng để điều hướng (push, replace...)


 onMounted(() => {
   const slug = route.params.slug;
   movieStore.getMovieDetail(slug);
   console.log('Fetching movie details for slug:', slug);
    console.log('🎬 Movie detail:', movieStore.movieDetail?.data?.item);
   
 });
 
 const movie = computed(() => 
   movieStore.movieDetail?.data?.item || null
   
 );
 function getYoutubeEmbedUrl(url) {
  const regex = /(?:youtube\.com\/watch\\?v=|youtube\.com\/watch\\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return '';
}
watch(movie, (val) => {
  console.log('🎬 Movie đã cập nhật:', val);
});
const getImageUrl = (url) => {
  const cdn = 'https://img.ophim.live';
  if (!url) return '';
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`;
};

watch(() => route.params.slug, (newSlug) => {
  movieStore.getMovieDetail(newSlug);
  console.log('🔁 Route changed, fetching new movie:', newSlug);
});

function goToMovieWatch(movie) {
  if (!movie || !movie.slug) {
    console.warn('❌ Movie hoặc slug không tồn tại:', movie);
    return;
  }
  router.push({ name: 'MovieWatch', params: { slug: movie.slug } });
}


</script>

<style>

</style>