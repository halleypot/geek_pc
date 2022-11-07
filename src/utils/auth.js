// token manipulation
const TOKEN_KEY = 'geek_token'

export function getToken () {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken (token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken () {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuth () {
  return !!getToken()
}
