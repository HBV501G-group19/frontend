import React, { useContext, useState, useEffect } from "react";
import { Grid, LinearProgress, Typography } from "@material-ui/core";
import { AuthenticationContext } from "../../context/Authentication";
import { StyledLink as Link, Column, Heading } from "../../components/styles";
import { useUser } from "../../hooks/useData";
import { RideSummary } from "../rides/components/RideSummary";

export const Home = props => {
	const [data, setData] = useState();
	const [rides, setRides] = useState([]);
	const [drives, setDrives] = useState([]);

	const { user, token } = useContext(AuthenticationContext);
	const { isPending } = useUser(setData, false, token, user.id);

	useEffect(() => {
		if (data) {
			// const rides = data.rides
			// 	.filter(ride => ride.departureTime > new Date().toISOString())
			// 	.sort((a, b) => a.departureTime < b.departureTime);
			const rides = data.rides;

			const drives = data.drives
				.filter(ride => {
					console.log(ride.departureTime, new Date().toISOString());
					return ride.departureTime > new Date().toISOString();
				})
				.sort((a, b) => a.departureTime < b.departureTime);

			setRides(rides);
			setDrives(drives);
		}
	}, [data]);

	return (
		<Column>
			<Heading>Hopon</Heading>
			<p>{`Welcome ${user.username}`}</p>
			{isPending && <LinearProgress />}
			<Grid container>
				{drives.length ? (
					<>
						<Typography variance="subtitle2" component="h3">
							You're next drive:
						</Typography>
						<RideSummary ride={drives[0]} user={user} token={token} />
					</>
				) : null}
				{rides.length ? (
					<>
						<Typography variance="subtitle2" component="h3">
							You're next ride:
						</Typography>
						<RideSummary ride={rides[0]} user={user} token={token} />
					</>
				) : null}
				<Grid container justify="center">
					<Link to="rides/search">I Need a Ride</Link>
					<Link to="rides/create">I'm Offering a Ride!</Link>
				</Grid>
			</Grid>
		</Column>
	);
};
