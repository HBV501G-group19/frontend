import { useEffect, useState, useRef, useCallback } from 'react'
const BASEURL = process.env.REACT_APP_API_URL

const FetchState = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  INVALID: 'INVALID',
  ERROR: 'ERROR'
}

export const useRequest = ({url, method, headers, initBody = null}) => {
  const [data, setData] = useState(undefined)
  const [body, setBody] = useState(initBody)
  const [fetchState, setFetchState] = useState(FetchState.IDLE)

  const isMountedRef = useRef(false)
  const count = useRef(0)

  const fetchData = useCallback(async () => {
    const { current: isMounted } = isMountedRef
    count.current++

    setFetchState(FetchState.LOADING)
    try {
      const res = await fetch(url, {
        method,
        headers,
        body
      })
      if (res.status < 300 && res.status > 199 && isMounted){
        const json = await res.json()
        await setData(json)
        setFetchState(FetchState.SUCCESS)
      } else if (isMounted) {
        setFetchState(FetchState.INVALID)
      }
    } catch (e) {
      if (isMounted) setFetchState(FetchState.ERROR)
    }
  }, [setFetchState, setData, body, method, headers])

  useEffect(() => {
    isMountedRef.current = true
    if (method === 'GET') {
      fetchData()
    } else if ((method === 'POST' || method === 'PATCH') && body != null) {
      fetchData()
    }

    return () => {
      isMountedRef.current = false
    }
  }, [method, body])

  return {
    data,
    setBody,
    fetchState,
    reload: fetchData,
    count: count.current
  }
}


export const usePostRequest = (path, payload, token) => {
  const url = new URL(path, BASEURL)
  const headers = {
    'content-type': 'application/json',
    'accepts': 'application/json, application/geo+json'
  }

  if (token) headers.authorization = `Bearer ${token}`

  const {
    setBody,
    data,
    fetchState,
    reload,
    count
  } = useRequest({url, method: 'POST', headers})

  useEffect(() => {
    if(payload) {
      const json = JSON.stringify(payload)
      setBody(json)
    }
  }, [payload])

  if(path === '/ors/directions')
  return { data, fetchState, reload, count }
}

