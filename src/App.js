import './App.scss'
import NoMatch from './pages/404'
import Layout from './pages/layout'
import Login from './pages/login'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'

function App () {
  return (
    <Router>
      <div className='app'>
        <Switch>
          <Redirect from='/' to='/home'></Redirect>
          <Route path={'/home'} component={Layout}></Route>
          <Route path={'/login'} component={Login}></Route>
          <Route component={NoMatch}></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
