const initialState = {
  channelsList: [],
  article: {
    page: 1,
    pageSize: 10,
    list: [],
    count: 0
  }
}

export const article = (state = initialState, actions) => {
  switch (actions.type) {
    case 'article/getChannels':
      return {
        ...initialState,
        channelsList: actions.payload
      }
    case 'article/getArticle':
      return {
        ...state,
        article: actions.payload
      }

    default:
      return state
  }
}
