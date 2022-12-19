import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 1. 项目的接口地址都换成这个
  // 2. 接口文档中所有接口地址的app层移除掉
  baseURL: 'http://toutiao.itheima.net'
})

// axios的请求拦截器: 任何的请求都走这个拦截器，等拦截器处理完成后再发起请求
request.interceptors.request.use(
  config => {
    // config存储着这个请求发起时需要使用到的所有信息
    // 如果有token，则给请求的headers上添加Authorization这个项
    if (store?.state?.user?.token) {
      config.headers['Authorization'] = 'Bearer ' + store.state.user.token
    }

    // 最后一定要记得返回config!!!
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default request
