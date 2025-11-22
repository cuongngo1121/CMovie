<template>
  <div class="flex flex-col justify-center bg-primary-dark items-center w-full">
    <!-- NavBar -->
    <NavBar />

    <!-- Thêm khoảng trống để tránh bị che bởi fixed -->
    <div class="h-15"></div> 

    <!-- Banner full width -->
    <Banner />

    <!-- Trending Section (Grid Layout) -->
    <TrendingSection />

    <!-- Recently Updated (Slider) -->
    <RecentlyUpdate />

    <!-- Animation Showcase (Premium Slider) -->
    <AnimationShowcase />

    <!-- Movie Categories (Sliders) -->
    <div class="w-full space-y-12 py-12 bg-gradient-to-b from-gray-900 to-black">
      <NewMovie title="Phim Chiếu Rạp" category="phim-chieu-rap" />
      <NewMovie title="Phim Bộ Hot" category="phim-bo" />
      <NewMovie title="Phim Lẻ Mới" category="phim-le" />
    </div>

    <FooterWeb />
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import Banner from '../components/Banner.vue';
import RecentlyUpdate from '../components/RecentlyUpdate.vue';
import NewMovie from '../components/NewMovie.vue';
import AnimationShowcase from '../components/AnimationShowcase.vue';
import TrendingSection from '../components/TrendingSection.vue';
import FooterWeb from '../components/FooterWeb.vue';
</script>
