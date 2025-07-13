import { http } from '../request'

export const getCommon = (params: any) => {
  return http.get('/api/common/get', {
    params,
  })
}