import React, { useState } from "react";
import { useConversationList } from "../../../hooks/useData";
import { LinearProgress } from "@material-ui/core";
import { ConversationList } from "../../messages/components/ConversationList";
import { useInterval } from "web-api-hooks";

export const DriverView = ({ user, ride, token }) => {
	const [conversations, _setConversations] = useState([]);

	const setConversations = convs => {
		const newConvs = convs.filter(
			conversation => conversation.rideId === ride.id
		);
		_setConversations(newConvs);
	};

	const { isPending, run, hasRun } = useConversationList(
		setConversations,
		false,
		token,
		user.id
	);

	useInterval(() => {
		if (!isPending) run();
	}, 1500);

	return isPending && !hasRun ? (
		<LinearProgress />
	) : (
		<ConversationList user={user} conversations={conversations} />
	);
};
