import './index.scss'
import logo from '@/assets/logo.png'
import { Card } from 'antd'
import { Button, Checkbox, Form, Input, message } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { loginAction } from '@/store/actions'
import { useHistory, useLocation } from 'react-router-dom'

function Login () {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const onFinish = async values => {
    console.log('Success:', values)
    try {
      await dispatch(loginAction(values))
      // return to the previous page
      history.replace(location.state?.from || '/home')
    } catch (error) {
      // console.log(error.message || 'incorrect number')
      message.error(error?.message || 'fail to login')
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  // valiate agreement policy
  const validateAgree = (_, value) => {
    if (value) return Promise.resolve()

    return Promise.reject(new Error('should accept agreement'))
  }

  return (
    <div className='login'>
      <Card className='login-container'>
        <img className='login-logo' src={logo} alt='' />
        {/* 登录表单 */}
        <Form
          // 表格左侧lable样式
          labelCol={{
            span: 5
          }}
          // wrapperCol={{
          //   span: 2
          // }}
          initialValues={{
            mobile: '13911111111',
            code: '246810',
            remember: false
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          validateTrigger={['onBlur', 'onChange']}
        >
          {/* mobile 输入框 */}
          <Form.Item
            label='Mobile'
            name='mobile'
            rules={[
              {
                required: true,
                message: 'Please input your mobile!'
              },
              {
                pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
                message: 'please input a correct form of mobile',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input placeholder='mobile number' />
          </Form.Item>

          {/* 密码输入框 */}
          <Form.Item
            label='Code'
            name='code'
            rules={[
              {
                required: true,
                message: 'Please input your code!'
              }
            ]}
          >
            <Input.Password placeholder='security code' />
          </Form.Item>

          {/* 同意协议 */}
          <Form.Item
            name='remember'
            valuePropName='checked'
            wrapperCol={{
              offset: 5,
              span: 24
            }}
            rules={[
              {
                validator: validateAgree
              }
            ]}
          >
            <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5
            }}
          >
            <Button block type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
