import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, makeStyles, Collapse } from "@material-ui/core";
import day from "dayjs";
import { useInterval } from "web-api-hooks";

import { useGeoname } from "../../../hooks/useData";
import { Heading } from "../../../components/styles";

const useStyles = makeStyles({
	rideSummary: {
		width: "100%",
		borderBottom: "3px #ddd solid",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "#fafafa"
		}
	}
});

export const RideSummary = ({ ride, user, token, collapsing }) => {
	const [hoursTo, setHoursTo] = useState(0);
	const [minutesTo, setMinutesTo] = useState(0);
	const [origin, setOrigin] = useState();
	const [destination, setDestination] = useState();
	const [hover, setHover] = useState(false);

	const history = useHistory();

	const updateTime = () => {
		const currTime = day();
		const hours = currTime.diff(ride.departureTime, "hours");
		const minutes = currTime.diff(ride.departureTime, "minutes");

		setHoursTo(hours);
		setMinutesTo(minutes - hours * 60);
	};

	useGeoname(setOrigin, false, token, ride.origin);
	useGeoname(setDestination, false, token, ride.destination);

	const { rideSummary } = useStyles();

	useInterval(() => {
		updateTime();
	}, 50000);

	// Just want to run this on first render
	// the interval takes care of the rest
	useEffect(() => {
		updateTime();
	}, []); // eslint-disable-line

	const title =
		origin && destination
			? `From ${origin.properties.street ||
					origin.properties.name} to ${destination.properties.street ||
					destination.properties.name}`
			: null;

	const drivingText =
		ride.driver === user.id ? "You are driving" : `${user.username} is driving`;

	const departureText =
		Math.abs(hoursTo) > 48
			? hoursTo > 0
				? `Left a few days ago`
				: `Leaving in a few days`
			: minutesTo < 0
			? `Leaving in ${Math.abs(hoursTo)} hours and ${Math.abs(
					minutesTo
			  )} minutes`
			: `Left ${Math.abs(hoursTo)} hours and ${Math.abs(
					minutesTo
			  )} minutes ago`;

	if (collapsing) {
		return (
			<Grid
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={e => {
					history.push(`/rides/${ride.id}`);
				}}
				className={rideSummary}
			>
				<Collapse in={hover} collapsedHeight="2rem">
					<Heading>{title}</Heading>
					<Typography variant="subtitle2">{drivingText}</Typography>
					<Typography component="p">{departureText}</Typography>
					<Typography component="p">
						Drive duration: {(ride.duration / 60).toFixed()} minutes
					</Typography>
					<Typography component="p">Free seats: {ride.freeSeats}</Typography>
				</Collapse>
			</Grid>
		);
	}

	return (
		<Grid
			onClick={e => {
				history.push(`/rides/${ride.id}`);
			}}
			className={rideSummary}
		>
			<Heading>{title}</Heading>
			<Typography variant="subtitle2">{drivingText}</Typography>
			<Typography component="p">{departureText}</Typography>
			<Typography component="p">
				Drive duration: {(ride.duration / 60).toFixed()} minutes
			</Typography>
			<Typography component="p">Free seats: {ride.freeSeats}</Typography>
		</Grid>
	);
};
