import React, {
	useState,
	useContext,
	useCallback,
	useRef,
	useEffect
} from "react";
import { useAsync } from "react-async";
import { useLocation, useRouteMatch } from "react-router-dom";
import { Grid, ListItem, LinearProgress, makeStyles } from "@material-ui/core";

import { AuthenticationContext } from "../../context/Authentication";
import { useInterval } from "../../hooks/useInterval";
import { useRide, useConversation } from "../../hooks/useData";

import { List, Column, Button } from "../../components/styles";
import { MessageForm } from "./components/MessageForm";
import { addPassenger as ap } from "../../api/rides";

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
	const scrollRef = useRef(null);

	const _setMessages = conversation => {
		setMessages(conversation);
		setRideId(conversation[0].ride);
	};

	const {
		error: approveError,
		isPending: approvePending,
		run: addPassenger
	} = useAsync({
		deferFn: ap
	});

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

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
				inline: "start"
			});
		}
	}, [messages]);

	console.log(ride);
	return (
		<Column>
			<h2>Messages</h2>
			{ridePending && <LinearProgress />}
			{sender && recipient && (
				<>
					<List>
						{messages.map(message => (
							<Message key={message.id} message={message} />
						))}
						{ride &&
							sender.id === ride.driver &&
							!ride.passengers.includes(recipient.id) && (
								<ListItem>
									{approveError && approveError.message}
									<Button
										onClick={() => {
											addPassenger(
												{
													rideId: ride.id,
													passengerId: recipient.id
												},
												token
											);
										}}
										disabled={approvePending}
									>
										{`Approve ${recipient.name}`}
									</Button>
								</ListItem>
							)}
						<div
							ref={scrollRef}
							style={{
								height: 0,
								visibility: "hidden"
							}}
						/>
					</List>
					<MessageForm sender={sender} recipient={recipient} rideId={rideId} />
				</>
			)}
		</Column>
	);
};
