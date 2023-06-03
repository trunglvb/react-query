/* eslint-disable react-hooks/exhaustive-deps */
import { getStudents, deleteStudent } from 'apis/student.api'
import { Link } from 'react-router-dom'
import { IStudentsList } from 'types/student.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useQueryString from 'utils/useQueryString'
import { v4 as uuidv4 } from 'uuid'
import classNames from 'classnames'
import { toast } from 'react-toastify'
export default function Students() {
  const limit = 10
  const queryString: { page?: string } = useQueryString()
  const queryClient = useQueryClient()
  const page = Number(queryString?.page) || 1
  const studentQuery = useQuery({
    queryKey: [
      'students',
      {
        page
      }
    ],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getStudents(
        {
          page: page,
          limit: limit
        },
        controller.signal
      )
    },
    keepPreviousData: true,
    retry: 0
  })
  const totalCount = Number(studentQuery.data?.headers['x-total-count'])
  const totalPage = Math.ceil(totalCount / limit)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => deleteStudent(id)
  })

  const handleDeleteStudent = (id: string | number) => {
    deleteStudentMutation.mutate(id, {
      onSuccess: () => {
        toast.success('delete Successfully')

        //invalidateQueries de cap nhat lai data tren UI
        queryClient.invalidateQueries({
          queryKey: [
            'students',
            {
              page
            }
          ],
          exact: true
        })
      }
    })
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className='mt-6 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '>
        <Link to={'/students/add'}>Add Student</Link>
      </div>
      <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='py-3 px-6'>
                #
              </th>
              <th scope='col' className='py-3 px-6'>
                Avatar
              </th>
              <th scope='col' className='py-3 px-6'>
                Name
              </th>
              <th scope='col' className='py-3 px-6'>
                Email
              </th>
              <th scope='col' className='py-3 px-6'>
                <span className='sr-only'>Action</span>
              </th>
            </tr>
          </thead>

          {studentQuery.isLoading ? (
            <tbody>
              <tr>
                <td>Loading</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {studentQuery?.data?.data.map((student: IStudentsList) => (
                <tr
                  key={student.id}
                  className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                >
                  <td className='py-4 px-6'>{student.id}</td>
                  <td className='py-4 px-6'>
                    <img src={student.avatar} alt='student' className='h-5 w-5' />
                  </td>
                  <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                    {student.last_name}
                  </th>
                  <td className='py-4 px-6'>{student.email}</td>
                  <td className='py-4 px-6 text-right'>
                    <Link
                      to={`/students/${student.id}`}
                      className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      // onMouseEnter={() => handlePreFetchQuery(student.id)}
                    >
                      Edit
                    </Link>
                    <button
                      className='font-medium text-red-600 dark:text-red-500'
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {!studentQuery.isLoading && (
        <div className='mt-6 flex justify-center'>
          <nav aria-label='Page navigation example'>
            <ul className='inline-flex -space-x-px'>
              <li>
                {page === 1 ? (
                  <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                    Previous
                  </span>
                ) : (
                  <Link
                    to={`/students?page=${page - 1}`}
                    className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  >
                    Previous
                  </Link>
                )}
              </li>
              {Array(totalPage ? toast : 0)
                .fill(0)
                .map((_, index) => {
                  const isActive = page === index + 1
                  return (
                    <li key={uuidv4()}>
                      <Link
                        to={`/students?page=${index + 1}`}
                        className={classNames(
                          'border border-gray-300 py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 ',
                          {
                            'bg-red-500 text-gray-700': isActive
                          }
                        )}
                      >
                        {index + 1}
                      </Link>
                    </li>
                  )
                })}

              <li>
                {page === totalPage ? (
                  <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                    Next
                  </span>
                ) : (
                  <Link
                    to={`/students?page=${page + 1}`}
                    className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  >
                    Next
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
