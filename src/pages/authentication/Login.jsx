import React, { useState, useContext } from 'react'
import { Redirect } from "react-router-dom"
import { Grid, makeStyles } from '@material-ui/core'

import { Input, Form } from '../../components/forms/input'
import { StyledLink as Link, Button, ButtonContainer } from '../../components/styles'
import { useLogin } from './hooks/useLogin'
import { AuthenticationContext } from '../../context/Authentication'

import styled from 'styled-components'

export const Login = props => {
  const { authenticated } = useContext(AuthenticationContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const {status, data, login} = useLogin()
  
  const loginHandler = async e => {
    e.preventDefault()
    login(username, password)
  }



  if (authenticated) return <Redirect to="/" />
  return (
    <>
      <h2>Login</h2>
      {
        data.body ? <h3>{data.body.error}</h3> : null
      }
      <Form onSubmit={loginHandler}>
        <Input
          value={username}
          onChange={setUsername}
          label="Username"
        />
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          label="Password"/>
        <Grid
          container
        >
          <Button
            type="submit"
            onClick={loginHandler}
            disabled={status.loading}
          >
            Login
          </Button>
          <Link 
            to="/register"
          >
            Register
          </Link>
        </Grid>
      </Form>
    </>
  )
}
