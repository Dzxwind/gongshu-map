import moment from 'moment'
moment.locale('zh-CN')
import AntD from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import '@/style/index.scss'
export default {
  install(Vue) {
    Vue.prototype.moment = moment
    Vue.use(AntD)
  }
}
