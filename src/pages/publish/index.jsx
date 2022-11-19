import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  message,
  Spin
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useHistory, useParams } from 'react-router-dom'
// quill (text-editor) component
import ReactQuill from 'react-quill'
// import quill style
import 'react-quill/dist/quill.snow.css'
import Channel from '@/components/channels'

import styles from './index.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { postArticleAction } from '@/store/actions'
import request from '@/utils/request'

export const Publish = () => {
  // store filelist when switching btw 1 image and 3 images
  const fileListRef = useRef([])
  const dispatch = useDispatch()
  const history = useHistory()
  // create form instance
  const [formInstance] = Form.useForm()
  // 管控Loading status,
  const [loading, setLoading] = useState(false)

  // upload image(s)： change the component inot controlled
  // params @fileList, store images array [{url: 'url'}, ...]
  const [fileList, setFileList] = useState([])
  // config max number of uploaded images
  const [maxNum, setMaxNum] = useState(1)
  const changeImgNum = e => {
    // console.log(e.target.value)
    let numOfImgs = e.target.value
    setMaxNum(numOfImgs)
    // 点击单图，只显示最近一张图片
    if (numOfImgs === 1) {
      const firstImg = fileListRef.current[0]

      setFileList(firstImg ? [firstImg] : [])
    } else if (numOfImgs === 3) {
      setFileList(fileListRef.current)
    }
  }

  // handle images uploading
  const handleImgUpload = info => {
    const newFileList = info.fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    fileListRef.current = newFileList

    setFileList(newFileList)
  }

  // config image-uploading props
  const imgUploadProps = {
    action: 'http://geek.itheima.net/v1_0/upload',
    onChange: handleImgUpload,
    multiple: maxNum > 1
  }

  // 通过路径参数，获取article id,
  const { articleId } = useParams()
  const isEdit = !!articleId
  useEffect(() => {
    // 如果是非编辑状体，则清空表单
    if (!isEdit) {
      formInstance.resetFields()
      setFileList([])
      fileListRef.current = []
    }
    const loadArticle = async () => {
      // if no articleId, do nothing
      if (!isEdit) return setLoading(false)

      // editing status，if articleId exits
      setLoading(true)
      const res = await request.get('mp/articles/' + articleId)
      setLoading(false)
      const {
        id,
        channel_id,
        title,
        content,
        cover: { type, images }
      } = res

      const formData = {
        id,
        channel_id,
        title,
        content,
        type
      }
      // 回填数据到表单
      formInstance.setFieldsValue(formData)
      // 回填图片 [{url:'url'}]
      const imgList = images.map(file => ({ url: file }))
      setFileList(imgList)
      // 控制最大上传图片数量
      setMaxNum(type)
      // 存储图片列表对象
      fileListRef.current = imgList
    }
    loadArticle()
  }, [articleId, formInstance, isEdit])

  // to post an article or save as draft, determined by @params isDraft
  // @params isDraft true: save as draft
  const postArticle = (isDraft = false, values) => {
    //  图片数量必须与所选张数一致
    const { type, ...rest } = values

    if (type !== fileList.length) {
      return message.error('图片数量必须与所选张数一致')
    }

    const imgList = fileList.map(file => file.url)

    const data = {
      ...rest,
      cover: {
        type,
        images: imgList
      }
    }

    if (isEdit) data.id = articleId

    try {
      dispatch(postArticleAction(isDraft, data, isEdit))
      const txt = isDraft
        ? 'successfully save your article as draft'
        : 'successfully post your article'
      message.success(txt, 1, () => {
        // locate to article page after posting
        history.push('/home/article')
      })
    } catch (error) {
      Promise.reject(error || 'failed to post your article')
    }
  }

  const saveAsDraft = async () => {
    // console.log(formInstance.getFieldsValue(true))
    try {
      // 表单验证，成功返回表单数据
      const values = await formInstance.validateFields()

      postArticle(true, values)
    } catch (error) {
      message.error(error)
      Promise.reject(error)
    }
  }

  const onFinish = values => {
    // post an article
    postArticle(false, values)
  }

  return (
    <div className={styles.root}>
      <Spin size='large' spinning={loading} tip='loading loading '>
        <Card
          title={
            <Breadcrumb separator='>'>
              <Breadcrumb.Item>
                <Link to='/home'>首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {articleId ? '编辑' : '发布'}文章
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ type: 1, content: '' }}
            onFinish={onFinish}
            form={formInstance}
          >
            <Form.Item
              label='标题'
              name='title'
              rules={[{ required: true, message: '请输入文章标题' }]}
            >
              <Input placeholder='请输入文章标题' style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label='频道'
              name='channel_id'
              rules={[{ required: true, message: '请选择文章频道' }]}
            >
              {/* 导入频道组件 */}
              {/* <Select placeholder='请选择文章频道' style={{ width: 400 }}>
              <Option value={0}>推荐</Option>
            </Select> */}
              <Channel width={{ width: 400 }} />
            </Form.Item>
            {/* 图片数量选择 */}
            <Form.Item label='封面'>
              <Form.Item name='type'>
                <Radio.Group value={maxNum} onChange={changeImgNum}>
                  <Radio value={1}>单图</Radio>
                  <Radio value={3}>三图</Radio>
                  <Radio value={0}>无图</Radio>
                  {/* <Radio value={-1}>自动</Radio> */}
                </Radio.Group>
              </Form.Item>
              {/* 上传图片组件 */}
              {maxNum > 0 && (
                <Upload
                  name='image'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList
                  fileList={fileList}
                  {...imgUploadProps}
                  maxCount={maxNum}
                >
                  {/* 上传图标 */}
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined />
                  </div>
                </Upload>
              )}
            </Form.Item>
            {/* 富文本区域 */}
            <Form.Item
              label='内容'
              name='content'
              rules={[{ required: true, message: '请输入文章内容' }]}
            >
              {/* 内容 */}
              <ReactQuill
                theme='snow'
                placeholder='please input your comments'
              />
            </Form.Item>

            {/* 发布 & 存草稿 按钮 */}
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size='large' type='primary' htmlType='submit'>
                  {articleId ? '编辑' : '发布'}文章
                </Button>
                <Button size='large' onClick={saveAsDraft}>
                  存入草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}
