import { login as loginAction, logout as logoutAction } from './login'
import { getUserInfo as userInfoAction } from './user'
import {
  getChannel as getChannelAction,
  getArticle as getArticleAction,
  deleteArtAction,
  postArticleAction
} from './article'

export {
  loginAction,
  userInfoAction,
  logoutAction,
  getChannelAction,
  getArticleAction,
  deleteArtAction,
  postArticleAction
}
