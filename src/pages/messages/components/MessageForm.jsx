import React, { useState, useContext } from "react";
import { useAsync } from "react-async";
import { LinearProgress } from "@material-ui/core";
import { AuthenticationContext } from "../../../context/Authentication";
import { sendMessage } from "../../../api/messages";

import { Form, Input } from "../../../components/forms/input";
import { Button } from "../../../components/styles";

export const MessageForm = ({ sender, recipient, rideId }) => {
	const { token } = useContext(AuthenticationContext);
	const [message, setMessage] = useState("");

	const { isPending, run } = useAsync({
		deferFn: sendMessage
	});

	const submit = e => {
		e.preventDefault();
		run(
			{
				senderId: sender.id,
				recipientId: recipient.id,
				rideId,
				messageBody: message
			},
			token
		);
		setMessage("");
	};

	return (
		<Form>
			<Input
				label={`Message ${recipient.username}`}
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
