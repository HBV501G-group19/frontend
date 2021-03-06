import React, { useState, useContext } from "react";
import { useAsync } from "react-async";
import { LinearProgress } from "@material-ui/core";
import { AuthenticationContext } from "../../../context/Authentication";
import { sendMessage } from "../../../api/messages";

import { Form, Input } from "../../../components/forms/input";
import { Button } from "../../../components/styles";

export const MessageForm = ({ sender, recipient, ride }) => {
	const { user, token } = useContext(AuthenticationContext);
	const [message, setMessage] = useState("");

	const { data, isPending, error, run } = useAsync({
		deferFn: sendMessage
	});

	const submit = e => {
		e.preventDefault();
		run(
			{
				senderId: user.id,
				recipientId: recipient.id,
				rideId: ride.id,
				messageBody: message
			},
			token
		);
		setMessage("");
	};
	return (
		<Form>
			<Input
				label="Message Driver"
				multiline
				value={message}
				onChange={setMessage}
				disabled={isPending}
			/>
			{isPending && <LinearProgress />}
			<Button onClick={submit} type="submit" disabled={isPending}>
				Send
			</Button>
		</Form>
	);
};
