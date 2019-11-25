import React, { useEffect, useState } from "react";
import { ListItem, Grid } from "@material-ui/core";
import { List, Button } from "../../../components/styles";
import { useAddPassenger } from "../../../hooks/useData";
import { useAutoScroll } from "../../../hooks/useAutoScroll";

const Message = ({ message }) => (
	<ListItem>
		<Grid direction="row" container>
			<p>
				<strong>{message.senderName}:</strong> {message.body}
			</p>
		</Grid>
	</ListItem>
);

const AddPassengerButton = ({ passenger, ride, token, approve }) => {
	const [p, setP] = useState();
	const { isPending, error, run } = useAddPassenger(setP, true, token, {
		passengerId: passenger.id,
		rideId: ride.id
	});

	useEffect(() => {
		if (p) approve(true);
	}, [p, approve]);

	return (
		<>
			{error && error.message}
			<Button
				onClick={() => {
					run();
				}}
				disabled={isPending}
			>
				{`Approve ${passenger.name}`}
			</Button>
		</>
	);
};

export const MessageList = ({ messages, sender, recipient, ride, token }) => {
	const [approved, setApproved] = useState(() =>
		ride.passengers.includes(recipient.id)
	);

	const scrollRef = useAutoScroll(null, [messages]);

	return (
		<List>
			{messages.map(message => (
				<Message key={message.id} message={message} />
			))}
			{!approved && token && (
				<ListItem>
					<AddPassengerButton
						passenger={recipient}
						ride={ride}
						token={token}
						approve={setApproved}
					/>
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
	);
};
