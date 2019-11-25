import React, { useContext, useState, useEffect } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";

import { AuthenticationContext } from "../../context/Authentication";
import { Column } from "../../components/styles";
import { MessageForm } from "./components/MessageForm";
import { MessageList } from "../messages/components/MessageList";
import { ConversationList } from "../messages/components/ConversationList";

import {
	useRide,
	useUser,
	useConversationList,
	useConversationPost
} from "../../hooks/useData";
import { MapDispatch } from "../../map/Map";
import { addRideToMap } from "../../map/mapUtils";
import { useInterval } from "web-api-hooks";
import { useNamedEndpoints } from "../../hooks/useNamedEndpoints";
import { RideInfo } from "./components/RideInfo";
import { DriverView } from "./components/DriverView";
import { PassengerView } from "./components/PassengerView";

export const Ride = props => {
	const { state } = useLocation();
	const {
		params: { id }
	} = useRouteMatch("/rides/:id");

	const { user, token } = useContext(AuthenticationContext);
	const [ride, setRide] = useState(() => state && state.ride);

	const [driver, setDriver] = useState(null);

	const mapDispatch = useContext(MapDispatch);
	const { isPending: ridePending, run: rideRun } = useRide(
		setRide,
		true,
		token,
		id
	);

	const { isPending: driverPending, run: driverRun } = useUser(
		setDriver,
		true,
		token,
		ride && ride.driver
	);

	const { origin, destination } = useNamedEndpoints(
		ride && ride.origin,
		ride && ride.destination,
		token
	);

	useEffect(() => {
		if (!state || !state.ride) {
			rideRun();
		} else {
			setRide(state.ride);
		}
	}, [id, state, rideRun]);

	useEffect(() => {
		if (ride && origin && destination) {
			addRideToMap(ride, mapDispatch);
			driverRun();
		}
	}, [ride, origin, destination, mapDispatch, driverRun]);

	if (ridePending || driverPending) return <LinearProgress />;

	return ride && driver ? (
		<Column>
			<RideInfo ride={ride} user={user} driver={driver} />
			{user.id === driver.id ? (
				<DriverView user={user} token={token} ride={ride} />
			) : (
				<PassengerView user={user} token={token} driver={driver} ride={ride} />
			)}
		</Column>
	) : null;
};
