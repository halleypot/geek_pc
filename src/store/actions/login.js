import { setToken } from '@/utils/auth'
import http from '@/utils/request'

export const login = values => {
  return async dispatch => {
    const { token } = await http({
      method: 'post',
      url: '/v1_0/authorizations',
      data: values
    })

    dispatch({ type: 'login/getTokens', payload: token })

    setToken(token)
  }
}
