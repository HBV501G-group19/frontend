import React, { useState, useEffect, useContext, useCallback } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Async, { useAsync } from "react-async";
import { LinearProgress } from "@material-ui/core";

import { AuthenticationContext } from "../../../context/Authentication";

import { getDirections } from "../../../api/ors";
import { getConvinientRides } from "../../../api/rides";

import { SearchRideForm } from "./components/SearchRideForm";
import { StyledLink as Link, Column } from "../../../components/styles";

import { LineString } from "../../../components/map_components/LineString";
import { Marker } from "../../../components/map_components/Marker";
import { RoutePlot } from "../../../components/map_components/RoutePlot";
import { useConvinientRides, useDirections } from "../../../hooks/useData";
import { MapDispatch } from "../../../map/Map";
import { ACTIONS } from "../../../map/constants";
import { RideSummary } from "../components/RideSummary";

export const SearchRide = props => {
	const { user, token } = useContext(AuthenticationContext);

	const mapDispatch = useContext(MapDispatch);

	const [endpoints, setEndpoints] = useState(null);
	const [rides, setRides] = useState([]);

	const [directions, setDirections] = useState([]);

	const { run, isPending, error, hasRun } = useConvinientRides(
		setRides,
		true,
		token
	);

	const {
		run: directionsRun,
		isPending: directionsPending,
		error: directionsError
	} = useDirections(setDirections, true, token);

	const selectRide = currRide => {
		const { id } = currRide;
		const ride = rides.find(({ id: rId }) => id === rId);
		setRides([ride]);
	};

	useEffect(() => {
		const toRideOrigin = rides.map(ride => ({
			origin: endpoints.origin,
			destination: ride.origin,
			properties: {
				profile: "foot-walking",
				rideId: ride.id
			}
		}));
		const fromRideDestination = rides.map(ride => ({
			origin: ride.destination,
			destination: endpoints.destination,
			properties: {
				profile: "foot-walking",
				rideId: ride.id
			}
		}));

		if (rides.length) directionsRun([...toRideOrigin, ...fromRideDestination]);
	}, [rides, endpoints, directionsRun]);

	useEffect(() => {
		const zipped = directions.map(({ features }) => {
			const rideId = features[0].properties.rideId; // this could be any feature, they all have the id
			const { route } = rides.find(({ id }) => rideId === id);

			return {
				route,
				features
			};
		});
		console.log(zipped);
		// directions.forEach(({ features }) => {

		// 	mapDispatch({
		// 		type: ACTIONS.CLEANINSERTMULTI,
		// 		payload: features.map(feature => ({
		// 			data: feature,
		// 			popup: {
		// 				open: () => {
		// 					console.log("opened");
		// 				},
		// 				close: () => {
		// 					console.log("closed");
		// 				},
		// 				content: <RideSummary ride={ride} user={user} token={token} />
		// 			}
		// 		}))
		// 	});
		// });
	}, [directions]);

	console.log(directions);
	return (
		<Column>
			<h2>Search for Rides</h2>
			{isPending && <LinearProgress style={{ width: "100%" }} />}
			{error && <p>Something went wrong :(</p>}
			{hasRun && !rides.length && <p>No rides found</p>}
			<SearchRideForm submitEndpoints={setEndpoints} search={run} />
		</Column>
	);
};
