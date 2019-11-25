import React, { useState, useEffect } from "react";
import day from "dayjs";
import { Collapse, Grid } from "@material-ui/core";

import { GeocodeInput } from "../../../../components/map_components/GeocodeInput";
import { Button } from "../../../../components/styles";
import { TimeInput, Input, Form } from "../../../../components/forms/input";

export const SearchRideForm = ({
	submitEndpoints,
	search,
	hidden: { submitted, hidden, hide }
}) => {
	const [origin, setOrigin] = useState({
		label: "",
		geometry: null
	});
	const [destination, setDestination] = useState({
		label: "",
		geometry: null
	});
	const [time, setTime] = useState(day());
	const [seats, setSeats] = useState("");

	useEffect(() => {
		if (origin.geometry && destination.geometry) {
			submitEndpoints({
				origin: origin.geometry,
				destination: destination.geometry
			});
		}
	}, [origin, destination, submitEndpoints]);
	console.log(hidden, submitted, hide);
	const submit = e => {
		e.preventDefault();
		if (origin.geometry && destination.geometry) {
			search({
				origin: origin.geometry,
				destination: destination.geometry,
				departureTime: time.format("YYYY-MM-DD HH:mm:ss"),
				range: [300]
			});

			setOrigin({
				label: "",
				geometry: null
			});

			setDestination({
				label: "",
				geometry: null
			});

			setSeats("");
			setTime(day());
		}
	};
	console.log("status??", hidden, submitted);

	return (
		<Collapse in={!hidden}>
			<Form onSubmit={submit}>
				<GeocodeInput
					setLocation={setOrigin}
					formLabel="I'm leaving from"
					options={{
						markerColor: "blue"
					}}
				/>
				<GeocodeInput
					setLocation={setDestination}
					formLabel="I'm going to"
					options={{
						markerColor: "red"
					}}
				/>
				<TimeInput
					time={time}
					format="HH:mm"
					onChange={setTime}
					label="When?"
				/>
				<Grid container>
					<Button type="submit" onClick={submit}>
						Search for Rides
					</Button>
					{submitted && (
						<Button
							onClick={() =>
								hide({
									submitted,
									hidden: true
								})
							}
						>
							Cancel
						</Button>
					)}
				</Grid>
			</Form>
		</Collapse>
	);
};
