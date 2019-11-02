import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const buttonStyle = `
    background: black;
    color: white;
    border: 0;
    border-radius: 0.3rem;
    margin: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const StyledLink = styled(Link)`
    ${buttonStyle}
    text-decoration: none;
`
export const Button = styled.button`
    ${buttonStyle}
`
export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`

