import React, { useContext, useState, useEffect } from "react";
import { Grid, LinearProgress, Typography } from "@material-ui/core";
import { AuthenticationContext } from "../../context/Authentication";
import { StyledLink as Link, Column, Heading } from "../../components/styles";
import { useUser } from "../../hooks/useData";
import { RideSummary } from "../rides/components/RideSummary";
import { ACTIONS } from "../../map/constants";
import { MapDispatch } from "../../map/Map";
import { addRideToMap } from "../../map/mapUtils";
import { filterDepartedRides } from "../../utils/utils";

export const Home = props => {
	const [data, setData] = useState();
	const [nextRide, setRide] = useState();
	const [nextDrive, setDrive] = useState();

	const dispatch = useContext(MapDispatch);

	const { user, token } = useContext(AuthenticationContext);
	const { isPending } = useUser(setData, false, token, user.id);
	useEffect(() => {
		if (data) {
			const ride = filterDepartedRides(data.rides);
			const drive = filterDepartedRides(data.drives);
			setRide(ride[0]);
			setDrive(drive[0]);
		}
	}, [data]);

	useEffect(() => {
		if (nextDrive || nextRide) {
			const ride = nextDrive || nextRide;
			addRideToMap(ride, dispatch);
		} else {
			dispatch({
				type: ACTIONS.CLEAR
			});
		}
	}, [nextRide, nextDrive, dispatch]);

	return (
		<Column>
			<Heading>Hopon</Heading>
			<p>{`Welcome ${user.username}`}</p>
			{isPending && <LinearProgress />}
			<Grid container>
				{nextDrive ? (
					<>
						<Typography variance="subtitle2" component="h3">
							You're next drive:
						</Typography>
						<RideSummary
							endpoints={{
								origin: nextDrive.properties.origin,
								destination: nextDrive.properties.destination
							}}
							ride={nextDrive}
							user={user}
							token={token}
						/>
					</>
				) : null}
				{nextRide ? (
					<>
						<Typography variance="subtitle2" component="h3">
							You're next ride:
						</Typography>
						<RideSummary
							endpoints={{
								origin: nextRide.properties.origin,
								destination: nextRide.properties.destination
							}}
							ride={nextRide}
							user={user}
							token={token}
						/>
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
