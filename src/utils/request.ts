import axios from 'axios'
import { getToken } from '@/utils/cookies'
import { Message } from 'element-ui'
import router from '@/router';
axios.defaults.baseURL = process.env.VUE_APP_SERVER_API;
axios.defaults.headers.common['Pragma'] = 'no-cache'
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
class AxiosInterceptor {
  public static init(): void {
    axios.interceptors.response.use(
      (response: any) => {
        const data = response.data || response;
        if (data.code !== 0 && response.config.responseType != 'blob') {
          const { msg, message } = data;

          Message({
            message: msg,
            type: 'error',
            duration: 5 * 1000
          })
          throw new Error(message);
        }
        return data;
      },
      (err: any) => {
        const { response } = err;
        // 未登录的情况下就跳转登录
        if (response && response.status === 401) {
          router.replace('/login');
        }

        if (err.message === 'Network Error') {
          err.message = '操作失败，请检查输入项或稍后重试';
        }

        // throw new Error((response && response.data && response.data.title) || err.message);
      },
    );

  }

  public static setToken(token: string, prefix?: string): void {
    prefix = 'Bearer'
    axios.defaults.headers.common.Authorization = `${prefix} ${token}`;
  }
}
export default AxiosInterceptor
