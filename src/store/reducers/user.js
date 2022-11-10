const initialState = {}

export const user = (state = initialState, actions) => {
  if (actions.type === 'user/getInfo') {
    // console.log('user action')
    return actions.payload
  }

  if (actions.type === 'user/clearInfo') {
    return {}
  }
  return state
}
