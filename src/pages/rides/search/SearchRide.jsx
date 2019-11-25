import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { LinearProgress, Collapse } from "@material-ui/core";

import { AuthenticationContext } from "../../../context/Authentication";

import { SearchRideForm } from "./components/SearchRideForm";
import { Column, Button, CollapsableList } from "../../../components/styles";

import { useConvinientRides, useDirections } from "../../../hooks/useData";
import { MapDispatch } from "../../../map/Map";
import { ACTIONS } from "../../../map/constants";
import { prepareLineString } from "../../../map/mapUtils";
import { COLORSARRAY } from "../../../utils/constants";
import { makeRouteTooltip } from "../../../map/Tooltips";
import { RideSummary } from "../components/RideSummary";

export const SearchRide = props => {
	const { user, token } = useContext(AuthenticationContext);
	const mapDispatch = useContext(MapDispatch);
	const history = useHistory();
	const [endpoints, setEndpoints] = useState(null);
	const [rides, setRides] = useState([]);
	const [hideForm, setHideForm] = useState({
		submitted: false,
		hidden: false
	});
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
		const zipped = directions.flatMap(({ features }, idx) => {
			const rideId = features[0].properties.rideId; // this could be any feature, they all have the id
			const ride = rides.find(({ id }) => rideId === id);
			const featureData = features.flatMap(feature => {
				const {
					geometry: { type }
				} = feature;
				return type === "LineString"
					? prepareLineString({
							feature,
							color: COLORSARRAY[idx][300],
							tooltip: {
								component: makeRouteTooltip({ ride, user, token })
							},
							onEachFeature: (feature, layer) => {
								layer.on("click", () => {
									history.push(`/rides/${rideId}`, {
										ride
									});
								});
							}
					  })
					: {
							id: `${rideId}:${feature.properties.id}`,
							data: feature,
							tooltip: feature.properties.name || feature.properties.street
					  };
			});

			const routeString = prepareLineString({
				feature: ride.route,
				color: COLORSARRAY[idx][500],
				tooltip: {
					component: makeRouteTooltip({ ride, user, token })
				},
				onEachFeature: (feature, layer) => {
					layer.on("click", () => {
						history.push(`/rides/${rideId}`, {
							ride
						});
					});
				}
			});

			return [...featureData, ...routeString];
		});

		mapDispatch({
			type: ACTIONS.CLEANINSERTMULTI,
			payload: zipped
		});
	}, [history, mapDispatch, user, token, rides, directions]);

	useEffect(() => {
		if (rides.length) {
			setHideForm({
				submitted: true,
				hidden: true
			});
		}
	}, [rides]);

	return (
		<Column>
			<h2>Search for Rides</h2>
			{isPending && <LinearProgress style={{ width: "100%" }} />}
			{error && <p>Something went wrong :(</p>}
			{hasRun && !rides.length && <p>No rides found</p>}
			<SearchRideForm
				hidden={{ ...hideForm, hide: setHideForm }}
				submitEndpoints={setEndpoints}
				search={run}
			/>
			<Collapse in={hideForm.hidden}>
				<Button onClick={() => setHideForm({ ...hideForm, hidden: false })}>
					Search again?
				</Button>
			</Collapse>
			<CollapsableList in={hideForm.submitted}>
				{rides.map(ride => (
					<RideSummary ride={ride} user={user} token={token} />
				))}
			</CollapsableList>
			{/* <SearchRideForm submitEndpoints={setEndpoints} search={run} /> */}
		</Column>
	);
};
