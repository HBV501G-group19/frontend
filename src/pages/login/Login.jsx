import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Input } from '../../components/input'
import { StyledLink as Link, Button, ButtonContainer } from '../../components/styles'
import { usePath } from '../../components/leaflet'
import { usePostReq } from '../../hooks/usePostReq'
import { ValidationList } from '../../components/forms'

const Path = ({path = []}) => {
    usePath(path)
    return null
}
export const Login = props => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const {
        data,
        loading,
        setBody
    } = usePostReq('/login')

    let history = useHistory();
    let location = useLocation();

    const login = async e => {
        e.preventDefault()
        const { from } = location.state || { from: { pathname: '/'} }
        // login logic goes here
        console.log({username, password})
        setBody({
            username,
            password
        })
       // if (!loading && !data.error) history.replace(from)
    }

    return (
        <>
            <h2>Login</h2>
            <ValidationList errors={data.error}/>
            <form onSubmit={login}>
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
                    <Button disabled={loading}>Login</Button>
                    <Link to="/register">Register</Link>
                </ButtonContainer>
            </form>
        </>
    )
}
