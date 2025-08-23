<template>
  <div class="fixed top-0 z-50 h-20 bg-primary-dark w-full flex items-center justify-center ">
    <div class="w-full max-w-[1536px] mx-auto px-6">
      <nav class="flex justify-center items-center  py-4 font-semibold  text-white">
        <!-- Menu trái -->
        <ul class="flex gap-6">
          <li>
  <router-link
    to="/"
    class="nav-link relative text-white 
      after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
      after:bg-secondary after:transition-all after:duration-300
      hover:after:w-full"
  >
    Home
  </router-link>
</li>

          <li>
    <router-link
      to="/genre"
      class="nav-link relative text-white
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
        after:bg-secondary after:transition-all after:duration-300
        hover:after:w-full"
    >
      Genre
    </router-link>
  </li>
          <li>
    <router-link
      to="/country"
      class="nav-link relative text-white
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
        after:bg-secondary after:transition-all after:duration-300
        hover:after:w-full"
    >
      Country
    </router-link>
  </li>
        </ul>

        <!-- Search -->

          <SearchBox />

        <!-- Menu phải -->
        <ul class="flex gap-6 ">
          <li><router-link to="/movies" class="nav-link relative text-white
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
        after:bg-secondary after:transition-all after:duration-300
        hover:after:w-full">Movies</router-link></li>
          <li><router-link to="/series" class="nav-link relative text-white
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
        after:bg-secondary after:transition-all after:duration-300
        hover:after:w-full">Series</router-link></li>
          <li><router-link to="/animation" class="nav-link relative text-white
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
        after:bg-secondary after:transition-all after:duration-300
        hover:after:w-full">Animation</router-link></li>
          <li><router-link to="/login" class="nav-link relative text-white
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
        after:bg-secondary after:transition-all after:duration-300
        hover:after:w-full">Login</router-link></li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script setup>
import SearchBox from './SearchBox.vue';
</script>
<style scoped>

</style>
