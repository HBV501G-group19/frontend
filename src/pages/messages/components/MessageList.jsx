import React, { useEffect, useState, useRef } from "react";
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
	const { isPending, error, run } = useAddPassenger(approve, true, token, {
		passengerId: passenger.id,
		rideId: ride.id
	});

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
	const [displayAddButton, setDisplayAddButton] = useState(
		r => !r.passengers.includes(recipient.id),
		ride
	);
	const scrollRef = useAutoScroll(null, [messages]);

	return (
		<List>
			{messages.map(message => (
				<Message key={message.id} message={message} />
			))}
			{displayAddButton && token && (
				<ListItem>
					<AddPassengerButton
						passenger={recipient}
						ride={ride}
						token={token}
						approve={setDisplayAddButton}
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
