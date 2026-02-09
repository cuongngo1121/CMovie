<template>
  <div class="flex flex-col justify-start bg-primary-dark w-full min-h-screen">
    <!-- NavBar -->
    <NavBar />

    <!-- Banner full width -->
    <Banner />

    <!-- Trending Section (Grid Layout) -->
    <TrendingSection v-reveal />

    <!-- Recently Updated (Slider) -->
    <RecentlyUpdate v-reveal />

    <!-- Animation Showcase (Premium Slider) -->
    <AnimationShowcase v-reveal />

    <!-- Movie Categories (Sliders) -->
    <div class="w-full space-y-8 md:space-y-12 py-8 md:py-12 bg-gradient-to-b from-gray-900 to-black">
      <NewMovie v-reveal title="Phim Chiếu Rạp" category="phim-chieu-rap" />
      <NewMovie v-reveal title="Phim Bộ Hot" category="phim-bo" />
      <NewMovie v-reveal title="Phim Lẻ Mới" category="phim-le" />
    </div>

    <FooterWeb />
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import Banner from '../components/Banner.vue'
import RecentlyUpdate from '../components/RecentlyUpdate.vue'
import NewMovie from '../components/NewMovie.vue'
import AnimationShowcase from '../components/AnimationShowcase.vue'
import TrendingSection from '../components/TrendingSection.vue'
import FooterWeb from '../components/FooterWeb.vue'
</script>
