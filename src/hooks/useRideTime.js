import { useInterval } from "web-api-hooks";
import { updateTime } from "../utils/utils";
import { useEffect, useState } from "react";

export const useRideTime = ride => {
	const [hoursTo, setHoursTo] = useState(0);
	const [minutesTo, setMinutesTo] = useState(0);
	console.log(hoursTo, minutesTo, ride.departureTime);
	useInterval(() => {
		updateTime(ride, setHoursTo, setMinutesTo);
	}, 50000);

	// Just want to run this on first render
	// the interval takes care of the rest
	useEffect(() => {
		updateTime(ride, setHoursTo, setMinutesTo);
	}, [ride]);

	return {
		hoursTo,
		minutesTo
	};
};
