import { lazy, Suspense } from 'react'
import { customHistory } from './utils/history'

import { Router, Redirect, Route, Switch } from 'react-router-dom'
import './App.scss'
// import authorization component
import AuthRoute from './components/authRoute'
const NoMatch = lazy(() => import('./pages/404'))
const Layouts = lazy(() => import('./pages/layout'))
const Login = lazy(() => import('./pages/login'))

function App () {
  return (
    <Router history={customHistory}>
      <Suspense fallback={'please wait a monent for loading pages'}>
        <div className='app'>
          <Switch>
            <Redirect exact from='/' to='/home'></Redirect>
            {/* <Route path={'/home'} component={Layout}></Route> */}
            <AuthRoute path='/home' component={Layouts} />
            <Route path='/login' component={Login} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Suspense>
    </Router>
  )
}

export default App
