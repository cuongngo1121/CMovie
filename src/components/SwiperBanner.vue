<template>
  <swiper
    :slides-per-view="1"
      :modules="[Autoplay, Pagination]"
    :loop="true"
   :pagination="{ clickable: true }"
    class="mySwiper"
    :autoplay="{
    delay: 3000,
    disableOnInteraction: false
  }"
  >
    <swiper-slide
      v-for="(movie, index) in movies"
      :key="index"
      class="movie-slide relative"
    >
      <img
        class="poster "
        :src="getImageUrl(movie.thumb_url)"
        :alt="movie.name"
      >
      <div class=" absolute flex flex-col gap-6 text-white bottom-1/5 left-0 right-0  ">
        <div class="btn flex   justify-center gap-4">
          <ViewDetailBtn
            @click="goToMovieWatch(movie)"
          />
          <ViewDetailBtn
          label="Detail"
            @click="goToMovieDetails(movie)"
          />
         
        </div>
        <div class="des flex flex-col items-center mt-4 gap-6">
          <p class="font-bold text-3xl" >{{ movie.name }}</p>
          <div class="flex gap-6 text-lg justify-center">
             <p class=" rounded-xl p-2 bg-secondary text-primary ">{{ movie.year }}</p>
            <p class=" rounded-xl p-2 bg-secondary text-primary ">{{ movie.time }}</p>
          <p class=" rounded-xl p-2 bg-secondary text-primary ">{{ movie.type }}</p>
          <p class=" rounded-xl p-2 bg-secondary text-primary ">{{ movie.lang }}</p>
          </div>
         
        </div>
      
      
      </div>
    </swiper-slide>

    <div class="swiper-pagination"></div>
  </swiper>
</template>

<script setup>
import ViewDetailBtn from './ViewDetailBtn.vue'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import  'swiper/css/autoplay'
import { onMounted, computed } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import { Pagination } from 'swiper/modules'
import { useRouter } from 'vue-router'


const movieStore = useMovieStore()
const router = useRouter()

onMounted(() => {
  movieStore.getNewMovies()
})

const getImageUrl = (url) => {
  const cdn = 'https://img.ophim.live'
  if (!url) return ''
  return url.startsWith('http') ? url : `${cdn}/uploads/movies/${encodeURIComponent(url)}`
}

const movies = computed(() => {
  const items = movieStore.movies?.data?.items
  console.log('🎬 Movies loaded:', items)
  return Array.isArray(items) ? items.slice(0, 4) : []
})

const movieDetail = computed(() => {
  
})

const onSwiper = (swiper) => {
  console.log('Swiper instance:', swiper)
}

const onSlideChange = () => {
  console.log('Slide changed')
}
function goToMovieDetails(movie) {
  // Navigate to the movie details page
  console.log('Navigating to movie details for slug:', movie.slug)
  // You can use Vue Router to navigate to the movie details page
  router.push({ path: `/movie/${movie.slug}` }, { params: { slug: movie.slug } })
}
function goToMovieWatch(movie) {
  // Navigate to the watch movie page
  console.log('Navigating to watch movie for slug:', movie.slug)
  // You can use Vue Router to navigate to the watch movie page
  router.push({ path: `/watch/${movie.slug}` }, { params: { slug: movie.slug } })
}

</script>
<style >
.movie-slide {
  text-align: center;
  padding: 10px;
}
.poster {
  width: 100%;
  height: 740px;
  border-radius: 8px;
  object-fit: cover;
  object-position: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
}
.origin,
.year,
.category {
  font-size: 14px;
  color: #666;
}
.swiper-pagination {
  bottom: 10px;
}
.swiper-pagination-bullet {
  width: 16px;   /* dài */
  height: 16px;   /* cao */
  background: #fff;
  opacity: 1;
  border-radius: 10px; /* bo tròn thành elip */
}

.swiper-pagination-bullet-active {
  background: red !important;
  width: 40px;
}

.swiper-pagination-bullet:hover {
  background: #ff0000;
}

</style>
