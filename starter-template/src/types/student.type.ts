export interface IStudent {
  id: string | number
  first_name: string
  last_name: string
  email: string
  gender: string
  country: string
  avatar: string
  btc_address: string
}

export type IStudentsList = Pick<IStudent, 'id' | 'email' | 'avatar' | 'last_name'>
