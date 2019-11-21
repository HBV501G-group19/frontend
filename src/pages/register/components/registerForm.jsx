import React from 'react'
import styled from 'styled-components'

import { Grid } from '@material-ui/core'
import { Input, Form } from '../../../components/forms/input'
import { StyledLink as Link, Button, ButtonContainer } from '../../../components/styles'

export const RegisterForm = ({
    submit,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirm,
    setConfirm
}) => {
    return (
        <>
            <h2>Register</h2>
            <Form onSubmit={submit}>
                <Input
                    value={username}
                    onChange={setUsername}
                    label="Username"
                />
                <Input
                    value={email}
                    onChange={setEmail}
                    label="Email"
                    placeholder="example@example.org"
                />
                <Input
                    value={password}
                    onChange={setPassword}
                    type="password"
                    label="Password"
                />
                <Input
                    value={confirm}
                    onChange={setConfirm}
                    type="password"
                    label="Confirm your password"
                />
                <Grid
                  container
                >
                    <Button type="submit">Submit</Button>
                    <Link to="/login">Login</Link>
                </Grid>
            </Form>
        </>
    )
}
