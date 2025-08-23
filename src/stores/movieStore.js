// stores/movieStore.js
import { defineStore } from 'pinia'
import axiosClient from '../api/axiosClient'

export const useMovieStore = defineStore('movie', {
    state: () => ({
        movies: [], // sẽ chứa mảng items
        moviesByCategory: {}, // sẽ chứa mảng items theo thể loại với cấu trúc mới: { category: { allMovies: [], items: [], params: {} } }
        searchResults: [], // kết quả tìm kiếm
        searchCache: {}, // cache tìm kiếm để tránh gọi API lặp lại
        loading: false,
        searchLoading: false,
        movieDetail: null,
        moviesByCountry: {}, // { country: { allMovies: [], data: {...} } }
    }),

    getters: {
        // Getter để lấy kết quả tìm kiếm đã cache
        getCachedSearchResults: (state) => (keyword) => {
            return state.searchCache[keyword.toLowerCase()] || null
        },

        // Getter để kiểm tra có đang loading không
        isLoading: (state) => state.loading || state.searchLoading,

        // Get all movies for a specific country
        getAllMoviesForCountry: (state) => (country) => {
            return state.moviesByCountry[country]?.allMovies || []
        },

        // Get movie count for a specific country
        getMovieCountForCountry: (state) => (country) => {
            return state.moviesByCountry[country]?.allMovies?.length || 0
        },

        // Get all movies for a specific category
        getAllMoviesForCategory: (state) => (category) => {
            return state.moviesByCategory[category]?.allMovies || []
        },

        // Get movie count for a specific category
        getMovieCountForCategory: (state) => (category) => {
            return state.moviesByCategory[category]?.allMovies?.length || 0
        }
    },

    actions: {
        async getNewMovies() {
            this.loading = true
            try {
                const res = await axiosClient.get('v1/api/home')
                console.log('✅ API response:', res.data)
                this.movies = res.data
            } catch (error) {
                console.error('❌ Lỗi khi lấy danh sách phim:', error)
            } finally {
                this.loading = false
            }
        },

        // Original method - gets single page for category
        async getMoviesByCategory(category) {
            if (this.moviesByCategory[category]?.items?.length) {
                return;
            }

            this.loading = true;
            try {
                const res = await axiosClient.get(`/v1/api/danh-sach/${category}?page=1&limit=24`);
                const data = res.data?.data; // 👈 lấy đúng tầng "data"

                if (!this.moviesByCategory[category]) {
                    this.moviesByCategory[category] = {};
                }

                this.moviesByCategory[category].items = data?.items || [];
                this.moviesByCategory[category].params = data?.params || {};

                // Nếu chưa có allMovies thì gán từ trang 1
                if (!this.moviesByCategory[category].allMovies) {
                    this.moviesByCategory[category].allMovies = data?.items || [];
                }

                console.log(`✅ Loaded ${this.moviesByCategory[category].items.length} movies for ${category}`);
            } catch (error) {
                console.error('❌ Lỗi khi lấy danh sách phim theo thể loại:', error);
            } finally {
                this.loading = false;
            }
        }

        ,


        // New method - gets all movies from all pages for a category
        async getAllMoviesByCategory(category, maxPages = 50) {
            // Check if we already have all movies for this category
            if (this.moviesByCategory[category]?.allMovies?.length > 24) {
                console.log(`📋 Already have ${this.moviesByCategory[category].allMovies.length} movies for ${category}`)
                return this.moviesByCategory[category].allMovies
            }

            this.loading = true

            // Initialize category data structure
            if (!this.moviesByCategory[category]) {
                this.moviesByCategory[category] = { allMovies: [] }
            }

            try {
                let allMovies = []
                let currentPage = 1
                let hasMorePages = true
                let totalPages = 1

                console.log(`🎬 Starting to load all movies for category ${category}...`)

                while (hasMorePages && currentPage <= maxPages) {
                    console.log(`📄 Loading page ${currentPage} for category ${category}...`)

                    const res = await axiosClient.get(`/v1/api/the-loai/${category}?page=${currentPage}&limit=1000`)

                    if (res.data?.status && res.data?.data?.items?.length > 0) {
                        const items = res.data.data.items
                        allMovies.push(...items)

                        // Store pagination info from first page
                        if (currentPage === 1) {
                            this.moviesByCategory[category].items = items
                            this.moviesByCategory[category].params = res.data.data?.params || {}
                            totalPages = res.data.data?.params?.pagination?.totalPages || 1
                        }

                        // Check if we have more pages
                        const pagination = res.data.data?.params?.pagination
                        if (pagination) {
                            hasMorePages = currentPage < (pagination.totalPages || 1)
                            totalPages = pagination.totalPages || 1
                        } else {
                            // If no pagination info, assume we got all data if less than limit
                            hasMorePages = items.length >= 24
                        }

                        currentPage++

                        // Add small delay to avoid overwhelming the server
                        if (hasMorePages && currentPage <= maxPages) {
                            await new Promise(resolve => setTimeout(resolve, 200))
                        }
                    } else {
                        hasMorePages = false
                    }
                }

                // Remove duplicates based on slug
                const uniqueMovies = allMovies.filter((movie, index, self) =>
                    index === self.findIndex(m => m.slug === movie.slug)
                )

                // Store all movies
                this.moviesByCategory[category].allMovies = uniqueMovies

                console.log(`✅ Loaded ${uniqueMovies.length} unique movies from ${currentPage - 1} pages for category ${category}`)

                return uniqueMovies

            } catch (error) {
                console.error(`❌ Error loading all movies for category ${category}:`, error)

                // Fallback to single page
                try {
                    await this.getMoviesByCategory(category)
                    const fallbackMovies = this.moviesByCategory[category]?.items || []
                    this.moviesByCategory[category].allMovies = fallbackMovies
                    return fallbackMovies
                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError)
                    return []
                }
            } finally {
                this.loading = false
            }
        },

        async getMoviesByCountry(country) {
            if (this.moviesByCountry[country]?.data) {
                return;
            }

            this.loading = true
            try {
                const res = await axiosClient.get(`/v1/api/quoc-gia/${country}?page=1&limit=24`)

                if (!this.moviesByCountry[country]) {
                    this.moviesByCountry[country] = {}
                }

                this.moviesByCountry[country].data = res.data

                // If no allMovies exist, use the first page data
                if (!this.moviesByCountry[country].allMovies) {
                    this.moviesByCountry[country].allMovies = res.data?.data?.items || []
                }

            } catch (error) {
                console.error('❌ Lỗi khi lấy danh sách phim theo quốc gia:', error)
            } finally {
                this.loading = false
            }
        },

        // Gets all movies from all pages for a country
        async getAllMoviesByCountry(country, maxPages = 50) {
            // Check if we already have all movies for this country
            if (this.moviesByCountry[country]?.allMovies?.length > 24) {
                console.log(`📋 Already have ${this.moviesByCountry[country].allMovies.length} movies for ${country}`)
                return this.moviesByCountry[country].allMovies
            }

            this.loading = true

            // Initialize country data structure
            if (!this.moviesByCountry[country]) {
                this.moviesByCountry[country] = { allMovies: [] }
            }

            try {
                let allMovies = []
                let currentPage = 1
                let hasMorePages = true
                let totalPages = 1

                console.log(`🎬 Starting to load all movies for ${country}...`)

                while (hasMorePages && currentPage <= maxPages) {
                    console.log(`📄 Loading page ${currentPage} for ${country}...`)

                    const res = await axiosClient.get(`/v1/api/quoc-gia/${country}?page=${currentPage}&limit=1000`)

                    if (res.data?.status && res.data?.data?.items?.length > 0) {
                        const items = res.data.data.items
                        allMovies.push(...items)

                        // Store pagination info from first page
                        if (currentPage === 1) {
                            this.moviesByCountry[country].data = res.data
                            totalPages = res.data.data?.params?.pagination?.totalPages || 1
                        }

                        // Check if we have more pages
                        const pagination = res.data.data?.params?.pagination
                        if (pagination) {
                            hasMorePages = currentPage < (pagination.totalPages || 1)
                            totalPages = pagination.totalPages || 1
                        } else {
                            // If no pagination info, assume we got all data if less than limit
                            hasMorePages = items.length >= 24
                        }

                        currentPage++

                        // Add small delay to avoid overwhelming the server
                        if (hasMorePages && currentPage <= maxPages) {
                            await new Promise(resolve => setTimeout(resolve, 200))
                        }
                    } else {
                        hasMorePages = false
                    }
                }

                // Remove duplicates based on slug
                const uniqueMovies = allMovies.filter((movie, index, self) =>
                    index === self.findIndex(m => m.slug === movie.slug)
                )

                // Store all movies
                this.moviesByCountry[country].allMovies = uniqueMovies

                console.log(`✅ Loaded ${uniqueMovies.length} unique movies from ${currentPage - 1} pages for ${country}`)

                return uniqueMovies

            } catch (error) {
                console.error(`❌ Error loading all movies for ${country}:`, error)

                // Fallback to single page
                try {
                    await this.getMoviesByCountry(country)
                    const fallbackMovies = this.moviesByCountry[country]?.data?.data?.items || []
                    this.moviesByCountry[country].allMovies = fallbackMovies
                    return fallbackMovies
                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError)
                    return []
                }
            } finally {
                this.loading = false
            }
        },

        async getMovies(category, page = 1, limit = 24) {
            const key = `${category}-page-${page}`
            if (this.moviesByCategory[key]) { return }
            this.loading = true
            try {
                const res = await axiosClient.get(`/v1/api/danh-sach/${category}?page=${page}&limit=${limit}`)
                const data = res.data.data

                // API KKPhim có data.items, data.params
                this.moviesByCategory[key] = {
                    items: data.items,
                    params: {
                        currentPage: data.params.pagination.currentPage,
                        totalPages: data.params.pagination.totalPages,
                        limit: data.params.pagination.limit
                    }
                }

                console.log('✅ API response:', this.moviesByCategory[key])
            }
            catch (error) {
                console.error('❌ Lỗi khi lấy danh sách phim theo thể loại:', error)
            }
            finally {
                this.loading = false
            }
        },

        async getMovieDetail(slug) {
            this.loading = true
            try {
                const res = await axiosClient.get(`v1/api/phim/${slug}`)
                this.movieDetail = res.data
                await new Promise(resolve => setTimeout(resolve, 1500))
            } catch (error) {
                console.error('❌ Lỗi khi lấy chi tiết phim:', error)
            } finally {
                this.loading = false
            }
        },

        // ✨ Tìm kiếm phim
        async searchMovies(keyword, page = 1, limit = 20) {
            if (!keyword || !keyword.trim()) {
                return null
            }

            const normalizedKeyword = keyword.trim().toLowerCase()
            const cacheKey = `${normalizedKeyword}-page-${page}`

            // Kiểm tra cache trước
            if (this.searchCache[cacheKey]) {
                console.log('📋 Sử dụng cache cho:', keyword)
                return this.searchCache[cacheKey]
            }

            this.searchLoading = true

            try {
                const res = await axiosClient.get(`v1/api/tim-kiem`, {
                    params: {
                        keyword: keyword.trim(),
                        page,
                        limit
                    }
                })

                const searchData = {
                    items: res.data.data?.items || [],
                    params: res.data.data?.params || {},
                    titlePage: res.data.data?.titlePage || `Kết quả tìm kiếm: ${keyword}`,
                    keyword: keyword.trim()
                }

                // Cache kết quả trong 5 phút
                this.searchCache[cacheKey] = searchData

                // Xóa cache cũ sau 5 phút
                setTimeout(() => {
                    delete this.searchCache[cacheKey]
                }, 5 * 60 * 1000)

                // Update searchResults cho component sử dụng
                if (page === 1) {
                    this.searchResults = searchData.items
                }

                console.log('✅ Tìm kiếm thành công:', keyword, searchData.items.length, 'kết quả')
                return searchData

            } catch (error) {
                console.error('❌ Lỗi khi tìm kiếm phim:', error)

                // Return empty result on error
                const emptyResult = {
                    items: [],
                    params: {},
                    titlePage: `Không tìm thấy kết quả cho: ${keyword}`,
                    keyword: keyword.trim()
                }

                this.searchResults = []
                return emptyResult
            } finally {
                this.searchLoading = false
            }
        },

        // ✨ Lấy gợi ý tìm kiếm (search suggestions)
        async getSearchSuggestions(keyword) {
            if (!keyword || keyword.length < 2) {
                return []
            }

            try {
                // Gọi API tìm kiếm với limit nhỏ để lấy gợi ý
                const result = await this.searchMovies(keyword, 1, 8)
                return result?.items || []
            } catch (error) {
                console.error('❌ Lỗi khi lấy gợi ý tìm kiếm:', error)
                return []
            }
        },

        // ✨ Clear search cache
        clearSearchCache() {
            this.searchCache = {}
            this.searchResults = []
            console.log('🗑️ Đã xóa cache tìm kiếm')
        },

        // ✨ Clear specific search from cache
        clearSearchFromCache(keyword) {
            const normalizedKeyword = keyword.toLowerCase()
            Object.keys(this.searchCache).forEach(key => {
                if (key.includes(normalizedKeyword)) {
                    delete this.searchCache[key]
                }
            })
        },

        // ✨ Get popular/trending searches (mock data - có thể connect với API sau)
        getPopularSearches() {
            return [
                'One Piece', 'Naruto', 'Dragon Ball',
                'Avengers', 'Spider-Man', 'Batman',
                'Doraemon', 'Pokemon', 'Attack on Titan'
            ]
        },

        // ✨ Clear all movies cache for a country
        clearCountryMovies(country) {
            if (this.moviesByCountry[country]) {
                delete this.moviesByCountry[country]
                console.log(`🗑️ Cleared movies cache for ${country}`)
            }
        },

        // ✨ Refresh movies for a country
        async refreshCountryMovies(country) {
            this.clearCountryMovies(country)
            return await this.getAllMoviesByCountry(country)
        },

        // ✨ NEW: Clear all movies cache for a category
        clearCategoryMovies(category) {
            if (this.moviesByCategory[category]) {
                delete this.moviesByCategory[category]
                console.log(`🗑️ Cleared movies cache for category ${category}`)
            }
        },

        // ✨ NEW: Refresh movies for a category
        async refreshCategoryMovies(category) {
            this.clearCategoryMovies(category)
            return await this.getAllMoviesByCategory(category)
        }
    },
})