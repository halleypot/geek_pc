import axios from 'axios'

const http = axios.create({
  baseURL: 'http://geek.itheima.net'
})

// add response interceptor

http.interceptors.response.use(
  res => {
    return res.data.data
  },
  err => {
    return Promise.reject(err)
  }
)

export default http
