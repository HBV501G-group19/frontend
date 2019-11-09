import React, { useContext } from 'react'
import styled from 'styled-components'
import { AuthenticationContext } from '../../context/Authentication'
import { StyledLink as Link } from '../styles'

const Links = styled.nav`
  display: flex;
  margin-top: auto;
  & > :last-child {
    justify-self: flex-end;
    margin-left: auto;
  }
`

export const Navbar = props => {
  const { removeAuth } = useContext(AuthenticationContext)
  return (
    <Links>
      <Link>Messages</Link>
      <Link>Profile</Link>
      <Link>Settings</Link>
      <Link onClick={removeAuth}>Logout</Link>
    </Links>
  )
}

