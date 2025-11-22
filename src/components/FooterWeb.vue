<template>
  <footer class="bg-primary-dark text-white py-10 px-6 mt-20">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Logo & Description -->
      <div>
        <h3 class="text-xl font-bold mb-2">🎬 Phim Chùa Premium</h3>
        <p class="text-sm text-gray-400">
          Nơi cập nhật phim mới nhất, nhanh nhất và chất lượng cao. Cùng khám phá thế giới điện ảnh!
        </p>
      </div>

      <!-- Navigation Links -->
      <div>
        <h4 class="text-lg font-semibold mb-3">Danh mục</h4>
        <ul class="space-y-2 text-sm text-gray-300">
          <li><a href="/" class="hover:text-white">Trang chủ</a></li>
          <li><a href="/category/phim-le" class="hover:text-white">Phim lẻ</a></li>
          <li><a href="/category/phim-bo" class="hover:text-white">Phim bộ</a></li>
          <li><a href="/category/phim-chieu-rap" class="hover:text-white">Phim chiếu rạp</a></li>
        </ul>
      </div>

      <!-- Social Connect -->
      <div class="fui-connect-social">
        <h4 class="text-lg font-semibold mb-3">Kết nối với chúng tôi</h4>
        <ul class="social-list">
  <li class="social-item">
    <a href="https://www.facebook.com/" class="social-link" title="Facebook">
      <div class="icon">
        <i class="fab fa-facebook-f"></i>
      </div>
      <span class="text">Facebook</span>
    </a>
  </li>
  <li class="social-item">
    <a href="https://www.instagram.com/" class="social-link" title="Instagram">
      <div class="icon">
        <i class="fab fa-instagram"></i>
      </div>
      <span class="text">Instagram</span>
    </a>
  </li>
  <li class="social-item">
    <a href="https://www.youtube.com/" class="social-link" title="YouTube">
      <div class="icon">
        <i class="fab fa-youtube"></i>
      </div>
      <span class="text">YouTube</span>
    </a>
  </li>
</ul>

      </div>
    </div>
    <p class="text-center text-sm text-gray-500 mt-10">© 2025 Phim Chùa Premium. All rights reserved.</p>
  </footer>
</template>

<script setup>
// Không cần JS cho phần footer này
</script>

<style scoped>
.fui-connect-social .social-list {
  display: flex;
  align-items: center;
  gap: 16px;
}
.fui-connect-social .social-link {
  display: flex;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 100rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  overflow: hidden;
  cursor: pointer;
}
.fui-connect-social .icon {
  width: 60px;
  height: 60px;
  border-radius: 100rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-out;
}
.fui-connect-social .text {
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  line-height: 60px;
  display: none;
  transition: all 0.3s ease-out;
}
.social-item:hover .social-link {
  width: 200px;
}
.social-item:hover .text {
  display: block;
}
.social-item:nth-child(1):hover .text {
  color: #4267b2;
}
.social-item:nth-child(1):hover .icon {
  background-color: #4267b2;
}
.social-item:nth-child(2):hover .text {
  color: #e11d48;
}
.social-item:nth-child(2):hover .icon {
  background-color: #e11d48;
}
.social-item:nth-child(3):hover .text {
  color: #dc2626;
}
.social-item:nth-child(3):hover .icon {
  background-color: #dc2626;
}
</style>
