import React, { useState, useEffect } from "react";
import day from "dayjs";
import styled from "styled-components";

import { GeocodeInput } from "../../../../components/map_components/GeocodeInput";
import { Button } from "../../../../components/styles";
import { TimeInput, Input, Form } from "../../../../components/forms/input";

export const CreateRideForm = ({ submitEndpoints, submitRide }) => {
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
			const endpoints = [
				{
					origin: origin.geometry,
					destination: destination.geometry,
					profile: "driving-car"
				}
			];

			submitEndpoints({ endpoints });
		}
	}, [origin, destination]);

	const submit = e => {
		e.preventDefault();

		if (origin.geometry && destination.geometry) {
			submitRide({
				seats,
				origin: origin.geometry,
				destination: destination.geometry,
				departureTime: time.format("YYYY-MM-DD HH:mm:ss")
			});
		}
	};

	return (
		<Form>
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
			<TimeInput time={time} format="HH:mm" onChange={setTime} label="When?" />
			<Input
				type="number"
				value={seats}
				onChange={setSeats}
				label="How many seats?"
			/>
			<Button type="submit" onClick={submit}>
				Submit my Ride
			</Button>
		</Form>
	);
};
