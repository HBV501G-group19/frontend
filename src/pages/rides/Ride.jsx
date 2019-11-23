import React, { useContext, useState, useEffect } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";

import { AuthenticationContext } from "../../context/Authentication";
import { Column } from "../../components/styles";
import { RideSummary } from "./components/RideSummary";
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

const PassengerView = ({ ride, driver, user, token }) => {
	const [conversation, setConversation] = useState([]);

	const { isPending, run } = useConversationPost(
		setConversation,
		false,
		token,
		{
			rideId: ride.id,
			senderId: user.id,
			recipientId: driver.id
		}
	);

	useInterval(() => {
		if (!isPending) run();
	}, 1000);

	return (
		<>
			{isPending && !conversation.length && <LinearProgress />}
			<MessageList
				messages={conversation}
				sender={user}
				recipient={driver}
				ride={ride}
			/>
			<MessageForm sender={user} recipient={driver} ride={ride} />
		</>
	);
};
const DriverView = ({ user, ride, token }) => {
	const [conversations, _setConversations] = useState([]);

	const setConversations = convs => {
		const newConvs = convs.filter(
			conversation => conversation.rideId === ride.id
		);
		_setConversations(newConvs);
	};

	const { isPending } = useConversationList(
		setConversations,
		false,
		token,
		user.id
	);

	return isPending ? (
		<LinearProgress />
	) : (
		<ConversationList user={user} conversations={conversations} />
	);
};

export const Ride = props => {
	const { state } = useLocation();
	const {
		params: { id }
	} = useRouteMatch("/rides/:id");
	const { user, token } = useContext(AuthenticationContext);
	const [ride, setRide] = useState(null);
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

	useEffect(() => {
		if (!state || !state.ride) {
			rideRun();
		} else {
			setRide(state.ride);
		}
	}, [id, state]);

	useEffect(() => {
		if (ride) {
			addRideToMap(ride, mapDispatch);
			driverRun();
		}
	}, [ride, mapDispatch]);

	if (ridePending || driverPending) return <LinearProgress />;

	return ride && driver ? (
		<Column>
			<RideSummary
				ride={ride}
				user={user}
				driver={ride.driverId}
				token={token}
			/>
			{user.id === driver.id ? (
				<DriverView user={user} token={token} ride={ride} />
			) : (
				<PassengerView user={user} token={token} driver={driver} ride={ride} />
			)}
		</Column>
	) : null;
};
