<template>
  <div class="filters-container bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8 shadow-xl animate-fade-in-up">
    <div class="flex flex-col gap-6">
      <!-- Filter Controls Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Year Filter -->
        <div class="flex-1 group">
          <label class="text-gray-400 text-sm font-medium mb-2 block group-hover:text-red-500 transition-colors">Năm phát hành</label>
          <div class="relative">
            <select 
              v-model="localFilters.year"
              class="w-full bg-black/50 text-white border border-white/10 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 cursor-pointer hover:bg-black/70"
            >
              <option value="" class="bg-[#1a1a1a] text-white">Tất cả năm</option>
              <option v-for="year in years" :key="year" :value="year" class="bg-[#1a1a1a] text-white">{{ year }}</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <!-- Country Filter -->
        <div class="flex-1 group">
          <label class="text-gray-400 text-sm font-medium mb-2 block group-hover:text-red-500 transition-colors">Quốc gia</label>
          <div class="relative">
            <select 
              v-model="localFilters.country"
              class="w-full bg-black/50 text-white border border-white/10 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 cursor-pointer hover:bg-black/70"
            >
              <option value="" class="bg-[#1a1a1a] text-white">Tất cả quốc gia</option>
              <option v-for="country in countries" :key="country.slug" :value="country.slug" class="bg-[#1a1a1a] text-white">
                {{ country.name }}
              </option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <!-- Genre Filter -->
        <div v-if="showGenre" class="flex-1 group">
          <label class="text-gray-400 text-sm font-medium mb-2 block group-hover:text-red-500 transition-colors">Thể loại phim</label>
          <div class="relative">
            <select 
              v-model="localFilters.genre"
              class="w-full bg-black/50 text-white border border-white/10 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 cursor-pointer hover:bg-black/70"
            >
              <option value="" class="bg-[#1a1a1a] text-white">Tất cả thể loại</option>
              <option v-for="genre in genres" :key="genre.slug" :value="genre.slug" class="bg-[#1a1a1a] text-white">
                {{ genre.name }}
              </option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <!-- Sort Filter -->
        <div class="flex-1 group">
          <label class="text-gray-400 text-sm font-medium mb-2 block group-hover:text-red-500 transition-colors">Sắp xếp theo</label>
          <div class="relative">
            <select 
              v-model="localFilters.sort"
              class="w-full bg-black/50 text-white border border-white/10 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 cursor-pointer hover:bg-black/70"
            >
              <option value="latest" class="bg-[#1a1a1a] text-white">Mới cập nhật</option>
              <option value="year" class="bg-[#1a1a1a] text-white">Năm phát hành</option>
              <option value="name" class="bg-[#1a1a1a] text-white">Tên phim (A-Z)</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex items-center gap-4 justify-end pt-2 border-t border-white/5 mt-2">
        <button 
          @click="resetFilters"
          class="px-6 py-3 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 group"
        >
          <svg class="w-5 h-5 transition-transform duration-300 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Đặt lại
        </button>

        <button 
          @click="applyFilters"
          class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white border-0 rounded-xl transition-all duration-300 font-bold flex items-center gap-2 shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 group"
        >
          <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Lọc Phim
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ year: '', country: '', genre: '', sort: 'latest' })
  },
  showGenre: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'filter-change'])

const localFilters = reactive({
  year: props.modelValue.year || '',
  country: props.modelValue.country || '',
  genre: props.modelValue.genre || '',
  sort: props.modelValue.sort || 'latest'
})

// Generate years from current year back to 1990
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

// Common countries
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

// Common genres
const genres = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
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

function applyFilters() {
  emit('update:modelValue', { ...localFilters })
  emit('filter-change', { ...localFilters })
}

function resetFilters() {
  localFilters.year = ''
  localFilters.country = ''
  localFilters.genre = ''
  localFilters.sort = 'latest'
  applyFilters()
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
}, { deep: true })
</script>

<style scoped>
/* Custom Fade In Animation */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure background is dark for option elements */
select option {
  background-color: #1a1a1a;
  color: white;
  padding: 8px;
}
</style>
