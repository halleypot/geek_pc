import { clearToken, setToken } from '@/utils/auth'
import http from '@/utils/request'

export const login = values => {
  return async dispatch => {
    const { token } = await http({
      method: 'post',
      url: '/authorizations',
      data: values
    })

    dispatch({ type: 'login/getTokens', payload: token })

    setToken(token)
  }
}

export const logout = () => {
  return dispatch => {
    dispatch({ type: 'logout/clearToken' })
    clearToken()
    // clear user info
    dispatch({ type: 'user/clearInfo' })
  }
}
