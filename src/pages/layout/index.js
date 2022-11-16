// children route components
import { Home } from '@/pages/home'
import { Article } from '@/pages/article'
import { Publish } from '@/pages/publish'

import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import style from './index.module.scss'
import { Route, Link, useLocation, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { userInfoAction, logoutAction } from '@/store/actions'

const { Header, Sider } = Layout

function Layouts () {
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()

  // send use info request
  useEffect(() => {
    try {
      dispatch(userInfoAction())
    } catch (error) {
      Promise.reject(error || "failed to request user's information")
    }
  }, [dispatch])

  const userInfo = useSelector(state => state.user)
  // console.log(userInfo)
  const currentKey = location.pathname.startsWith('/home/publish')
    ? '/home/publish'
    : location.pathname
  // console.log(currentKey)

  // log out event
  const confirmExit = () => {
    dispatch(logoutAction())
    history.push('/login')
  }

  return (
    <Layout className={style.root}>
      {/* header section: usename, logout */}
      <Header className='header'>
        <div className='logo' />
        {/* + 用户信息 */}
        <div className='user-info'>
          <span className='user-name'>{userInfo.name}</span>
          <span className='user-logout'>
            {/* logout component */}
            <Popconfirm
              title='是否确认退出？'
              okText='退出'
              cancelText='取消'
              onConfirm={confirmExit}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        {/* sidebar */}
        <Sider width={200} className='site-layout-background'>
          {/* + 菜单 */}
          <Menu
            mode='inline'
            theme='dark'
            selectedKeys={[currentKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key='/home'>
              <Link to='/home'>数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key='/home/article'>
              <Link to='/home/article'>内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key='/home/publish'>
              <Link to='/home/publish'>发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        {/* 右侧子页面内容 */}
        <Layout className='layout-content' style={{ padding: 20 }}>
          <Route exact path={'/home'} component={Home} />
          <Route path={'/home/article'} component={Article} />
          <Route path={'/home/publish/:articleId?'} component={Publish} />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Layouts
