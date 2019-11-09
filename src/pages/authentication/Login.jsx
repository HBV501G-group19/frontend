import React, { useState } from 'react'
import { Input } from '../../components/forms/input'
import { StyledLink as Link, Button, ButtonContainer } from '../../components/styles'
import { useLogin } from './hooks/useLogin'

export const Login = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const {status, data, login} = useLogin()

  const loginHandler = async e => {
    e.preventDefault()
    login(username, password)
  }

  return (
    <>
      <h2>Login</h2>
      {
        data.body ? <h3>{data.body.error}</h3> : null
      }
      <form onSubmit={loginHandler}>
        <Input
          value={username}
          setValue={setUsername}
          label="Username"
        />
        <Input
          value={password}
          setValue={setPassword}
          type="password"
          label="Password"/>
        <ButtonContainer>
          <Button disabled={status.loading}>Login</Button>
          <Link to="/register">Register</Link>
        </ButtonContainer>
      </form>
    </>
  )
}
