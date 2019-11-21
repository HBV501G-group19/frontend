import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthenticationContext } from '../../context/Authentication'

export const Logout = props => {
  const { authenticated, removeAuth } = useContext(AuthenticationContext)
  console.log(removeAuth)
  const [redirect, setRedirect] = useState(false)
  useEffect(() => {
    removeAuth()
    setRedirect(true)
  }, [authenticated, setRedirect])
  
  if (redirect) {
    return <Redirect to="/login" />
  } else {
    return <Redirect to="/login" />
  }
}
