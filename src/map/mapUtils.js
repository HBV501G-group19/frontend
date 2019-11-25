import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import { Room } from "@material-ui/icons";
import { ACTIONS } from "./constants";
import { colors } from "@material-ui/core";

export const Icon = ({ controlRef }) => {
	const [hovering, setHovering] = useState(false);
	useEffect(() => {
		if (controlRef.current) {
			controlRef.current.addEventListener("mouseenter", () => {
				setHovering(true);
			});
			controlRef.current.addEventListener("mouseout", () => {
				setHovering(false);
			});
		}
	}, [controlRef]);

	return <Room color={hovering ? "primary" : "secondary"} />;
};

export const generateIcon = ({ component: Component = <Icon />, pos }) => {
	const iconContainer = document.createElement("div");
	iconContainer.setAttribute(
		"style",
		"width: 12px; height: 12px; display: flex; justify-content: center; align-items: flex-end"
	);
	ReactDOM.render(Component, iconContainer);
	const icon = L.divIcon({
		html: iconContainer,
		bgPos: pos,
		className: "_NO-CLASS"
	});
	return icon;
};

export const prepareLineString = ({
	feature,
	id,
	color = colors.indigo[500],
	tooltip,
	...rest
}) => {
	return [
		{
			id: `overlay:${id}`,
			data: feature,
			style: () => {
				return {
					weight: 5,
					opacity: 0.8,
					color
				};
			}
		},
		{
			id: `surface:${id}`,
			data: feature,
			style: () => {
				return {
					weight: 15,
					opacity: 0.0
				};
			},
			popup: tooltip,
			...rest
		}
	];
};

export const preparePoint = ({ feature, iconComponent, tooltip, ...rest }) => ({
	id: feature.properties.id,
	data: feature,
	tooltip,
	...rest
});

export const addRideToMap = (ride, dispatch, clean = true) => {
	const { id, route } = ride;
	const lineString = prepareLineString({
		id: id,
		feature: route,
		weight: 5
	});

	const {
		properties: { origin: originProps, destination: destinationProps }
	} = ride;

	const origin = {
		type: "Feature",
		geometry: ride.origin,
		properties: originProps
	};

	const destination = {
		type: "Feature",
		geometry: ride.destination,
		properties: destinationProps
	};

	const action = {
		type: clean ? ACTIONS.CLEANINSERTMULTI : ACTIONS.INSERTMULTI,
		payload: [
			{
				id: `origin:${id}`,
				data: origin,
				tooltip: {
					content: originProps.name || originProps.street
				}
			},
			{
				id: `destination:${id}`,
				data: destination,
				tooltip: {
					content: destinationProps.name || destinationProps.street
				}
			},
			...lineString
		]
	};
	dispatch(action);
};
