import React, { useState, useEffect, useContext, useRef } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";
import { Grid, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { useLeaflet } from "./map/Map";
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
import { Leaflet, LeafletOverlays } from "./map/Leaflet";

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

const useStyles = makeStyles({
	rootContainer: {
		height: "100vh"
	},
	mapContainer: {
		height: props => props.height,
		width: "100%"
	}
});

const RootContainer = ({ providers }) => {
	const [height, setHeight] = useState(window.innerHeight);
	const { authenticated } = useContext(AuthenticationContext);
	const coords = useLocationCoords();
	const { MapStateProvider, DispatchProvider } = providers;
	const [mapOptions] = useState({
		zoom: 13,
		center: coords
	});

	useEffect(() => {
		window.addEventListener("resize", () => setHeight(window.innerHeight));
		return () =>
			window.addEventListener("resize", () => setHeight(window.innerHeight));
	}, [setHeight]);

	const { rootContainer, mapContainer } = useStyles({ height });
	return (
		<Grid container direction="row" wrap="nowrap" className={rootContainer}>
			<Router>
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
					<DispatchProvider>
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
					</DispatchProvider>
				</Grid>
				<Leaflet
					provider={MapStateProvider}
					className={mapContainer}
					options={mapOptions}
				>
					<LeafletOverlays />
				</Leaflet>
			</Router>
		</Grid>
	);
};

const App = () => {
	const coords = useLocationCoords();
	const { DispatchProvider, MapStateProvider } = useLeaflet({
		id: "map",
		center: coords,
		zoom: 10
	});

	if (DispatchProvider == null || MapStateProvider == null) return null;
	return <RootContainer providers={{ DispatchProvider, MapStateProvider }} />;
};

export default App;
