import '@babel/polyfill'
import Es6Promise from 'es6-promise'
import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import Startup from '@/utils/Startup';

import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
// import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'
Es6Promise.polyfill()
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)
Vue.use(ElementUI, {
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string]: Function })[key])
})

Vue.config.productionTip = false
// 初始化加载器
import { preloaderFinished } from './utils/preloader';
preloaderFinished();
const app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
})
// 程序启动过程
Startup.bootstrap().then(() => {
  app.$mount('#app');
  (window as any).appBootstrap();
});
