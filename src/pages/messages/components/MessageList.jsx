import React, { useEffect, useRef } from "react";
import { ListItem, Grid } from "@material-ui/core";
import { List, Button } from "../../../components/styles";

const Message = ({ getUser, message }) => (
	<ListItem>
		<Grid direction="row" container>
			<p>
				<strong>{message.senderName}:</strong> {message.body}
			</p>
		</Grid>
	</ListItem>
);

const AddPassengerButton = ({
	passenger,
	ride,
	addPassengerFn,
	token,
	approved
}) => (
	<>
		{approved.error && approved.error.message}
		<Button
			onClick={() => {
				addPassengerFn(
					{
						rideId: ride.id,
						passengerId: passenger.id
					},
					token
				);
			}}
			disabled={approved.pending}
		>
			{`Approve ${passenger.name}`}
		</Button>
	</>
);

export const MessageList = ({
	messages,
	sender,
	recipient,
	ride,
	addPassenger
}) => {
	const scrollRef = useRef(null);
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
				inline: "start"
			});
		}
	}, [messages]);

	const displayAddButton =
		addPassenger &&
		ride &&
		sender.id === ride.driver &&
		!ride.passengers.includes(recipient.id);

	return (
		<List>
			{messages.map(message => (
				<Message key={message.id} message={message} />
			))}
			{displayAddButton && (
				<ListItem>
					<AddPassengerButton
						passenger={recipient}
						ride={ride}
						addPassengerFn={addPassenger.run}
						approved={{
							pending: addPassenger.pending,
							error: addPassenger.error
						}}
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
