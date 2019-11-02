import React, { useState, useContext } from "react";
import { Leaflet, MapContext, useMarker, useLeaflet } from "../../components/leaflet"
import styled from 'styled-components'
import { Input } from '../../components/input'
import { Sidebar } from '../../components/sidebar'
import { StyledLink as Link, Button } from '../../components/styles'

const Search = styled.form`
    display: flex;
    flex-direction: column;
`

const Links = styled.nav`
    display: flex;
`

const authenticated = false
export const Home = props => {
    const state = useLeaflet()
    console.log(state)
    return(
        <>
            <Search>
                <Input label="I'm leaving" />
                <Input label="to" />
                <p>at 19:00</p>
                {
                    authenticated
                    ? <Button>Search</Button>
                    : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )
                }
            </Search>
            <Links>
                {
                authenticated
                ? (
                <>
                     <Link>Messages</Link>
                     <Link>Profile</Link>
                     <Link>Settings</Link>
                 </>
                 )
               : null
                }
            </Links>
        </>
    )
}
