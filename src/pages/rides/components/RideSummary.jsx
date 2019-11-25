import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, makeStyles, Collapse } from "@material-ui/core";

import { useUser } from "../../../hooks/useData";
import { Heading } from "../../../components/styles";
import { makeRideTitle, makeDepartureText } from "../../../utils/utils";
import { useRideTime } from "../../../hooks/useRideTime";
import { RideInfo } from "./RideInfo";

const useStyles = makeStyles({
	rideSummary: {
		width: "100%",
		borderBottom: "3px #ddd solid",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "#fafafa"
		}
	}
});

export const RideSummary = ({ ride, user, token, collapsing }) => {
	const [hover, setHover] = useState(false);
	const [driver, setDriver] = useState(null);

	const history = useHistory();
	const { isPending } = useUser(setDriver, false, token, ride.driver);

	const { rideSummary } = useStyles();

	return (
		<Grid
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={e => {
				history.push(`/rides/${ride.id}`);
			}}
			className={rideSummary}
		>
			{collapsing ? (
				<Collapse in={hover} collapsedHeight="2rem">
					<RideInfo ride={ride} user={user} driver={driver} />
				</Collapse>
			) : (
				<RideInfo ride={ride} user={user} driver={driver} />
			)}
		</Grid>
	);
};
