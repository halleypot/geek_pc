import { Link, useHistory } from 'react-router-dom'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Tag,
  Space,
  Table,
  Modal,
  message,
  Spin
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
// import 404 image
import img404 from '@/assets/error.png'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getArticleAction, deleteArtAction } from '@/store/actions'
import Channel from '@/components/channels'

const { RangePicker } = DatePicker
const { confirm } = Modal
// handling with article status
const articleStatus = {
  0: { color: 'yellow', text: '草稿' },
  1: { color: '#ccc', text: '待审核' },
  2: { color: 'green', text: '审核通过' },
  3: { color: 'red', text: '审核失败' }
}

export const Article = () => {
  const history = useHistory()
  // control loading status
  const [loading, setLoading] = useState(false)
  // 表格columns配置
  const columns = [
    // 第一列第一栏
    {
      title: '封面',
      // 渲染数据源 (来自data列表中对于的属性cover)
      dataIndex: 'cover',
      render: cover => {
        return <img src={cover || img404} width={200} height={150} alt='' />
      },
      align: 'center'
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => (
        <Tag color={articleStatus[data].color}>{articleStatus[data].text}</Tag>
      ),
      align: 'center'
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
      align: 'center'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      align: 'center'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      align: 'center'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      align: 'center'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size='middle'>
            <Button
              type='primary'
              shape='circle'
              icon={<EditOutlined />}
              onClick={() => history.push('/home/publish/' + data.id)}
            />
            <Button
              type='primary'
              danger
              shape='circle'
              icon={<DeleteOutlined onClick={() => confirmToDel(data)} />}
            />
          </Space>
        )
      },
      align: 'center'
    }
  ]

  const dispatch = useDispatch()
  useEffect(() => {
    // get article list
    setLoading(true)
    try {
      dispatch(getArticleAction({}))
    } catch (error) {
      message.error(error || 'fail to laoding articles')
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  // console.log(channelsList)

  // table-rendering data source
  const { list, count, page } = useSelector(state => state.article.article)

  // filter table data
  const onFilter = value => {
    // filter article list
    setLoading(true)
    const { status, channel_id, date } = value
    const params = { channel_id }

    if (status !== -1) {
      params.status = status
    }
    if (!!date) {
      params.begin_pubdate = date[0].format('YYYY-MM-DD')
      params.end_pubdate = date[1].format('YYYY-MM-DD')
    }

    try {
      dispatch(getArticleAction(params))
      paramsRef.current = params
    } catch (error) {
      Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // store params when redering component
  let paramsRef = useRef({})
  // change current page number
  const changePage = (page, pageSize) => {
    // console.log(page, pageSize)
    setLoading(true)
    try {
      dispatch(
        getArticleAction({
          ...paramsRef.current,
          page,
          per_page: pageSize
        })
      )
      paramsRef.current = { ...paramsRef.current, page, per_page: pageSize }
    } catch (error) {
      Promise.reject(error)
    } finally {
      setLoading(false)
    }
  }

  // click button to delete an article
  const confirmToDel = data => {
    confirm({
      title: 'Do you Want to delete this article?',
      icon: <ExclamationCircleOutlined />,
      content: 'be careful of your attention',
      onOk () {
        // console.log(data)
        dispatch(deleteArtAction(data.id, paramsRef.current))
      },
      onCancel () {
        message.info('cancel to delete')
      }
    })
  }

  return (
    <>
      {/* 导航头部 */}
      <Spin spinning={loading}>
        <Card
          title={
            <Breadcrumb separator='>'>
              <Breadcrumb.Item>
                <Link to='/home'>首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>内容管理</Breadcrumb.Item>
            </Breadcrumb>
          }
          style={{ marginBottom: 20 }}
        >
          {/* 筛选状态按钮 */}
          <Form initialValues={{ status: -1 }} onFinish={onFilter}>
            <Form.Item label='状态' name='status'>
              <Radio.Group>
                <Radio value={-1}>全部</Radio>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>待审核</Radio>
                <Radio value={2}>审核通过</Radio>
                <Radio value={3}>审核失败</Radio>
              </Radio.Group>
            </Form.Item>
            {/* channels selected option */}
            <Form.Item label='频道' name='channel_id'>
              <Channel width={{ width: 300 }} />
            </Form.Item>

            {/* 日期选择 */}
            <Form.Item label='日期' name='date'>
              <RangePicker
                style={{ width: 300 }}
                locale={locale}
                format='YYYY-MM-DD'
              ></RangePicker>
            </Form.Item>
            {/* 提交按钮 */}
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>
        {/* table section */}
        <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={list}
            pagination={{
              position: ['bottomLeft'],
              current: page, //当前页面
              total: count, //总条数，
              onChange: changePage //页码变化触发
            }}
          />
        </Card>
      </Spin>
    </>
  )
}
