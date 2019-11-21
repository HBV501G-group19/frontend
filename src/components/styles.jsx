import React from "react";
import { Link } from "react-router-dom";
import {
	Grid,
	Button as MButton,
	makeStyles,
	Typography
} from "@material-ui/core";

const useStyles = makeStyles({
	button: {
		textTransform: ({ textTransform = "none" }) => textTransform,
		margin: "1rem 0.5rem",
		"&:only-child": {
			margin: "1rem 0.5rem"
		}
	},
	list: {
		flex: "1 0",
		width: "100%",
		padding: "0",
		"overflow-y": "scroll",
		"& > li": {
			padding: 0
		}
	},
	column: {
		height: "100%",
		flex: "1 0"
	}
});

const StyledButton = ({ children, ...props }) => {
	const classes = useStyles();
	return (
		<MButton
			className={classes.button}
			variant={"contained"}
			color={"primary"}
			{...props}
		>
			{children}
		</MButton>
	);
};

export const StyledLink = ({ to, children }) => (
	<StyledButton component={Link} to={to}>
		{children}
	</StyledButton>
);

export const Button = ({ children, ...props }) => (
	<StyledButton {...props}>{children}</StyledButton>
);

export const List = ({ children }) => {
	const classes = useStyles();
	return (
		<Grid
			container
			component="ul"
			direction="column"
			wrap="nowrap"
			className={classes.list}
		>
			{children}
		</Grid>
	);
};

export const Column = ({ children, ...rest }) => {
	const classes = useStyles();
	return (
		<Grid container direction="column" className={classes.column} {...rest}>
			{children}
		</Grid>
	);
};

export const Heading = ({ children, ...rest }) => (
	<Typography variant="h6" component="h2" {...rest}>
		{children}
	</Typography>
);
