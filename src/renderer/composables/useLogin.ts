import { ref } from "vue";

export function useLogin() {
  const isLogin = ref(false);

  return {
    isLogin,
  };
}