import {useState, useEffect, useContext} from 'react'
import {AuthenticationContext} from '../context/Authentication'

const baseurl = process.env.REACT_APP_API_URL

const useLog = item => {
  useEffect(() => {console.log(item)}, [item])
}

const usePrevVal = init => {
  const [prev, setPrev] = useState(null)
  const [curr, setCurr] = useState(init)

  const setState = newVal => {
    setPrev(curr)
    setCurr(newVal)
  }

  return [prev, curr, setState]
}

export const usePostReq = (path, auth) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState(null)

  const {token, authenticated} = useContext(AuthenticationContext)

  const url = new URL(path, baseurl)


  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const headers = {
        'Content-type': 'application/json',
        Accept: 'application/json'
      }

      if (authenticated) headers.Authorization = `Bearer ${token}`
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        })
        const json = await response.json()

        setData({
          status: response.status,
          body: json
        })

      } catch (e) {
        setData({
          error: [{
            field: 'fetching',
            message: 'Unknown error :('
          }]
        })
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    let mounted = true
    if (mounted && body && !loading)
      getData()

    return () => {
      mounted = false
    }
  },[body, setData, setLoading,loading, token, authenticated])

  return { data, loading, setBody }
}

