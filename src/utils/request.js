import axios from 'axios'
import store from '@/store'
import { customHistory } from '@/utils/history'
import { message } from 'antd'
import { logoutAction } from '@/store/actions'

const baseURL = process.env.REACT_APP_URL
console.log(process.env)
const http = axios.create({
  baseURL: baseURL
})

// add request interceptor
http.interceptors.request.use(config => {
  // config request header with token
  const { login: token } = store.getState()

  // 除了登录请求外，其他请求统一添加 token
  if (!config.url.startsWith('/authorizations')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, null)

// add response interceptor
http.interceptors.response.use(
  res => {
    return res.data.data
  },
  err => {
    if (!err.response) {
      message.error('connection is busy. please try later')
      return Promise.reject(err)
    }

    if (err.response.status === 401) {
      message.warning(err.response.data?.message, 1, () => {
        // delete token
        store.dispatch(logoutAction())
        // push into login page
        customHistory.push({
          pathname: '/login',
          state: {
            from: customHistory.location.pathname
          }
        })
      })
    }

    return Promise.reject(err)
  }
)

export default http
