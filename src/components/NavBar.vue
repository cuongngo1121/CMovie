<template>
  <div class="navbar-wrapper">
    <div class="navbar-container">
      <nav class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-text">Phim Chùa Premium</span>
        </router-link>

        <!-- Desktop Navigation -->
        <ul class="desktop-nav">
          <li>
            <router-link to="/" class="nav-item">Trang chủ</router-link>
          </li>
          <li>
            <router-link to="/movies" class="nav-item">Phim Lẻ</router-link>
          </li>
          <li>
            <router-link to="/series" class="nav-item">Phim Bộ</router-link>
          </li>
          <li>
            <router-link to="/animation" class="nav-item">Hoạt Hình</router-link>
          </li>
          
          <!-- Thể Loại Dropdown -->
          <li class="dropdown-container" @mouseenter="showGenres = true" @mouseleave="showGenres = false">
            <button class="nav-item dropdown-trigger">
              <span>Thể Loại</span>
              <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showGenres" class="dropdown-menu">
                <router-link v-for="genre in popularGenres" :key="genre.slug" 
                  :to="`/genre/${genre.slug}`" 
                  class="dropdown-item"
                  @click="showGenres = false">
                  {{ genre.name }}
                </router-link>
              </div>
            </transition>
          </li>

          <!-- Quốc Gia Dropdown -->
          <li class="dropdown-container" @mouseenter="showCountries = true" @mouseleave="showCountries = false">
            <button class="nav-item dropdown-trigger">
              <span>Quốc Gia</span>
              <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showCountries" class="dropdown-menu">
                <router-link v-for="country in popularCountries" :key="country.slug"
                  :to="`/country/${country.slug}`"
                  class="dropdown-item"
                  @click="showCountries = false">
                  {{ country.name }}
                </router-link>
              </div>
            </transition>
          </li>
        </ul>

        <!-- Right Actions -->
        <div class="nav-actions">
          <SearchBox />
          
          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="mobile-menu-btn">
            <svg v-if="!isMobileMenuOpen" class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-slide">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-content">
          <router-link to="/" @click="closeMobileMenu" class="mobile-nav-item">Trang chủ</router-link>
          <router-link to="/movies" @click="closeMobileMenu" class="mobile-nav-item">Phim Lẻ</router-link>
          <router-link to="/series" @click="closeMobileMenu" class="mobile-nav-item">Phim Bộ</router-link>
          <router-link to="/animation" @click="closeMobileMenu" class="mobile-nav-item">Hoạt Hình</router-link>
          
          <!-- Mobile Genres -->
          <div class="mobile-section">
            <div class="mobile-section-title">Thể Loại</div>
            <div class="mobile-section-grid">
              <router-link v-for="genre in popularGenres.slice(0, 8)" :key="genre.slug"
                :to="`/genre/${genre.slug}`"
                @click="closeMobileMenu"
                class="mobile-section-item">
                {{ genre.name }}
              </router-link>
            </div>
          </div>

          <!-- Mobile Countries -->
          <div class="mobile-section">
            <div class="mobile-section-title">Quốc Gia</div>
            <div class="mobile-section-grid">
              <router-link v-for="country in popularCountries" :key="country.slug"
                :to="`/country/${country.slug}`"
                @click="closeMobileMenu"
                class="mobile-section-item">
                {{ country.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Overlay -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" @click="closeMobileMenu" class="mobile-overlay"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBox from './SearchBox.vue'

const showGenres = ref(false)
const showCountries = ref(false)
const isMobileMenuOpen = ref(false)

const popularGenres = [
  { name: 'Hành Động', slug: 'hanh-dong' },
  { name: 'Tình Cảm', slug: 'tinh-cam' },
  { name: 'Hài Hước', slug: 'hai-huoc' },
  { name: 'Kinh Dị', slug: 'kinh-di' },
  { name: 'Viễn Tưởng', slug: 'vien-tuong' },
  { name: 'Phiêu Lưu', slug: 'phieu-luu' },
  { name: 'Tâm Lý', slug: 'tam-ly' },
  { name: 'Hình Sự', slug: 'hinh-su' },
  { name: 'Chiến Tranh', slug: 'chien-tranh' },
  { name: 'Thần Thoại', slug: 'than-thoai' },
  { name: 'Khoa Học', slug: 'khoa-hoc' },
  { name: 'Võ Thuật', slug: 'vo-thuat' },
  { name: 'Âm Nhạc', slug: 'am-nhac' },
  { name: 'Thể Thao', slug: 'the-thao' },
  { name: 'Gia Đình', slug: 'gia-dinh' },
  { name: 'Học Đường', slug: 'hoc-duong' }
]

const popularCountries = [
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Thái Lan', slug: 'thai-lan' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Việt Nam', slug: 'viet-nam' },
  { name: 'Hồng Kông', slug: 'hong-kong' },
  { name: 'Ấn Độ', slug: 'an-do' },
  { name: 'Đài Loan', slug: 'dai-loan' },
  { name: 'Anh', slug: 'anh' },
  { name: 'Pháp', slug: 'phap' },
  { name: 'Canada', slug: 'canada' },
  { name: 'Philippines', slug: 'philippines' },
  { name: 'Đức', slug: 'duc' }
]

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: #0F1419;
  border-bottom: 1px solid #374151;
}

.navbar-container {
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 16px;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

/* Logo */
.logo {
  font-size: 24px;
  font-weight: 700;
  color: #F59E0B;
  text-decoration: none;
  transition: color 0.2s;
  flex-shrink: 0;
}

.logo:hover {
  color: #FBBF24;
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: center;
}

@media (min-width: 1024px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: #E5E7EB;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.nav-item:hover {
  color: #F59E0B;
  background-color: #1A1F26;
}

.nav-item.router-link-active {
  color: #F59E0B;
  background-color: rgba(245, 158, 11, 0.1);
}

/* Dropdown */
.dropdown-container {
  position: relative;
}

.dropdown-trigger {
  font-family: inherit;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.dropdown-container:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  margin-top: 8px;
  padding: 8px;
  background-color: #1A1F26;
  border: 1px solid #374151;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  z-index: 60;
}

.dropdown-item {
  padding: 8px 12px;
  color: #E5E7EB;
  text-decoration: none;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #252D36;
  color: #F59E0B;
}

/* Nav Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-center: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #1A1F26;
  border: none;
  color: #E5E7EB;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  background-color: #F59E0B;
  color: #0F1419;
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

.menu-icon {
  width: 24px;
  height: 24px;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0F1419;
  overflow-y: auto;
  z-index: 49;
}

.mobile-menu-content {
  padding: 16px;
}

.mobile-nav-item {
  display: block;
  padding: 12px 16px;
  color: #E5E7EB;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.mobile-nav-item:hover,
.mobile-nav-item.router-link-active {
  background-color: #1A1F26;
  color: #F59E0B;
}

.mobile-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #374151;
}

.mobile-section-title {
  color: #F59E0B;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.mobile-section-item {
  padding: 10px 12px;
  color: #E5E7EB;
  text-decoration: none;
  font-size: 14px;
  border-radius: 6px;
  background-color: #1A1F26;
  text-align: center;
  transition: all 0.2s;
}

.mobile-section-item:hover {
  background-color: #252D36;
  color: #F59E0B;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 48;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: all 0.3s ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .navbar-container {
    padding: 0 24px;
  }
  
  .navbar-content {
    height: 72px;
  }
  
  .mobile-menu {
    top: 72px;
  }
}
</style>
