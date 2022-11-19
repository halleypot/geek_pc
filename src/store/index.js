import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

let middlewares

if (process.env.NODE_ENV === 'development') {
  const { composeWithDevTools } = require('redux-devtools-extension')
  middlewares = composeWithDevTools(applyMiddleware(thunk))
} else if (process.env.NODE_ENV === 'production') {
  middlewares = applyMiddleware(thunk)
}

const store = createStore(rootReducer, middlewares)

export default store
