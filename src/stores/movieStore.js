// stores/movieStore.js
import { defineStore } from 'pinia'
import axiosClient from '../api/axiosClient'

export const useMovieStore = defineStore('movie', {
    state: () => ({
        movies: [], // Home page movies
        moviesByCategory: {}, // { [category]: { allMovies: [], items: [], params: {} } }
        moviesByCountry: {}, // { [country]: { allMovies: [], data: {} } }
        searchResults: [],
        searchCache: {},
        loading: false,
        searchLoading: false,
        movieDetail: null,
        relatedMovies: {},
    }),

    getters: {
        // Cached search results
        getCachedSearchResults: (state) => (keyword) => {
            return state.searchCache[keyword.toLowerCase()] || null
        },
        // Global loading flag
        isLoading: (state) => state.loading || state.searchLoading,
        // Country helpers
        getAllMoviesForCountry: (state) => (country) => state.moviesByCountry[country]?.allMovies || [],
        getMovieCountForCountry: (state) => (country) => state.moviesByCountry[country]?.allMovies?.length || 0,
        // Category helpers
        getAllMoviesForCategory: (state) => (category) => state.moviesByCategory[category]?.allMovies || [],
        getMovieCountForCategory: (state) => (category) => state.moviesByCategory[category]?.allMovies?.length || 0,
    },

    actions: {
        /** Home page movies */
        async getNewMovies() {
            this.loading = true
            try {
                const res = await axiosClient.get('v1/api/home')
                this.movies = res.data
                console.log('✅ Home movies loaded')
            } catch (e) {
                console.error('❌ Failed to load home movies', e)
            } finally {
                this.loading = false
            }
        },

        /** Single page fetch for a category (legacy) */
        async getMoviesByCategory(category) {
            if (this.moviesByCategory[category]?.items?.length) return
            this.loading = true
            try {
                const res = await axiosClient.get(`/v1/api/danh-sach/${category}?page=1&limit=24`)
                const data = res.data?.data || {}
                this.moviesByCategory[category] = {
                    items: data.items || [],
                    params: data.params || {},
                    allMovies: data.items || [],
                }
                console.log(`✅ Loaded first page for ${category}`)
            } catch (e) {
                console.error(`❌ Error loading category ${category}`, e)
            } finally {
                this.loading = false
            }
        },

        /** Fetch all pages for a category – default endpoint is "danh-sach" */
        async getAllMoviesByCategory(category, endpoint = 'danh-sach', maxPages = 50) {
            // Use cached data if sufficient
            if (this.moviesByCategory[category]?.allMovies?.length > 24) {
                console.log(`📋 Using cached movies for ${category}`)
                return this.moviesByCategory[category].allMovies
            }

            this.loading = true
            if (!this.moviesByCategory[category]) this.moviesByCategory[category] = { allMovies: [] }

            try {
                let all = []
                let page = 1
                let hasMore = true
                while (hasMore && page <= maxPages) {
                    const res = await axiosClient.get(`/v1/api/${endpoint}/${category}?page=${page}&limit=1000`)
                    const items = res.data?.data?.items || []
                    all.push(...items)
                    if (page === 1) {
                        this.moviesByCategory[category].items = items
                        this.moviesByCategory[category].params = res.data?.data?.params || {}
                    }
                    const pagination = res.data?.data?.params?.pagination
                    if (pagination) {
                        hasMore = page < (pagination.totalPages || 1)
                    } else {
                        hasMore = items.length >= 24
                    }
                    page++
                    if (hasMore && page <= maxPages) await new Promise(r => setTimeout(r, 200))
                }
                // Deduplicate by slug
                const unique = all.filter((m, i, self) => i === self.findIndex(t => t.slug === m.slug))
                this.moviesByCategory[category].allMovies = unique
                console.log(`✅ Loaded ${unique.length} movies for ${category}`)
                return unique
            } catch (e) {
                console.error(`❌ Failed to load all movies for ${category}`, e)
                // Fallback to single page
                await this.getMoviesByCategory(category)
                const fallback = this.moviesByCategory[category]?.items || []
                this.moviesByCategory[category].allMovies = fallback
                return fallback
            } finally {
                this.loading = false
            }
        },

        /** Single page fetch for a country */
        async getMoviesByCountry(country) {
            if (this.moviesByCountry[country]?.data) return
            this.loading = true
            try {
                const res = await axiosClient.get(`/v1/api/quoc-gia/${country}?page=1&limit=24`)
                this.moviesByCountry[country] = {
                    data: res.data,
                    allMovies: res.data?.data?.items || [],
                }
                console.log(`✅ Loaded country ${country}`)
            } catch (e) {
                console.error(`❌ Error loading country ${country}`, e)
            } finally {
                this.loading = false
            }
        },

        /** Fetch all pages for a country */
        async getAllMoviesByCountry(country, maxPages = 50) {
            if (this.moviesByCountry[country]?.allMovies?.length > 24) {
                console.log(`📋 Using cached movies for ${country}`)
                return this.moviesByCountry[country].allMovies
            }
            this.loading = true
            if (!this.moviesByCountry[country]) this.moviesByCountry[country] = { allMovies: [] }
            try {
                let all = []
                let page = 1
                let hasMore = true
                while (hasMore && page <= maxPages) {
                    const res = await axiosClient.get(`/v1/api/quoc-gia/${country}?page=${page}&limit=1000`)
                    const items = res.data?.data?.items || []
                    all.push(...items)
                    if (page === 1) this.moviesByCountry[country].data = res.data
                    const pagination = res.data?.data?.params?.pagination
                    if (pagination) {
                        hasMore = page < (pagination.totalPages || 1)
                    } else {
                        hasMore = items.length >= 24
                    }
                    page++
                    if (hasMore && page <= maxPages) await new Promise(r => setTimeout(r, 200))
                }
                const unique = all.filter((m, i, self) => i === self.findIndex(t => t.slug === m.slug))
                this.moviesByCountry[country].allMovies = unique
                console.log(`✅ Loaded ${unique.length} movies for ${country}`)
                return unique
            } catch (e) {
                console.error(`❌ Failed to load all movies for ${country}`, e)
                await this.getMoviesByCountry(country)
                const fallback = this.moviesByCountry[country]?.data?.data?.items || []
                this.moviesByCountry[country].allMovies = fallback
                return fallback
            } finally {
                this.loading = false
            }
        },

        /** Generic pagination helper (kept for compatibility) */
        async getMovies(category, page = 1, limit = 24) {
            const key = `${category}-page-${page}`
            if (this.moviesByCategory[key]) return
            this.loading = true
            try {
                const res = await axiosClient.get(`/v1/api/danh-sach/${category}?page=${page}&limit=${limit}`)
                const data = res.data?.data || {}
                this.moviesByCategory[key] = {
                    items: data.items || [],
                    params: {
                        currentPage: data.params?.pagination?.currentPage,
                        totalPages: data.params?.pagination?.totalPages,
                        limit: data.params?.pagination?.limit,
                    },
                }
                console.log(`✅ Loaded ${category} page ${page}`)
            } catch (e) {
                console.error(`❌ Error loading ${category} page ${page}`, e)
            } finally {
                this.loading = false
            }
        },

        /** Movie detail */
        async getMovieDetail(slug) {
            this.loading = true
            try {
                const res = await axiosClient.get(`v1/api/phim/${slug}`)
                this.movieDetail = res.data
                console.log(`✅ Loaded detail for ${slug}`)
            } catch (e) {
                console.error(`❌ Error loading detail for ${slug}`, e)
            } finally {
                this.loading = false
            }
        },

        /** Fetch movies by genre (for related/recommended) */
        async getMoviesByGenre(genreSlug) {
            if (this.relatedMovies[genreSlug]?.length) {
                console.log(`📋 Using cached related movies for ${genreSlug}`)
                return this.relatedMovies[genreSlug]
            }
            try {
                const res = await axiosClient.get(`/v1/api/the-loai/${genreSlug}?page=1&limit=24`)
                const items = res.data?.data?.items || []
                this.relatedMovies[genreSlug] = items
                console.log(`✅ Loaded ${items.length} related movies for genre ${genreSlug}`)
                return items
            } catch (e) {
                console.error(`❌ Error loading genre ${genreSlug}`, e)
                return []
            }
        },

        /** Search */
        async searchMovies(keyword, page = 1, limit = 20) {
            if (!keyword?.trim()) return null
            const key = `${keyword.trim().toLowerCase()}-page-${page}`
            if (this.searchCache[key]) {
                console.log('📋 Using cached search')
                return this.searchCache[key]
            }
            this.searchLoading = true
            try {
                const res = await axiosClient.get('v1/api/tim-kiem', {
                    params: { keyword: keyword.trim(), page, limit },
                })
                const data = res.data?.data || {}
                const result = {
                    items: data.items || [],
                    params: data.params || {},
                    titlePage: data.titlePage || `Kết quả tìm kiếm: ${keyword}`,
                    keyword: keyword.trim(),
                }
                this.searchCache[key] = result
                setTimeout(() => delete this.searchCache[key], 5 * 60 * 1000)
                if (page === 1) this.searchResults = result.items
                console.log(`✅ Search "${keyword}" returned ${result.items.length}`)
                return result
            } catch (e) {
                console.error('❌ Search error', e)
                const empty = { items: [], params: {}, titlePage: `Không tìm thấy kết quả cho: ${keyword}`, keyword: keyword.trim() }
                this.searchResults = []
                return empty
            } finally {
                this.searchLoading = false
            }
        },

        async getSearchSuggestions(keyword) {
            if (!keyword || keyword.length < 2) return []
            try {
                const res = await this.searchMovies(keyword, 1, 8)
                return res?.items || []
            } catch (e) {
                console.error('❌ Suggestion error', e)
                return []
            }
        },

        /** Cache helpers */
        clearSearchCache() {
            this.searchCache = {}
            this.searchResults = []
            console.log('🗑️ Search cache cleared')
        },
        clearSearchFromCache(keyword) {
            const norm = keyword.toLowerCase()
            Object.keys(this.searchCache).forEach(k => {
                if (k.includes(norm)) delete this.searchCache[k]
            })
        },
        getPopularSearches() {
            return ['One Piece', 'Narco', 'Dragon Ball', 'Avengers', 'Spider-Man', 'Batman', 'Doraemon', 'Pokemon', 'Attack on Titan']
        },

        /** Country cache helpers */
        clearCountryMovies(country) {
            if (this.moviesByCountry[country]) {
                delete this.moviesByCountry[country]
                console.log(`🗑️ Cleared cache for ${country}`)
            }
        },
        async refreshCountryMovies(country) {
            this.clearCountryMovies(country)
            return await this.getAllMoviesByCountry(country)
        },

        /** Category cache helpers */
        clearCategoryMovies(category) {
            if (this.moviesByCategory[category]) {
                delete this.moviesByCategory[category]
                console.log(`🗑️ Cleared cache for ${category}`)
            }
        },
        async refreshCategoryMovies(category) {
            this.clearCategoryMovies(category)
            return await this.getAllMoviesByCategory(category)
        },
    },
})