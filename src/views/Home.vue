<template>
  <div class="flex flex-col justify-center bg-primary-dark items-center">
    <!-- NavBar -->
    <NavBar />

    <!-- Thêm khoảng trống để tránh bị che bởi fixed -->
    <div class="h-15"></div> 

    <!-- Banner full width -->
    <Banner />

    <!-- Các phần khác -->
    <RecentlyUpdate />
    <NewMovie title="Phim Chiếu Rạp" category="phim-chieu-rap" />
    <NewMovie title="Phim Bộ" category="phim-bo" />
    <NewMovie title="Phim Lẻ" category="phim-le" />
    <NewMovie title="Hoạt Hình" category="hoat-hinh" />

    <FooterWeb />
   

  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import Banner from '../components/Banner.vue';
import RecentlyUpdate from '../components/RecentlyUpdate.vue';
import NewMovie from '../components/NewMovie.vue';

import FooterWeb from '../components/FooterWeb.vue';


</script>
