<template>
  <div>
    <!-- Desktop Filters — compact inline bar -->
    <div class="hidden lg:block mb-8">
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Type -->
        <div class="filter-select-wrapper">
          <select v-model="localFilters.type" class="filter-select">
            <option value="">Tất cả loại</option>
            <option value="phim-le">Phim Lẻ</option>
            <option value="phim-bo">Phim Bộ</option>
            <option value="hoat-hinh">Hoạt Hình</option>
            <option value="tv-shows">TV Shows</option>
          </select>
          <svg class="filter-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        <!-- Year -->
        <div class="filter-select-wrapper">
          <select v-model="localFilters.year" class="filter-select">
            <option value="">Tất cả năm</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
          <svg class="filter-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        <!-- Country -->
        <div class="filter-select-wrapper">
          <select v-model="localFilters.country" class="filter-select">
            <option value="">Tất cả quốc gia</option>
            <option v-for="country in countries" :key="country.slug" :value="country.slug">{{ country.name }}</option>
          </select>
          <svg class="filter-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        <!-- Genre -->
        <div v-if="showGenre" class="filter-select-wrapper">
          <select v-model="localFilters.genre" class="filter-select">
            <option value="">Tất cả thể loại</option>
            <option v-for="genre in genres" :key="genre.slug" :value="genre.slug">{{ genre.name }}</option>
          </select>
          <svg class="filter-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        <!-- Sort -->
        <div class="filter-select-wrapper">
          <select v-model="localFilters.sort" class="filter-select">
            <option value="latest">Mới cập nhật</option>
            <option value="year">Năm phát hành</option>
            <option value="name">Tên phim (A-Z)</option>
          </select>
          <svg class="filter-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        <!-- Reset (only shown when filters are active) -->
        <button 
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Đặt lại
        </button>
      </div>
    </div>

    <!-- Mobile Filters Button -->
    <div class="lg:hidden mb-4">
      <button 
        @click="isOpen = true"
        class="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white font-medium active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <span class="p-2 bg-red-600/20 rounded-lg text-red-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </span>
          <span>Bộ lọc</span>
          <span v-if="activeFilterCount > 0" class="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">{{ activeFilterCount }}</span>
        </div>
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Mobile Filters Drawer -->
      <Teleport to="body">
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-full"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-full"
        >
          <div v-if="isOpen" class="fixed inset-0 z-[60] flex flex-col bg-[#111] lg:hidden">
            <!-- Header -->
            <div class="px-4 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 class="text-lg font-bold text-white">Bộ lọc</h2>
              <button @click="isOpen = false" class="p-2 -mr-2 text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-4 space-y-5">
              <div>
                <label class="text-gray-400 text-sm font-medium mb-2 block">Loại phim</label>
                <select v-model="localFilters.type" class="mobile-select">
                  <option value="">Tất cả loại</option>
                  <option value="phim-le">Phim Lẻ</option>
                  <option value="phim-bo">Phim Bộ</option>
                  <option value="hoat-hinh">Hoạt Hình</option>
                  <option value="tv-shows">TV Shows</option>
                </select>
              </div>

              <div>
                <label class="text-gray-400 text-sm font-medium mb-2 block">Năm</label>
                <select v-model="localFilters.year" class="mobile-select">
                  <option value="">Tất cả năm</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>

              <div>
                <label class="text-gray-400 text-sm font-medium mb-2 block">Quốc gia</label>
                <select v-model="localFilters.country" class="mobile-select">
                  <option value="">Tất cả quốc gia</option>
                  <option v-for="country in countries" :key="country.slug" :value="country.slug">{{ country.name }}</option>
                </select>
              </div>

              <div v-if="showGenre">
                <label class="text-gray-400 text-sm font-medium mb-2 block">Thể loại</label>
                <select v-model="localFilters.genre" class="mobile-select">
                  <option value="">Tất cả thể loại</option>
                  <option v-for="genre in genres" :key="genre.slug" :value="genre.slug">{{ genre.name }}</option>
                </select>
              </div>

              <div>
                <label class="text-gray-400 text-sm font-medium mb-2 block">Sắp xếp</label>
                <select v-model="localFilters.sort" class="mobile-select">
                  <option value="latest">Mới cập nhật</option>
                  <option value="year">Năm phát hành</option>
                  <option value="name">Tên phim (A-Z)</option>
                </select>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-white/10 flex gap-3 pb-safe">
              <button 
                @click="resetFilters"
                class="flex-1 py-3.5 bg-white/10 text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Đặt lại
              </button>
              <button 
                @click="isOpen = false"
                class="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl active:scale-[0.98] transition-transform"
              >
                Đóng
              </button>
            </div>
          </div>
        </transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ type: '', year: '', country: '', genre: '', sort: 'latest' })
  },
  showGenre: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'filter-change'])
const isOpen = ref(false)

const localFilters = reactive({
  type: props.modelValue.type || '',
  year: props.modelValue.year || '',
  country: props.modelValue.country || '',
  genre: props.modelValue.genre || '',
  sort: props.modelValue.sort || 'latest'
})

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

const countries = [
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Thái Lan', slug: 'thai-lan' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Việt Nam', slug: 'viet-nam' },
  { name: 'Ấn Độ', slug: 'an-do' },
  { name: 'Hồng Kông', slug: 'hong-kong' },
  { name: 'Đài Loan', slug: 'dai-loan' }
]

const genres = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
  { name: 'Hoạt Hình', slug: 'hoat-hinh' },
  { name: 'Cổ Trang', slug: 'co-trang' },
  { name: 'Tâm Lý', slug: 'tam-ly' },
  { name: 'Hình Sự', slug: 'hinh-su' },
  { name: 'Chiến Tranh', slug: 'chien-tranh' },
  { name: 'Thể Thao', slug: 'the-thao' },
  { name: 'Võ Thuật', slug: 'vo-thuat' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { name: 'Phiêu Lưu', slug: 'phieu-luu' },
  { name: 'Khoa Học', slug: 'khoa-hoc' },
  { name: 'Kinh Dị', slug: 'kinh-di' },
  { name: 'Âm Nhạc', slug: 'am-nhac' },
  { name: 'Gia Đình', slug: 'gia-dinh' },
  { name: 'Học Đường', slug: 'hoc-duong' }
]

const hasActiveFilters = computed(() => {
  return localFilters.type || localFilters.year || localFilters.country || localFilters.genre || localFilters.sort !== 'latest'
})

const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.type) count++
  if (localFilters.year) count++
  if (localFilters.country) count++
  if (localFilters.genre) count++
  if (localFilters.sort !== 'latest') count++
  return count
})

// Auto-apply on any filter change (Netflix-style)
watch(localFilters, () => {
  emit('update:modelValue', { ...localFilters })
  emit('filter-change', { ...localFilters })
}, { deep: true })

function resetFilters() {
  localFilters.type = ''
  localFilters.year = ''
  localFilters.country = ''
  localFilters.genre = ''
  localFilters.sort = 'latest'
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
}, { deep: true })
</script>

<style scoped>
/* Desktop compact filter selects */
.filter-select-wrapper {
  position: relative;
}

.filter-select {
  appearance: none;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  outline: none;
}

.filter-select:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-select:focus {
  border-color: #ef4444;
}

.filter-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #6B7280;
  pointer-events: none;
}

/* Mobile select */
.mobile-select {
  width: 100%;
  appearance: none;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  outline: none;
}

.mobile-select:focus {
  border-color: #ef4444;
}

/* Option styling */
select option {
  background-color: #1a1a1a;
  color: white;
  padding: 8px;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
