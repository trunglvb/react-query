import { IStudentsList, IStudent } from 'types/student.type'
import http from 'utils/http'

export const getStudents = (params: { page: number | string; limit: number | string }, signal?: AbortSignal) =>
  http.get<IStudentsList[]>('students', {
    params: {
      _page: params.page,
      _limit: params.limit
    },
    signal: signal
  })

export const addStudent = (params: Omit<IStudent, 'id'>) => http.post<IStudent>('students', params)

export const getStudent = (id: number | string) => http.get<IStudent>(`students/${id}`)

export const updateStudent = (id: string | number, student: IStudent) => http.put(`/students/${id}`, student)

export const deleteStudent = (id: string | number) => http.delete(`students/${id}`)

//post<: kieu tra ve>
