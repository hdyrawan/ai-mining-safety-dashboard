import { createApp } from 'vue'
import './assets/styles/variables.css'
import './assets/styles/base.css'
import './assets/main.css'
import App from './App.vue'
import router from './router/index.js'

createApp(App).use(router).mount('#app')
