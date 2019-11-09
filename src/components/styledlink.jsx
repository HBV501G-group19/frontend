import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const buttonStyle = `
    background: black;
    color: white;
    border: 0;
    border-radius: 3px;
    margin: 0.33em;
    padding: 0.66em
    cursor: pointer;
`

export const StyledLink = styled(Link)`
    ${buttonStyle}
    text-decoration: none;
`
