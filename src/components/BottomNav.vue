<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
    <!-- Clean dark bar -->
    <div class="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
      <div class="flex items-center justify-around h-14 max-w-md mx-auto pb-safe">
        <!-- Nav Items -->
        <router-link 
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          v-slot="{ isActive }"
          custom
        >
          <button
            @click="navigate(item.path)"
            :class="[
              'flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors',
              isActiveRoute(item.path) ? 'text-red-500' : 'text-gray-500 active:text-gray-300'
            ]"
          >
            <component :is="item.icon" :active="isActiveRoute(item.path)" />
            <span class="text-[10px] font-medium">{{ item.label }}</span>
          </button>
        </router-link>

        <!-- Menu -->
        <button 
          @click="openMenu"
          class="flex flex-col items-center justify-center gap-0.5 w-14 h-full text-gray-500 active:text-gray-300 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span class="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['open-menu'])

function isActiveRoute(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigate(path) {
  router.push(path)
}

function openMenu() {
  window.dispatchEvent(new Event('toggle-mobile-menu'))
}

// Slim icon components
const HomeIcon = {
  props: ['active'],
  render() {
    return h('svg', { 
      class: 'w-5 h-5', 
      fill: this.active ? 'currentColor' : 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      'stroke-width': this.active ? '0' : '1.5'
    }, [
      h('path', { 
        d: this.active 
          ? 'M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z'
          : 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      this.active ? h('path', { d: 'M12 5.432l8.159 8.159c.03.03.06.058.091.088v6.198c0 1.035-.84 1.875-1.875 1.875H15.75v-4.5c0-.621-.504-1.125-1.125-1.125h-5.25c-.621 0-1.125.504-1.125 1.125v4.5H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a.753.753 0 00.091-.088L12 5.432z' }) : null
    ])
  }
}

const SearchIcon = {
  props: ['active'],
  render() {
    return h('svg', { 
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      'stroke-width': this.active ? '2.5' : '1.5'
    }, [
      h('path', { 
        d: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const FilterIcon = {
  props: ['active'],
  render() {
    return h('svg', { 
      class: 'w-5 h-5', 
      fill: this.active ? 'currentColor' : 'none', 
      stroke: this.active ? 'none' : 'currentColor', 
      viewBox: '0 0 24 24',
      'stroke-width': '1.5'
    }, [
      h('path', { 
        d: this.active
          ? 'M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z'
          : 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }
}

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/tim-kiem', label: 'Tìm kiếm', icon: SearchIcon },
  { path: '/movies', label: 'Lọc Phim', icon: FilterIcon },
]
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
