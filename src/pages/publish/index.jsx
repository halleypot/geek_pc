import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useHistory, useParams } from 'react-router-dom'
// quill (text-editor) component
import ReactQuill from 'react-quill'
// import quill style
import 'react-quill/dist/quill.snow.css'
import Channel from '@/components/channels'

import styles from './index.module.scss'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { postArticleAction } from '@/store/actions'

export const Publish = () => {
  // store filelist when switching btw 1 image and 3 images
  const fileListRef = useRef([])
  const dispatch = useDispatch()
  const history = useHistory()

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

  const { articleId } = useParams()

  // to post an article or save as draft, determined by @params isDraft
  // @params isDraft true: save as draft
  const postArticle = (isDraft = false, type, rest) => {
    //  图片数量必须与所选张数一致
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

    try {
      dispatch(postArticleAction(isDraft, data))
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

  // create form instance
  const [formInstance] = Form.useForm()

  const saveAsDraft = () => {
    console.log(formInstance.getFieldsValue(true))
    const { type, ...rest } = formInstance.getFieldsValue(true)

    postArticle(true, type, rest)
  }

  const onFinish = ({ type, ...rest }) => {
    // post an article
    postArticle(false, type, rest)
  }
  return (
    <div className={styles.root}>
      <Card
        title={
          <Breadcrumb separator='>'>
            <Breadcrumb.Item>
              <Link to='/home'>首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>发布文章</Breadcrumb.Item>
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
            <ReactQuill theme='snow' placeholder='please input your comments' />
          </Form.Item>

          {/* 发布 & 存草稿 按钮 */}
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size='large' type='primary' htmlType='submit'>
                发布文章
              </Button>
              <Button size='large' onClick={saveAsDraft}>
                存入草稿
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
