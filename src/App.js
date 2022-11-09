import './App.scss'
import NoMatch from './pages/404'
import Layouts from './pages/layout'
import Login from './pages/login'
// testing component

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
// import authorization component
import AuthRoute from './components/authRoute'

function App () {
  return (
    <Router>
      <div className='app'>
        <Switch>
          <Redirect exact from='/' to='/home'></Redirect>
          {/* <Route path={'/home'} component={Layout}></Route> */}
          <AuthRoute path='/home' component={Layouts} />
          <Route path='/login' component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
