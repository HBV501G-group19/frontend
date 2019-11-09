import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import './Global.scss'

import { AuthenticationContext } from './context/Authentication';
import { Home } from './pages/home/Home';
import { Login } from './pages/authentication/Login';
import { Register } from './pages/register/Register';
import { CreateRide } from './pages/rides/create/CreateRide'
import { SearchRide } from './pages/rides/search/SearchRide'
import { Leaflet, MapContainer } from './context/Map';
import { Sidebar } from './components/layout/sidebar';
import { Navbar } from './components/navbar/Navbar'
import { FlexContainer } from './components/layout/flex-items'

const options = {
  // get users location for center
    center: [64.140015, -21.94695],
    zoom: 10
}

const App = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const { authenticated } = useContext(AuthenticationContext);
  useEffect(() => {
    window.addEventListener('resize', () => setHeight(window.innerHeight));
    return () =>
      window.addEventListener('resize', () => setHeight(window.innerHeight));
  }, [setHeight]);
  return (
    <>
      <Leaflet id="map" options={options}>
        <FlexContainer>
          <Sidebar>
            <Router>
              <Switch>
                <Route path="/login">
                  {authenticated ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route path="/register">
                  {authenticated ? <Redirect to="/" /> : <Register />}
                </Route>
                <Route path="/rides/create">
                  {authenticated ? <CreateRide /> : <Redirect to="/login" />}
                </Route>
                <Route path="/rides/search">
                  {authenticated ? <SearchRide /> : <Redirect to="/login" />}
                </Route>
                <Route path="/">
                  {authenticated ? <Home /> : <Redirect to="/login" />}
                </Route>
              </Switch>
              { authenticated ? <Navbar /> : null }
            </Router>
          </Sidebar>
          <MapContainer height={height} id="map" />
        </FlexContainer>
      </Leaflet>
    </>
  );
}

export default App;
