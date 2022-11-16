import request from '@/utils/request'

export const getChannel = () => {
  return async dispatch => {
    const { channels } = await request.get('/channels')
    // console.log(channels)
    dispatch({ type: 'article/getChannels', payload: channels })
  }
}

export const getArticle = payload => {
  return async dispatch => {
    const { page, per_page, results, total_count } = await request.get(
      '/mp/articles',
      { params: payload }
    )

    dispatch({
      type: 'article/getArticle',
      payload: {
        page,
        pageSize: per_page,
        list: results.map(item => ({
          ...item,
          cover: item.cover.images[0]
        })),
        count: total_count
      }
    })
  }
}

export const deleteArtAction = (id, params) => {
  return async dispatch => {
    // console.log(id)
    await request({
      url: `mp/articles/${id}`,
      method: 'delete'
    })
    // render table list after delete an article
    dispatch(getArticle(params))
  }
}

export const postArticleAction = (isDraft = false, data) => {
  return async () => {
    await request.post('mp/articles?draft=' + isDraft, data)
  }
}
