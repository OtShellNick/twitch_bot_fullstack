import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Интерфейс для HTTP-сервиса
 */
export interface IHttpService {
  setRequestInterceptor: () => void;
  setResponseInterceptor: () => void;
}

/**
 * Реализация HTTP-сервиса
 */
class HttpService implements IHttpService {
  private retries: number;

  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: `${SERVER_URI}v1/` });
    this.retries = 3;
    this.setRequestInterceptor();
    this.setResponseInterceptor();
  }

  /**
   * Установить перехватчик запросов для добавления заголовка авторизации
   */
  setRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      config => {
        const authorization = localStorage.getItem('aubottok');
        if (authorization) {
          config.headers.Authorization = authorization;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );
  }

  /**
   * Установить перехватчик ответов для обработки обновления токена
   * @method setResponseInterceptor
   */
  async setResponseInterceptor(): Promise<void> {
    this.axiosInstance.interceptors.response.use(
      async response => {
        const {
          headers: { authorization },
          data: { data },
        } = response;

        console.log('@@response', response);

        if (authorization) {
          await localStorage.setItem('aubottok', authorization);
        }

        return { ...response, data };
      },
      async error => {
        console.log('@@error', error.response);
        return error;
        // if (
        //   error.response?.status &&
        //   (error.response.status === 403 || error.response.status === 401)
        // ) {
        //   if (!localStorage.getItem('aubottok') && location.pathname !== '/login') {
        //     location.replace('/login');
        //     return Promise.reject(error);
        //   }

        //   if (this.retries > 0) {
        //     try {
        //       const refreshResponse = await this.axiosInstance.request({
        //         method: 'POST',
        //         url: `auth/refresh`,
        //         data: {
        //           token: localStorage.getItem('aubottok'),
        //         },
        //       });
        //       await localStorage.setItem('aubottok', refreshResponse.data);
        //       this.retries = 3;
        //       // TODO: Добавить эмиттер на RxJS об успешном обновлении токена
        //     } catch (_error) {
        //       localStorage.removeItem('aubottok');
        //       location.replace('/login');
        //       return Promise.reject(_error);
        //     }
        //     this.retries--;
        //   }
        // }
        // return Promise.reject(error);
      },
    );
  }

  /**
   * Сделать API-запрос
   * @param options - Конфигурация запроса Axios
   * @returns Promise с ответом Axios
   */
  private api<T>(options: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>(options);
  }

  /**
   * Отправить GET-запрос
   * @param url - URL API
   * @param params - Параметры запроса
   * @param options - Дополнительные опции запроса
   * @returns Promise с ответом Axios
   */
  get<T>(url: string, params = {}, options = {}): Promise<AxiosResponse<T>> {
    return this.api<T>({
      url,
      params,
      method: 'GET',
      ...options,
    });
  }

  /**
   * Отправить POST-запрос
   * @param url - URL API
   * @param data - Тело запроса
   * @param options - Дополнительные опции запроса
   * @returns Promise с ответом Axios
   */
  post<T>(url: string, data = {}, options = {}): Promise<AxiosResponse<T>> {
    return this.api<T>({
      url,
      data,
      method: 'POST',
      ...options,
    });
  }

  put<T>(url: string, data = {}, options = {}): Promise<AxiosResponse<T>> {
    return this.api<T>({
      url,
      data,
      method: 'PUT',
      ...options,
    });
  }

  delete<T>(url: string, data = {}, options = {}): Promise<AxiosResponse<T>> {
    return this.api<T>({
      url,
      data,
      method: 'DELETE',
      ...options,
    });
  }
}

/**
 * Единственный экземпляр HTTP-сервиса
 */
export const Server = new HttpService();
