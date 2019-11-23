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
