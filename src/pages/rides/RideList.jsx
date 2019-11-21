import React, { useContext, useState } from "react";
import { Column, Heading, List } from "../../components/styles";
import { AuthenticationContext } from "../../context/Authentication";
import { useUser } from "../../hooks/useData";
import { LinearProgress, Divider, Typography } from "@material-ui/core";
import { RideSummary } from "./components/RideSummary";
import day from "dayjs";

export const RideList = props => {
	const [userData, setUserData] = useState();
	const { user, token } = useContext(AuthenticationContext);

	const { isPending } = useUser(setUserData, false, token, user.id);

	return (
		<Column>
			<Heading>{user.username}'s rides</Heading>
			{isPending && <LinearProgress />}
			{userData ? (
				<>
					<List>
						{!userData.drives.length && (
							<Typography variant="h6" component="p">
								You're not driving anywhere
							</Typography>
						)}
						{userData.drives
							.filter(ride => day().unix() < day(ride.departureTime).unix())
							.sort((a, b) =>
								a.departureTime < b.departureTime
									? 1
									: a.departureTime === b.departureTime
									? 0
									: -1
							)
							.map(ride => (
								<RideSummary ride={ride} user={user} token={token} />
							))}
						<Divider />
						{userData.drives
							.filter(ride => day().unix() > day(ride.departureTime).unix())
							.sort((a, b) =>
								a.departureTime < b.departureTime
									? 1
									: a.departureTime === b.departureTime
									? 0
									: -1
							)
							.map(ride => {
								console.log(ride.departureTime);
								return (
									<RideSummary
										collapsing
										ride={ride}
										user={user}
										token={token}
									/>
								);
							})}
					</List>

					<List>
						{!userData.rides.length && (
							<Typography variant="h6" component="p">
								You're not riding with anyone
							</Typography>
						)}
						{userData.rides
							.filter(ride => day().unix() < day(ride.departureTime).unix())
							.sort((a, b) =>
								a.departureTime < b.departureTime
									? 1
									: a.departureTime === b.departureTime
									? 0
									: -1
							)
							.map(ride => (
								<RideSummary ride={ride} user={user} token={token} />
							))}
						{userData.rides
							.filter(ride => day().unix() > day(ride.departureTime).unix())
							.sort((a, b) =>
								a.departureTime < b.departureTime
									? 1
									: a.departureTime === b.departureTime
									? 0
									: -1
							)
							.map(ride => {
								console.log(ride.departureTime);
								return (
									<RideSummary
										collapsing
										ride={ride}
										user={user}
										token={token}
									/>
								);
							})}
					</List>
				</>
			) : null}
		</Column>
	);
};
