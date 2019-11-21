import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";

import { AuthenticationContext } from "../../context/Authentication";
import { Column } from "../../components/styles";
import { RideInfo } from "./components/RideInfo";
import { RideSummary } from "./components/RideSummary";
import { MessageForm } from "./components/MessageForm";
import { MessageList } from "../messages/components/MessageList";
import { ConversationList } from "../messages/components/ConversationList";

import { useRide, useUser, useConversationList } from "../../hooks/useData";

const PassengerView = ({ ride, driver, walks, user, token }) => (
	<>
		<>
			<RideInfo ride={ride} driver={driver} walks={walks} />
			<MessageList sender={{ ...user, token }} recipient={driver} ride={ride} />
			<MessageForm sender={user} recipient={driver} ride={ride} />
		</>
	</>
);

const DriverView = ({ user, ride, token }) => {
	const [conversations, _setConversations] = useState([]);

	const setConversations = convs => {
		const newConvs = convs.filter(
			conversation => conversation.rideId === ride.id
		);
		_setConversations(newConvs);
	};

	const { error, isPending } = useConversationList(
		setConversations,
		false,
		token,
		user.id
	);

	console.log(conversations);

	return <ConversationList user={user} conversations={conversations} />;
};

export const Ride = props => {
	const { state } = useLocation();
	const {
		params: { id }
	} = useRouteMatch("/rides/:id");
	const { user, token } = useContext(AuthenticationContext);
	const [ride, setRide] = useState(null);
	const [driver, setDriver] = useState(null);
	const [walks, setWalks] = useState([]);

	const { isPending: ridePending, error: rideError, run: rideRun } = useRide(
		setRide,
		true,
		token,
		id
	);

	const {
		isPending: driverPending,
		error: driverError,
		run: driverRun
	} = useUser(setDriver, true, token, ride && ride.driver);

	useEffect(() => {
		if (!state || !state.ride) {
			rideRun();
		} else {
			setRide(state.ride);
		}
	}, [id]);

	useEffect(() => {
		if (ride) driverRun();
	}, [ride]);

	if (ridePending || driverPending) return <LinearProgress />;

	return ride && driver ? (
		<Column>
			<RideSummary ride={ride} user={user} token={token} />
			{user.id === driver.id ? (
				<DriverView user={user} token={token} ride={ride} />
			) : (
				<PassengerView
					user={user}
					token={token}
					driver={driver}
					ride={ride}
					walks={walks}
				/>
			)}
		</Column>
	) : null;
};
