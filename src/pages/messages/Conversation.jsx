import React, { useState, useContext, useEffect } from "react";
import { useAsync } from "react-async";
import { useRouteMatch } from "react-router-dom";
import { Grid, ListItem, LinearProgress } from "@material-ui/core";

import { AuthenticationContext } from "../../context/Authentication";
import { useInterval } from "../../hooks/useInterval";
import { useRide, useConversation } from "../../hooks/useData";

import { Column, Heading } from "../../components/styles";
import { MessageForm } from "./components/MessageForm";
import { addPassenger as ap } from "../../api/rides";

import { MessageList } from "./components/MessageList";
import { MapDispatch } from "../../map/Map";
import { addRideToMap } from "../../map/mapUtils";

const Message = ({ getUser, message }) => (
	<ListItem>
		<Grid direction="row" container>
			<p>
				<strong>{message.senderName}:</strong> {message.body}
			</p>
		</Grid>
	</ListItem>
);

export const Conversation = () => {
	const [messages, setMessages] = useState([]);
	const [ride, setRide] = useState();
	const [rideId, setRideId] = useState();

	const [sender, setSender] = useState();
	const [recipient, setRecipient] = useState();

	const {
		params: { id }
	} = useRouteMatch("/messages/:id");

	const { user, token } = useContext(AuthenticationContext);
	const mapDispatch = useContext(MapDispatch);

	const _setMessages = conversation => {
		setMessages(conversation);
		setRideId(conversation[0].ride);
	};

	const {
		error: approveError,
		isPending: approvePending,
		run: runPassenger
	} = useAsync({
		deferFn: ap
	});

	const addPassenger = (rideId, passengerId) =>
		runPassenger({ rideId, passengerId }, token);

	const {
		error: convError,
		isPending: convPending,
		run: convRun
	} = useConversation(_setMessages, false, token, id);

	const { error: rideError, isPending: ridePending, run: rideRun } = useRide(
		setRide,
		true,
		token,
		rideId
	);

	useInterval(() => {
		if (!convPending) convRun();
	}, 1000);

	useEffect(() => {
		if (rideId != null) rideRun();
	}, [rideId, approvePending]);

	useEffect(() => {
		if (ride) addRideToMap(ride, mapDispatch);
	}, [ride, mapDispatch]);

	useEffect(() => {
		if (messages.length > 0 && user) {
			const mSender = {
				id: messages[0].sender,
				name: messages[0].senderName
			};
			const mRecip = {
				id: messages[0].recipient,
				name: messages[0].recipientName
			};

			if (mSender.id === user.id) {
				setSender(mSender);
				setRecipient(mRecip);
			} else {
				setSender(mRecip);
				setRecipient(mSender);
			}
		}
	}, [messages]);

	return (
		<Column>
			<Heading>Messages</Heading>
			{ridePending && <LinearProgress />}
			{sender && recipient && ride && (
				<>
					<MessageList
						ride={ride}
						messages={messages}
						sender={sender}
						recipient={recipient}
						token={token}
					/>
					<MessageForm sender={sender} recipient={recipient} rideId={rideId} />
				</>
			)}
		</Column>
	);
};
