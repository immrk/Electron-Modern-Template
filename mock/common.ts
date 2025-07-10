export default [
  {
    url: '/api/common/get',
    method: 'get',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          name: 'John Doe',
          age: 25,
          email: 'john.doe@example.com'
        }
      }
    }
  },
]