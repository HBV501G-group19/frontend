import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
} from "react-router-dom"
import styled from 'styled-components'

import { Home } from "./pages/home/Home"
import { Login } from "./pages/login/Login"
import { Register } from "./pages/register/Register"
import { Leaflet } from "./components/leaflet";
import { Sidebar } from './components/sidebar'
const MapContainer = styled.div`
    height: ${props => props.height}px;
    width: 100%;
`

const Flexbox = styled.div`
    display: flex;
    flex-direction: row;
`

function App() {
    const [height, setHeight] = useState(window.innerHeight)
    // const { isAuthenticated } = useContext(AuthenticationContext)
    const isAuthenticated = true
    useEffect(() => {
        window.addEventListener(
            'resize',
            () => setHeight(window.innerHeight),
        )

        return () => (
            window.addEventListener(
                'resize',
                () => setHeight(window.innerHeight)
            )
        )
    }, [window, setHeight])


    return (
        <>
            <Leaflet id="map">
                <Flexbox>
                    <Sidebar>
                <Router>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/">
                            {
                                isAuthenticated
                                ? <Home />
                                : <Redirect to="/login" />
                            }
                        </Route>
                    </Switch>
                </Router>
                </Sidebar>
                <MapContainer height={height} id="map" />
                </Flexbox>
            </Leaflet>
        </>
  );
}

export default App
