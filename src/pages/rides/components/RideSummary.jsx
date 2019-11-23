import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, makeStyles, Collapse } from "@material-ui/core";
import day from "dayjs";
import { useInterval } from "web-api-hooks";

import { useGeoname, useUser } from "../../../hooks/useData";
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

const updateTime = (ride, setH, setM) => {
	const currTime = day();
	const hours = currTime.diff(ride.departureTime, "hours");
	const minutes = currTime.diff(ride.departureTime, "minutes");

	setH(hours);
	setM(minutes - hours * 60);
};

const makeDepartureText = (hoursTo, minutesTo) =>
	// positive diff => happens in the future
	Math.abs(hoursTo) > 48
		? hoursTo > 0
			? `Left a few days ago`
			: `Leaving in a few days`
		: minutesTo > 0
		? `Left ${Math.abs(hoursTo)} hours and ${Math.abs(minutesTo)} minutes ago`
		: `Leaving in ${Math.abs(hoursTo)} hours and ${Math.abs(
				minutesTo
		  )} minutes`;

const makeTitle = (origin, destination) =>
	origin && destination
		? `From ${origin.properties.street ||
				origin.properties.name} to ${destination.properties.street ||
				destination.properties.name}`
		: null;

export const RideSummary = ({ ride, user, token, collapsing }) => {
	const [hoursTo, setHoursTo] = useState(0);
	const [minutesTo, setMinutesTo] = useState(0);
	const [origin, setOrigin] = useState();
	const [destination, setDestination] = useState();
	const [hover, setHover] = useState(false);
	const [driver, setDriver] = useState(null);

	const history = useHistory();
	const { isPending } = useUser(setDriver, false, token, ride.driver);

	useGeoname(setOrigin, false, token, ride.origin);
	useGeoname(setDestination, false, token, ride.destination);

	const { rideSummary } = useStyles();

	useInterval(() => {
		updateTime(ride, setHoursTo, setMinutesTo);
	}, 50000);

	// Just want to run this on first render
	// the interval takes care of the rest
	useEffect(() => {
		updateTime(ride, setHoursTo, setMinutesTo);
	}, []); // eslint-disable-line

	const title = makeTitle(origin, destination);
	console.log("PENDING", isPending);
	const drivingText = driver
		? driver.id === user.id
			? "You are driving"
			: `${driver.username} is driving`
		: "Getting driver data...";

	const departureText = makeDepartureText(hoursTo, minutesTo);

	const textElements = (
		<>
			<Heading>{title}</Heading>
			<Typography variant="subtitle2">{drivingText}</Typography>
			<Typography component="p">{departureText}</Typography>
			<Typography component="p">
				Drive duration: {(ride.duration / 60).toFixed()} minutes
			</Typography>
			<Typography component="p">Free seats: {ride.freeSeats}</Typography>
		</>
	);
	return (
		<Grid
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={e => {
				history.push(`/rides/${ride.id}`);
			}}
			className={rideSummary}
		>
			{collapsing ? (
				<Collapse in={hover} collapsedHeight="2rem">
					{textElements}
				</Collapse>
			) : (
				textElements
			)}
		</Grid>
	);
};
