import { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import style from './index.module.scss'

function NoMatch () {
  const [count, setCount] = useState(10)
  const history = useHistory()

  const timerRef = useRef(-1)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount(count => count - 1)
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (count < 0) {
      history.push('/home')
    }
  }, [count, history])

  return (
    <div className={style.root}>
      <h1>Opoos....No Matched Page!</h1>
      <hr />
      <h3>
        Back to home page in {count} seconds or go{' '}
        <Link to={'/home'}>Home Page</Link> directly
      </h3>
    </div>
  )
}

export default NoMatch
