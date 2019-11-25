import React, { useState } from "react";
import { useConversationPost } from "../../../hooks/useData";
import { useInterval } from "web-api-hooks";
import { LinearProgress } from "@material-ui/core";
import { MessageList } from "../../messages/components/MessageList";
import { MessageForm } from "../../messages/components/MessageForm";

export const PassengerView = ({ ride, driver, user, token }) => {
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
			<MessageForm sender={user} recipient={driver} rideIds={ride} />
		</>
	);
};
