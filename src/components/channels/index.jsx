import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Select } from 'antd'
import { getChannelAction } from '@/store/actions'

const { Option } = Select

const Channel = ({ width = { width: 300 }, value, onChange }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    // request channels list
    dispatch(getChannelAction())
  }, [dispatch])
  // get channels list
  const {
    article: { channelsList }
  } = useSelector(state => state)
  return (
    <Select
      placeholder='请选择文章频道'
      style={width}
      value={value} //ant中，自定义组件必须提供value, onChange类似属性和方法
      onChange={onChange}
    >
      {/* <Option value='jack'>Jack</Option>
              <Option value='lucy'>Lucy</Option> */}
      {channelsList.map(item => (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  )
}

export default Channel
