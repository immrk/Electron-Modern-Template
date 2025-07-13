import { ref, onMounted, onUnmounted, watch } from "vue";

export function useAuth() {
  const userdata = ref<any>({})

  const getToken = async () => {
    const data = await window.auth.getToken()
    return data
  }

  const login = async (data: any) => {
    await window.auth.login(data)
  }

  const tokenRefresh = async (data: any) => {
    const res = await window.auth.tokenRefresh(data)
    return res
  }

  const logout = async () => {
    const res = await window.auth.logout()
    userdata.value = {}
    localStorage.removeItem('userdata')
    return res
  }

  // 挂载token更新事件
  onMounted(() => {
    // 初始化userdata
    getToken().then((data) => {
      userdata.value = data.data
      localStorage.setItem('userdata', JSON.stringify(userdata.value))
    })
    // 监听token更新事件
    window.auth.onTokenChange((data: any) => {
      console.log('userdata更新', data.data)
      userdata.value = data.data
      localStorage.setItem('userdata', JSON.stringify(userdata.value))
    })
  })

  // 卸载token更新事件
  onUnmounted(() => {
    window.auth.removeTokenChangeListener()
  })

  return {
    getToken,
    login,
    tokenRefresh,
    logout,
    userdata,
  }
}