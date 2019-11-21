import React, { useState, useEffect, useContext } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";
import { Grid, LinearProgress } from "@material-ui/core";

import { Leaflet, MapContainer } from "./context/Map";
import { useLocationCoords } from "./hooks/useLocationCoords";
import { AuthenticationContext } from "./context/Authentication";

import { Home } from "./pages/home/Home";
import { Login } from "./pages/authentication/Login";
import { Logout } from "./pages/authentication/Logout";
import { Register } from "./pages/register/Register";
import { CreateRide } from "./pages/rides/create/CreateRide";
import { SearchRide } from "./pages/rides/search/SearchRide";
import { Ride } from "./pages/rides/Ride";
import { Conversation } from "./pages/messages/Conversation";
import { Messages } from "./pages/messages/Messages";
import { Navbar } from "./components/navbar/Navbar";
import { RideList } from "./pages/rides/RideList";

const PrivateRoute = ({ path, children }) => {
	const { authenticated } = useContext(AuthenticationContext);

	if (authenticated === null)
		return <LinearProgress style={{ width: "100%" }} />;

	return (
		<Route path={path}>
			{authenticated ? children : <Redirect to="/login" />}
		</Route>
	);
};

const App = () => {
	const [height, setHeight] = useState(window.innerHeight);
	const { authenticated } = useContext(AuthenticationContext);

	const coords = useLocationCoords();

	const [mapOptions, setMapOptions] = useState({
		zoom: 10,
		center: coords
	});

	useEffect(() => {
		window.addEventListener("resize", () => setHeight(window.innerHeight));
		return () =>
			window.addEventListener("resize", () => setHeight(window.innerHeight));
	}, [setHeight]);
	return (
		<>
			<Leaflet id="map" options={mapOptions}>
				<Grid container direction="row" wrap="nowrap">
					<Grid
						container
						sm={3}
						xs={12}
						direction="column"
						alignItems="space-between"
						justify="space-between"
						style={{
							zIndex: 10000,
							background: "white",
							padding: "0 1rem",
							maxHeight: "100vh",
							flexWrap: "nowrap",
							minWidth: "20rem"
						}}
					>
						<Router>
							<Grid
								container
								direction="column"
								alignItems="center"
								style={{
									flexGrow: 1,
									height: "50%"
								}}
							>
								<Switch>
									<Route path="/logout">
										<Logout />
									</Route>
									<Route path="/login">
										{authenticated ? <Redirect to="/" /> : <Login />}
									</Route>
									<Route path="/register">
										{authenticated ? <Redirect to="/" /> : <Register />}
									</Route>

									<PrivateRoute path="/rides/create">
										<CreateRide />
									</PrivateRoute>
									<PrivateRoute path="/rides/search">
										<SearchRide />
									</PrivateRoute>
									<PrivateRoute path="/rides/:id">
										<Ride />
									</PrivateRoute>
									<PrivateRoute path="/rides">
										<RideList />
									</PrivateRoute>
									<PrivateRoute path="/messages/:id">
										<Conversation />
									</PrivateRoute>
									<PrivateRoute path="/messages">
										<Messages />
									</PrivateRoute>
									<PrivateRoute path="/">
										<Home />
									</PrivateRoute>
								</Switch>
							</Grid>
							{authenticated ? <Navbar /> : null}
						</Router>
					</Grid>
					<MapContainer height={height} id="map" />
				</Grid>
			</Leaflet>
		</>
	);
};

export default App;
