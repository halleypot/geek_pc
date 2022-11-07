import { combineReducers } from 'redux'
import { login } from './login'
import { user } from './user'
import { article } from './article'
const rootReducer = combineReducers({
  login,
  user,
  article
})

export default rootReducer
