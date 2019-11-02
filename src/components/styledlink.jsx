import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const buttonStyle = `
    background: black;
    color: white;
    border: 0;
    border-radius: 3px;
    margin: 5px;
    cursor: pointer;
`

export const StyledLink = styled(Link)`
    ${buttonStyle}
    text-decoration: none;
`
