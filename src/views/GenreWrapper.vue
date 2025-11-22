<template>
  <Genre :initialSlug="genreSlug" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Genre from './Genre.vue'

const route = useRoute()
const genreSlug = computed(() => route.params.slug)
</script>
