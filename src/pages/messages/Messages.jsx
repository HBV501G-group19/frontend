import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../context/Authentication";
import { useConversationList } from "../../hooks/useData";
import { Column } from "../../components/styles";
import { ConversationList } from "./ConversationList";
import { useInterval } from "web-api-hooks";
import { LinearProgress } from "@material-ui/core";

export const Messages = props => {
	const [conversations, setConversations] = useState([]);
	const { user, token } = useContext(AuthenticationContext);
	const { error, isPending, run } = useConversationList(
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
			<h2>Messages</h2>
			{isPending && conversations.length === 0 && <LinearProgress />}
			{error && <p>{error}</p>}
			<ConversationList user={user} conversations={conversations} />
		</Column>
	);
};
