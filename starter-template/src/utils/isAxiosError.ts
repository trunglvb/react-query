import axios, { AxiosError } from 'axios'

//neu ham return ve true thi error co dang axiosError
const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export default isAxiosError
