import React, { useState, useContext, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AuthenticationContext } from "../../../context/Authentication";

import { CreateRideForm } from "./components/CreateRideForm";
import { Column } from "../../../components/styles";

import { useDirections, useCreateRide } from "../../../hooks/useData";
import { MapDispatch } from "../../../map/Map";
import { ACTIONS } from "../../../map/constants";
import { colors, LinearProgress } from "@material-ui/core";
import { prepareLineString } from "../../../map/mapUtils";
import { makeNewRouteTooltip } from "../../../map/Tooltips";

export const CreateRide = props => {
	const {
		user: { id },
		token
	} = useContext(AuthenticationContext);
	const [endpoints, setEndpoints] = useState();
	const [ride, setRide] = useState(null);
	const [[route], setRoute] = useState([null]);

	const history = useHistory();
	const mapDispatch = useContext(MapDispatch);

	const {
		isPending: createPending,
		error: createError,
		run: runCreate
	} = useCreateRide(setRide, true, token);

	const {
		isPending: routePending,
		error: routeError,
		run: runRoute
	} = useDirections(setRoute, true, token, endpoints);

	useEffect(() => {
		if (endpoints) {
			runRoute();
		}
	}, [endpoints, runRoute]);

	const submitRide = useCallback(
		({ seats, origin, destination, departureTime }) => {
			const linestring = route.features.find(
				feature => feature.geometry.type === "LineString"
			);

			// creating a ride, we only have 1 route
			const { geometry, properties } = linestring;
			const {
				summary: { duration, distance }
			} = properties;
			runCreate({
				duration,
				distance,
				driverId: id,
				seats,
				origin,
				destination,
				departureTime,
				route: geometry
			});
		},
		[id, route, runCreate]
	);

	useEffect(() => {
		if (route) {
			const features = route.features.flatMap(feature =>
				feature.geometry.type === "LineString"
					? prepareLineString({
							feature,
							color: colors.indigo[500],
							tooltip: {
								component: makeNewRouteTooltip({
									feature
								})
							}
					  })
					: {
							id: feature.properties.id,
							data: feature,
							tooltip: {
								content: feature.properties.name || feature.properties.street
							}
					  }
			);

			mapDispatch({
				type: ACTIONS.CLEANINSERTMULTI,
				payload: features
			});
		}
	}, [route, mapDispatch]);

	if (ride) {
		const { id: rideId } = ride;
		history.push(`/rides/${rideId}`, {
			ride
		});
	}

	return (
		<Column>
			<h2>Submit your Ride</h2>
			{createPending || routePending ? <LinearProgress /> : null}
			{createError ? <p>Something went wrong :(</p> : null}
			{routeError ? <p>Error getting route directions</p> : null}
			<CreateRideForm submitEndpoints={setEndpoints} submitRide={submitRide} />
		</Column>
	);
};
