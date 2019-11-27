import React from "react";
import { List } from "./styles";
import { ListItem } from "@material-ui/core";

export const ValidationList = ({ errors = [] }) =>
	errors.length ? (
		<List>
			{errors.map(error => (
				<ListItem key={error.field}>
					<strong>{error.field}</strong>
					<p>{error.message}</p>
				</ListItem>
			))}
		</List>
	) : null;
