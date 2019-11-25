import React from "react";
import { Typography } from "@material-ui/core";
import { Heading } from "../../../components/styles";
import { useRideTime } from "../../../hooks/useRideTime";
import { makeRideTitle, makeDepartureText } from "../../../utils/utils";

export const RideInfo = ({ ride, user, driver }) => {
	const {
		properties: { origin, destination }
	} = ride;

	const { minutesTo, hoursTo } = useRideTime(ride);
	const title = makeRideTitle(origin, destination);

	const drivingText = driver
		? driver.id === user.id
			? "You are driving"
			: `${driver.username} is driving`
		: "Getting driver data...";

	const departureText = makeDepartureText(hoursTo, minutesTo);

	return (
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
};
