import { useContext, useEffect, useState } from 'react'
import { postRequest } from '../api/utils'
import { usePostRequest } from '../hooks/useRequest'
import { AuthenticationContext } from '../context/Authentication'
//
//export const getGeocodes = async ([geocode, focus, token]) => {
//  console.log(geocode, focus, token)
//  const res = await fetch('http://localhost:8080/ors/geocode',{
//    method: 'POST',
//    headers: {
//      'content-type':'application/json',
//      'accepts':'application/json, application/geo+json',
//      'authorization': `Bearer ${token}`
//    },
//    body: JSON.stringify({geocode, focus})
//  })
//
//  if (!res.ok) throw new Error(res.statusText)
//  return res.json()
//}
//
//export const useGeoCode = (geoCode, focus) => {
//  const { token } = useContext(AuthenticationContext)
//  const [payload, setPayload] = useState(() => {
//    return geoCode && focus
//      ? { geoCode, focus }
//      : null
//  })
//
//  useEffect(() => {
//    setPayload(() => {
//      return geoCode && focus
//        ? { geoCode, focus }
//        : null
//    })
//  },[geoCode, focus])
//
//  const { data, reload, fetchState } = usePostRequest(
//    '/ors/geocode', payload, token
//  )
//
//  return { data, reload, fetchState }
//}
//
//export const getDirections = async ([endpoints, token]) => {
//  if (endpoints) {
//    const url = new URL('/ors/directions', BASEURL)
//    const res = await fetch(url,{
//      method: 'POST',
//      headers: {
//        'Content-type':'application/json',
//        'Accept':'application/json, application/geo+json',
//        'Authorization': `Bearer ${token}`
//      },
//      body: JSON.stringify(endpoints)
//    })
//    console.log(res.statusText)
//    if (!res.ok) throw new Error(res.statusText)
//    return res.json()
//  }
//}

export const getGeocodes = postRequest('/ors/geocode')
export const getDirections = postRequest('/ors/directions')
