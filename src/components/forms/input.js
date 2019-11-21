import React from "react";
import styled from "styled-components";
import day from "dayjs";
import { TextField, makeStyles } from "@material-ui/core";

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
`;

const useStyles = makeStyles({
	input: {
		margin: "0.5rem 0",
		"&:first-child": {
			marginTop: 0
		},
		"&:last-child": {
			marginBottom: 0
		}
	}
});

export const Input = ({
	label,
	type = "text",
	value,
	onChange = () => {},
	onKeyEnter = () => {},
	focusRef,
	disabled = false,
	...rest
}) => {
	const classes = useStyles();

	const enterHandle = e => {
		e.preventDefault();
		if (e.keyCode === 13) onKeyEnter(e);
	};

	return (
		<TextField
			className={classes.input}
			type={type}
			label={label}
			value={value}
			onChange={e => {
				onChange(e.target.value);
			}}
			onKeyUp={enterHandle}
			ref={focusRef}
			disabled={disabled}
			{...rest}
		/>
	);
};

export const TimeInput = ({
	time,
	format,
	label,
	onChange,
	disabled,
	...rest
}) => {
	const classes = useStyles();
	return (
		<TextField
			className={classes.input}
			type="time"
			label={label}
			value={time.format(format)}
			onChange={e => {
				e.preventDefault();
				const currTime = day();
				const newDate = day(e.target.valueAsDate)
					.year(currTime.year())
					.month(currTime.month())
					.date(currTime.date());

				onChange(newDate);
			}}
			disabled={disabled}
			{...rest}
		/>
	);
};
