<template>
  <div class="filters-container bg-bg-card border border-border rounded-xl p-4 md:p-6 mb-8">
    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <!-- Year Filter -->
      <div class="flex-1">
        <label class="text-text-muted text-sm mb-2 block">Năm</label>
        <select 
          v-model="localFilters.year"
          @change="emitFilters"
          class="w-full bg-bg-elevated text-primary border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors"
        >
          <option value="">Tất cả</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <!-- Country Filter -->
      <div class="flex-1">
        <label class="text-text-muted text-sm mb-2 block">Quốc gia</label>
        <select 
          v-model="localFilters.country"
          @change="emitFilters"
          class="w-full bg-bg-elevated text-primary border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors"
        >
          <option value="">Tất cả</option>
          <option v-for="country in countries" :key="country.slug" :value="country.slug">
            {{ country.name }}
          </option>
        </select>
      </div>

      <!-- Genre Filter (optional) -->
      <div v-if="showGenre" class="flex-1">
        <label class="text-text-muted text-sm mb-2 block">Thể loại</label>
        <select 
          v-model="localFilters.genre"
          @change="emitFilters"
          class="w-full bg-bg-elevated text-primary border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors"
        >
          <option value="">Tất cả</option>
          <option v-for="genre in genres" :key="genre.slug" :value="genre.slug">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Sort Filter -->
      <div class="flex-1">
        <label class="text-text-muted text-sm mb-2 block">Sắp xếp</label>
        <select 
          v-model="localFilters.sort"
          @change="emitFilters"
          class="w-full bg-bg-elevated text-primary border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors"
        >
          <option value="latest">Mới nhất</option>
          <option value="year">Năm phát hành</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>

      <!-- Reset Button -->
      <div class="flex items-end">
        <button 
          @click="resetFilters"
          class="px-4 py-2.5 bg-bg-elevated hover:bg-secondary hover:text-primary-dark text-text-secondary border border-border hover:border-secondary rounded-lg transition-all duration-200 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

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

function emitFilters() {
  emit('update:modelValue', { ...localFilters })
  emit('filter-change', { ...localFilters })
}

function resetFilters() {
  localFilters.year = ''
  localFilters.country = ''
  localFilters.genre = ''
  localFilters.sort = 'latest'
  emitFilters()
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
}, { deep: true })
</script>

<style scoped>
select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F59E0B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

select:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}
</style>
