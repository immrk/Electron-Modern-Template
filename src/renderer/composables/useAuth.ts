import { ref, onMounted, onUnmounted, watch } from "vue";

export function useAuth() {
  const userdata = ref<any>({})

  const getToken = async () => {
    const data = await window.auth.getToken()
    userdata.value = data.data
    localStorage.setItem('userdata', JSON.stringify(userdata.value))
    return userdata.value
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
  onMounted(async () => {
    // 初始化userdata
    getToken()
    // 监听token更新事件
    window.auth.onTokenChange(async () => {
      await getToken()
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