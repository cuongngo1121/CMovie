<template>
  <Country :initialSlug="countrySlug" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Country from './Country.vue'

const route = useRoute()
const countrySlug = computed(() => route.params.slug)
</script>
