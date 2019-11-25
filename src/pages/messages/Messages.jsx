import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/Authentication";
import { useConversationList } from "../../hooks/useData";
import { Column, Heading } from "../../components/styles";
import { ConversationList } from "./components/ConversationList";
import { useInterval } from "web-api-hooks";
import { LinearProgress } from "@material-ui/core";

export const Messages = props => {
	const [conversations, setConversations] = useState([]);
	const { user, token } = useContext(AuthenticationContext);

	const { hasRun, error, isPending, run } = useConversationList(
		setConversations,
		false,
		token,
		user.id
	);

	useInterval(() => {
		run();
	}, 1000);

	return (
		<Column>
			<Heading>Messages</Heading>
			{isPending && conversations.length === 0 && !hasRun && <LinearProgress />}
			{error && <p>{error}</p>}
			<ConversationList user={user} conversations={conversations} />
		</Column>
	);
};
