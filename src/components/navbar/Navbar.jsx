import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";

import ChatIcon from "@material-ui/icons/Chat";
import HomeIcon from "@material-ui/icons/Home";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import CancelIcon from "@material-ui/icons/Cancel";

const pathVals = {
	home: 0,
	rides: 1,
	messages: 2,
	logout: 3
};

export const Navbar = props => {
	const [value, setValue] = React.useState(0);
	const location = useLocation();

	useEffect(() => {
		// highlights the correct button
		const path = location.pathname.substring(1).split("/")[0];
		if (path) setValue(pathVals[path]);
	}, [location]);

	return (
		<BottomNavigation
			value={value}
			showLabels
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
		>
			<BottomNavigationAction
				label="Home"
				icon={<HomeIcon />}
				component={Link}
				to="/"
			/>
			<BottomNavigationAction
				label="Rides"
				icon={<DirectionsCarIcon />}
				component={Link}
				to="/rides"
			/>
			<BottomNavigationAction
				label="Messages"
				icon={<ChatIcon />}
				component={Link}
				to="/messages"
			/>
			<BottomNavigationAction
				label="Log out"
				icon={<CancelIcon />}
				component={Link}
				to="/logout"
			/>
		</BottomNavigation>
	);
};
