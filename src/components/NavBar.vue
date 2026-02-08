<template>
  <nav :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent border-b border-transparent'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16 gap-6">
        <!-- LOGO -->
        <router-link to="/" class="group shrink-0">
          <div class="flex flex-col">
            <span class="text-2xl font-black text-red-600 tracking-tighter hover:text-red-500 transition-colors duration-300">
              PHIM CHÙA
            </span>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-1">
          <router-link
            v-for="item in mainMenuItems"
            :key="item.link"
            :to="item.link"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            active-class="text-white bg-white/10"
          >
            {{ item.name }}
          </router-link>

          <!-- Dropdowns -->
          <div class="flex items-center gap-1 ml-1">
            <div class="w-px h-4 bg-white/10 mx-2"></div>
            
            <!-- Thể Loại -->
            <div class="relative group">
              <button class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <span>Thể Loại</span>
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div class="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left translate-y-2 group-hover:translate-y-0">
                <div class="w-96 p-4 bg-[#111] border border-white/10 rounded-xl shadow-2xl grid grid-cols-3 gap-2">
                  <router-link
                    v-for="genre in genres"
                    :key="genre.slug"
                    :to="genre.link"
                    class="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-center"
                    active-class="text-red-500 bg-red-500/10"
                  >
                    {{ genre.name }}
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Quốc Gia -->
            <div class="relative group">
              <button class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <span>Quốc Gia</span>
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div class="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left translate-y-2 group-hover:translate-y-0">
                <div class="w-48 p-4 bg-[#111] border border-white/10 rounded-xl shadow-2xl flex flex-col gap-1">
                  <router-link
                    v-for="country in countries"
                    :key="country.slug"
                    :to="country.link"
                    class="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    active-class="text-red-500 bg-red-500/10"
                  >
                    {{ country.name }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Right Side: Search & Theme -->
        <div class="hidden lg:flex items-center gap-4">
          <div class="w-64 transition-all duration-300 focus-within:w-80">
             <SearchBox placeholder="Tìm kiếm phim..." />
          </div>
          
          <button 
            @click="toggleTheme" 
            class="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden ml-auto p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-show="isMobileMenuOpen" class="lg:hidden bg-[#111] border-t border-white/10">
        <div class="px-4 py-6 space-y-6">
          <!-- Search Mobile -->
          <div class="relative">
             <SearchBox placeholder="Tìm kiếm phim..." class="w-full" />
          </div>

          <div class="space-y-1">
            <router-link
              v-for="item in mainMenuItems"
              :key="item.link"
              :to="item.link"
              @click="closeMobileMenu"
              class="block px-4 py-3 rounded-xl text-base font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              active-class="text-red-500 bg-red-500/10"
            >
              {{ item.name }}
            </router-link>
          </div>

          <div class="border-t border-white/10 pt-6">
            <div class="grid grid-cols-2 gap-8">
              <div>
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Thể Loại</h3>
                <div class="space-y-2">
                  <router-link
                    v-for="genre in genres.slice(0, 5)"
                    :key="genre.slug"
                    :to="genre.link"
                    @click="closeMobileMenu"
                    class="block text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {{ genre.name }}
                  </router-link>
                </div>
              </div>
              <div>
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quốc Gia</h3>
                 <div class="space-y-2">
                  <router-link
                    v-for="country in countries"
                    :key="country.slug"
                    :to="country.link"
                    @click="closeMobileMenu"
                    class="block text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {{ country.name }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SearchBox from './SearchBox.vue'

const isMobileMenuOpen = ref(false)
const isDark = ref(true)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const mainMenuItems = [
  { name: 'Trang chủ', link: '/' },
  { name: 'Phim Bộ', link: '/danh-sach/phim-bo' },
  { name: 'Phim Lẻ', link: '/danh-sach/phim-le' },
  { name: 'Hoạt Hình', link: '/danh-sach/hoat-hinh' },
  { name: 'TV Shows', link: '/danh-sach/tv-shows' }
]

const genres = [
  { name: 'Hành Động', link: '/the-loai/hanh-dong', slug: 'hanh-dong' },
  { name: 'Tình Cảm', link: '/the-loai/tinh-cam', slug: 'tinh-cam' },
  { name: 'Hài Hước', link: '/the-loai/hai-huoc', slug: 'hai-huoc' },
  { name: 'Cổ Trang', link: '/the-loai/co-trang', slug: 'co-trang' },
  { name: 'Tâm Lý', link: '/the-loai/tam-ly', slug: 'tam-ly' },
  { name: 'Hình Sự', link: '/the-loai/hinh-su', slug: 'hinh-su' },
  { name: 'Kinh Dị', link: '/the-loai/kinh-di', slug: 'kinh-di' },
  { name: 'Võ Thuật', link: '/the-loai/vo-thuat', slug: 'vo-thuat' }
]

const countries = [
  { name: 'Trung Quốc', link: '/quoc-gia/trung-quoc', slug: 'trung-quoc' },
  { name: 'Hàn Quốc', link: '/quoc-gia/han-quoc', slug: 'han-quoc' },
  { name: 'Nhật Bản', link: '/quoc-gia/nhat-ban', slug: 'nhat-ban' },
  { name: 'Thái Lan', link: '/quoc-gia/thai-lan', slug: 'thai-lan' },
  { name: 'Âu Mỹ', link: '/quoc-gia/au-my', slug: 'au-my' },
  { name: 'Việt Nam', link: '/quoc-gia/viet-nam', slug: 'viet-nam' }
]

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('toggle-mobile-menu', toggleMobileMenu)
  initTheme()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('toggle-mobile-menu', toggleMobileMenu)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Scoped styles can remain empty or minimal */
</style>