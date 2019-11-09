import React, { useState, useEffect, useContext } from 'react'
import { AuthenticationContext } from '../../../context/Authentication'
import { usePostReq } from '../../../hooks/usePostReq'

import { SearchRideForm } from './components/SearchRideForm'

export const SearchRide = props => {
  const { user: {id} } = useContext(AuthenticationContext)
  const [formData, setFormData ] = useState(null)
  const { data, loading, setBody } = usePostReq('/rides/convenient')
  useEffect(() => {

    if (formData && !loading) {
      setBody({
        ...formData,
        userId: id,
        range: [300]
      })
    }
  }, [formData])
  
  return (
    <SearchRideForm submitData={setFormData} />
  )
}
