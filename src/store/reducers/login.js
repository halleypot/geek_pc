import { getToken } from '@/utils/auth'

const initialState = getToken() || ''

export const login = (state = initialState, actions) => {
  switch (actions.type) {
    case 'login/getTokens':
      return actions.payload

    default:
      return state
  }
}
