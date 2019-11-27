import React, { useState, useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";

import { AuthenticationContext } from "../../context/Authentication";
import { useInterval } from "web-api-hooks";
import { useRide, useConversation } from "../../hooks/useData";

import { Column, Heading } from "../../components/styles";
import { MessageForm } from "./components/MessageForm";

import { MessageList } from "./components/MessageList";
import { MapDispatch } from "../../map/Map";
import { addRideToMap } from "../../map/mapUtils";

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

	const { isPending: convPending, run: convRun } = useConversation(
		_setMessages,
		false,
		token,
		id
	);

	const { isPending: ridePending, run: rideRun } = useRide(
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
	}, [rideId, rideRun]);

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
	}, [messages, user]);

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
