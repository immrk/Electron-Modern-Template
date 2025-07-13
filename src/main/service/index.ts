import { netRequest } from '../request'

export const getCommon = (params: any) => {
  return netRequest({
    url: '/api/common/get',
    method: 'GET',
    params,
  })
}