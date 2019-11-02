import React from 'react'
import styled from 'styled-components'

import { Input } from '../../../components/input'
import { Sidebar } from '../../../components/sidebar'
import { StyledLink as Link, Button, ButtonContainer } from '../../../components/styles'

const Form = styled.form`
    display: flex;
    flex-direction: column;
`
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
                    setValue={setUsername}
                    label="Username"
                />
                <Input
                    value={email}
                    setValue={setEmail}
                    label="Email"
                    placeholder="example@example.org"
                />
                <Input
                    value={password}
                    setValue={setPassword}
                    type="password"
                    label="Password"
                />
                <Input
                    value={confirm}
                    setValue={setConfirm}
                    type="password"
                    label="Confirm your password"
                />
                <ButtonContainer>
                    <Button>Submit</Button>
                    <Link to="/login">Login</Link>
                </ButtonContainer>
            </Form>
        </>
    )
}
