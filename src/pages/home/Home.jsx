import React from "react";
import { StyledLink as Link } from '../../components/styles'

export const Home = props => (
	<>
		<Link to="rides/search">I Need a Ride</Link>
		<Link to="rides/create">I'm Offering a Ride!</Link>
	</>
)
