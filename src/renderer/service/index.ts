import { http } from '../request'

export const getCommon = () => {
  return http.get('/api/common/get')
}