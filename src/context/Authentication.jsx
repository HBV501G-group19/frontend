import React, {createContext, useState, useEffect} from 'react'

export const AuthenticationContext = createContext(null)

const useLocalStorage = (key, init) => {
  const [storedValue, _setVal] = useState(() => {
    const item = localStorage.getItem(key)
    try {
      return item ? JSON.parse(item) : init
    } catch (e) {
      return init
    }
  })

  const setVal = value => {
    if (value == null) {
      localStorage.removeItem(key)
    } else {
      const json = JSON.stringify(value)
      localStorage.setItem(key, json)
      _setVal(value)
    }
  }
  return [storedValue, setVal]
}

export const Authentication = ({children}) => {
  const [user, setUser] = useLocalStorage('user', null)
  const [token, setToken] = useLocalStorage('token', null)
  const [authenticated, setAuthenticated] = useState(false)

  const setAuth = (u, t) => {
    setUser(u)
    setToken(t)
  }

  const removeAuth = () => {
    console.log('yahey')
    setAuthenticated(false)
    setUser(null)
    setToken(null)
  }

  useEffect(() => {
    if (user != null && token != null && token !== '') {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  }, [user, token, setAuthenticated])
  const auth = {authenticated, user, token, setAuth, removeAuth}
  return (
    <AuthenticationContext.Provider value={auth}>
      {children}
    </AuthenticationContext.Provider>
  )
}
