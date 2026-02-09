import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './assets/glass.css'
import './assets/animations.css'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';


import vReveal from './directives/vReveal'

const app = createApp(App)
const pinia = createPinia()
app.directive('reveal', vReveal)
app.use(pinia)
app.use(router)
app.mount('#app')
