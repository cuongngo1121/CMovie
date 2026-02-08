import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './assets/glass.css'
import './assets/animations.css'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
