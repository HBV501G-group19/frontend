import {useEffect, useState, useContext} from 'react'
import { usePostReq } from '../../../hooks/usePostReq'
import { AuthenticationContext } from '../../../context/Authentication'


export const useLogin = () => {
  const {data, loading, setBody} = usePostReq('/users/authenticate')
  const { setAuth } = useContext(AuthenticationContext)
  if (setAuth == null)
    throw new Error('useLogin can only be called under AuthenticationContext')
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const login = (u, p) => {
    setUsername(u)
    setPassword(p)
  }

  const logout = () => {
    setAuth(null, null)
  }

  const [status, setStatus] = useState({
    success: false,
    loading
  })

  useEffect(() => {
    if(username != null && password != null)
      setBody({username, password})
  }, [username, password, setBody])

  useEffect(() => {
      if (data && data.status === 200) {
        const {body: {token, username, id}} = data
        setAuth({username, id}, token)
        setStatus({
          success: true,
          loading
        })
      } else {
        setStatus({
          success: false,
          loading
        })
      }
  }, [loading, data, setAuth])
  return {status, data, login, logout}
}

