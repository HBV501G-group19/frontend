import React, { useContext, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { AuthenticationContext } from "../../context/Authentication";
import { StyledLink as Link, Column } from "../../components/styles";
import { useUser } from "../../hooks/useData";
import { RideInfo } from "../rides/components/RideInfo";

export const Home = props => {
	const [data, setData] = useState();
	const [rides, setRides] = useState([]);
	const [drives, setDrives] = useState([]);

	const { user, token, authenticated } = useContext(AuthenticationContext);
	const { error, isPending } = useUser(setData, false, token, user.id);

	useEffect(() => {
		if (data) {
			const rides = data.rides
				.filter(ride => ride.departureTime > new Date().toISOString())
				.sort((a, b) => a.departureTime < b.departureTime);

			const drives = data.drives
				.filter(ride => ride.departureTime > new Date().toISOString())
				.sort((a, b) => a.departureTime < b.departureTime);

			setRides(rides);
			setDrives(drives);
		}
	}, [data]);

	return (
		<Column>
			<h2>Hopon</h2>
			<p>{`Welcome ${user.username}`}</p>
			<Grid container justify="center">
				{drives.length ? (
					<Grid container>
						<RideInfo ride={drives[0]} driver={{ username: "you babe" }} />
					</Grid>
				) : null}
				{rides.length ? (
					<Grid container>
						<RideInfo ride={rides[0]} driver={{ username: "someone else" }} />
					</Grid>
				) : null}
				<Link to="rides/search">I Need a Ride</Link>
				<Link to="rides/create">I'm Offering a Ride!</Link>
			</Grid>
		</Column>
	);
};
