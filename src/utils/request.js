import axios from 'axios'
import store from '@/store'
import { customHistory } from '@/utils/history'
import { message } from 'antd'
import { logoutAction } from '@/store/actions'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0'
})

// add request interceptor
http.interceptors.request.use(config => {
  // config request header with token
  const { login: token } = store.getState()

  config.headers.Authorization = `Bearer ${token}`
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
