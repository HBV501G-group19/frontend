import React, { useContext, useState } from "react";
import { Column, Heading, List } from "../../components/styles";
import { AuthenticationContext } from "../../context/Authentication";
import { useUser } from "../../hooks/useData";
import { LinearProgress, Divider, Typography } from "@material-ui/core";
import { RideSummary } from "./components/RideSummary";
import day from "dayjs";

import { filterDepartedRides } from "../../utils/utils";

export const RideList = props => {
	const [userData, setUserData] = useState();
	const { user, token } = useContext(AuthenticationContext);

	const { isPending } = useUser(setUserData, false, token, user.id);
	console.log(userData);
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
						{filterDepartedRides(userData.drives).map(ride => (
							<RideSummary ride={ride} user={user} token={token} />
						))}
						<Divider />
						{filterDepartedRides(userData.drives, true).map(ride => {
							return (
								<RideSummary collapsing ride={ride} user={user} token={token} />
							);
						})}
					</List>

					<List>
						{!userData.rides.length && (
							<Typography variant="h6" component="p">
								You're not riding with anyone
							</Typography>
						)}
						{filterDepartedRides(userData.rides).map(ride => (
							<RideSummary ride={ride} user={user} token={token} />
						))}
						{filterDepartedRides(userData.rides, true).map(ride => {
							return (
								<RideSummary collapsing ride={ride} user={user} token={token} />
							);
						})}
					</List>
				</>
			) : null}
		</Column>
	);
};
