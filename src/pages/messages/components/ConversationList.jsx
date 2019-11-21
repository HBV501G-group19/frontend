import React from "react";
import { useHistory } from "react-router-dom";
import { ListItem, Grid, makeStyles } from "@material-ui/core";

import { List } from "../../../components/styles";

const useStyles = makeStyles({
	conversation: {
		cursor: "pointer",
		borderBottom: "3px #ddd solid"
	}
});

const ConversationBox = ({ user, recipient, sender, id, pre }) => {
	const history = useHistory();
	const classes = useStyles();
	return (
		<ListItem
			onClick={e => {
				history.push(`/messages/${id}`);
			}}
			className={classes.conversation}
		>
			<Grid>
				<h3>{user.username === sender ? recipient : sender}</h3>
				<p>
					<strong>{sender}: </strong>
					{pre}
				</p>
			</Grid>
		</ListItem>
	);
};

export const ConversationList = ({ conversations, user }) => (
	<List>
		{conversations.map(({ conversationId, messages }) => (
			<ConversationBox
				key={conversationId}
				id={conversationId}
				pre={messages[messages.length - 1].body}
				user={user}
				sender={messages[messages.length - 1].senderName}
				recipient={messages[messages.length - 1].recipientName}
			/>
		))}
	</List>
);
