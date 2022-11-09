import { isAuth } from '@/utils/auth'
import { Redirect, Route } from 'react-router-dom'

function AuthRoute ({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        // if no token
        // console.log('token:', !isAuth())
        if (!isAuth()) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location.pathname
                }
              }}
            />
          )
        }

        return <Component />
      }}
    />
  )
}

export default AuthRoute
