<template>
  <footer class="w-full mt-20 bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 text-sm">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <!-- Column 1: Brand (Text Only) & About -->
        <div class="col-span-1 md:col-span-1">
          <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-6">PHIM CHÙA</h2>
          <p class="text-gray-400 leading-relaxed mb-6">
            Nền tảng xem phim miễn phí với trải nghiệm đỉnh cao. Không quảng cáo, không giật lag, chỉ có niềm vui.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.811 7.661c.427 0 .711.018.847.027.051 1.706.051 3.428.051 5.143v.018c-3.14 0-5.115-1.558-5.115-4.502h-2.61v8.834c0 1.944 1.344 3.425 3.311 3.425 2.828 0 4.225-2.028 4.225-2.028v1.739h2.466c0-4.322.012-9.28.012-12.656h-2.583c-.012.396-.012.783-.012 1.171-.285-1.077-1.396-1.171-1.396-1.171h-.195z"/></svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Browse -->
        <div>
          <h3 class="font-bold text-white mb-6 uppercase tracking-wider text-xs">Khám Phá</h3>
          <ul class="space-y-4">
            <li><router-link to="/movies" class="text-gray-400 hover:text-red-500 transition-colors">Phim Mới</router-link></li>
            <li><router-link to="/series" class="text-gray-400 hover:text-red-500 transition-colors">Phim Bộ</router-link></li>
            <li><router-link to="/animation" class="text-gray-400 hover:text-red-500 transition-colors">Hoạt Hình</router-link></li>
            <li><router-link to="/genre" class="text-gray-400 hover:text-red-500 transition-colors">Thể Loại</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Help -->
        <div>
          <h3 class="font-bold text-white mb-6 uppercase tracking-wider text-xs">Hỗ Trợ</h3>
          <ul class="space-y-4">
            <li><a href="#" class="text-gray-400 hover:text-red-500 transition-colors">FAQ</a></li>
            <li><a href="#" class="text-gray-400 hover:text-red-500 transition-colors">DMCA</a></li>
            <li><a href="#" class="text-gray-400 hover:text-red-500 transition-colors">Liên Hệ Quảng Cáo</a></li>
            <li><a href="#" class="text-gray-400 hover:text-red-500 transition-colors">Báo Lỗi</a></li>
          </ul>
        </div>

        <!-- Column 4: Newsletter -->
        <div>
          <h3 class="font-bold text-white mb-6 uppercase tracking-wider text-xs">Đăng Ký Nhận Tin</h3>
           <p class="text-gray-400 mb-4 text-xs">Nhận thông báo về phim mới hot nhất.</p>
          <div class="relative">
            <input 
              type="email" 
              placeholder="Email của bạn"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
            >
            <button class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-xs">
          © {{ new Date().getFullYear() }} Phim Chùa. Mọi bản quyền đều là của gió bay.
        </p>
        <div class="flex gap-6 text-xs text-gray-500">
          <a href="#" class="hover:text-white transition-colors">Điều khoản sử dụng</a>
          <a href="#" class="hover:text-white transition-colors">Chính sách quyền riêng tư</a>
        </div>
      </div>
    </div>
  </footer>
</template>
