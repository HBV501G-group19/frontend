import day from "dayjs";

export const filterDepartedRides = (rides, keepDeparted) =>
	rides
		.filter(ride =>
			keepDeparted
				? day().unix() > day(ride.departureTime).unix()
				: day().unix() < day(ride.departureTime).unix()
		)
		.sort((a, b) =>
			a.departureTime < b.departureTime
				? 1
				: a.departureTime === b.departureTime
				? 0
				: -1
		);

export const makeRideTitle = (origin, destination) =>
	origin && destination
		? `From ${origin.street || origin.name} to ${destination.street ||
				destination.name}`
		: null;

export const updateTime = (ride, setH, setM) => {
	const currTime = day();
	const hours = currTime.diff(ride.departureTime, "hours");
	const minutes = currTime.diff(ride.departureTime, "minutes");
	setH(hours);
	setM(minutes - hours * 60);
};

export const makeDepartureText = (hoursTo, minutesTo) => {
	if (hoursTo === 0 && minutesTo < 5 && minutesTo > -5) {
		return "Leaving now!";
	}
	// positive diff => happens in the future
	return Math.abs(hoursTo) > 48
		? hoursTo > 0
			? `Left a few days ago`
			: `Leaving in a few days`
		: minutesTo > 0
		? `Left ${Math.abs(hoursTo)} hours and ${Math.abs(minutesTo)} minutes ago`
		: `Leaving in ${Math.abs(hoursTo)} hours and ${Math.abs(
				minutesTo
		  )} minutes`;
};
