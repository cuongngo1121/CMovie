import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import MovieDetail from "../views/MovieDetail.vue";
import Genre from "../views/Genre.vue";
import Movies from "../views/Movies.vue";
import Country from "../views/Country.vue";
import Series from "../views/Series.vue";
import MovieWatch from "../views/MovieWatch.vue";
import Animation from "../views/Animation.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/movie/:slug",
        name: "MovieDetail",
        component: MovieDetail,
    },
    {
        path: "/genre",
        name: "Genre",
        component: Genre,
    },
    {
        path: "/country",
        name: "Country",
        component: Country,
    },
    {
        path: "/movies",
        name: "Movies",
        component: Movies,
    },
    {
        path: "/series",
        name: "Series",
        component: Series,
    },
    {
        path: "/animation",
        name: "Animation",
        component: Animation,
    },
    {
        path: "/new-movies",
        name: "NewMovies",
        component: () => import("../views/NewMovies.vue"),
    },
    {
        path: "/category/:slug",
        name: "CategoryView",
        component: () => import("../views/CategoryView.vue"),
    },
    {
        path: "/danh-sach/:slug",
        redirect: to => ({ name: 'CategoryView', params: { slug: to.params.slug } })
    },
    {
        path: "/genre/:slug",
        name: "GenreView",
        component: () => import("../views/GenreWrapper.vue"),
    },
    {
        path: "/the-loai/:slug",
        redirect: to => ({ name: 'GenreView', params: { slug: to.params.slug } })
    },
    {
        path: "/country/:slug",
        name: "CountryView",
        component: () => import("../views/CountryWrapper.vue"),
    },
    {
        path: "/quoc-gia/:slug",
        redirect: to => ({ name: 'CountryView', params: { slug: to.params.slug } })
    },
    {
        path: "/watch/:slug",
        name: "MovieWatch",
        component: MovieWatch,
    },
    {
        path: "/tim-kiem",
        name: "SearchResults",
        component: () => import("../views/SearchResults.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;