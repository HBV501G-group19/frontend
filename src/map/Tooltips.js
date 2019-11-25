import React, { useRef, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { Popup, useLeaflet } from "react-leaflet";
import L from "leaflet";
import { RideSummary } from "../pages/rides/components/RideSummary";

const usePopupBind = parentRef => {
	const ref = useRef(null);
	useEffect(() => {
		if (ref.current && parentRef.current) {
			const { leafletElement: parent } = parentRef.current;
			const { leafletElement: popup } = ref.current;
			parent.on("mouseover", () => parent.bindPopup(popup).openPopup());
			parent.on("mouseout", () => parent.bindPopup(popup).closePopup());
			parent.on("mousemove", e => {
				const {
					geometry: { coordinates }
				} = e.layer.feature;
				const minimum = coordinates
					.filter(coordinate => coordinate.length)
					.reduce((min, coordinate) => {
						const coord = L.latLng(coordinate.slice().reverse());
						const distToMin = e.latlng.distanceTo(min);
						const dist = e.latlng.distanceTo(coord);
						return distToMin > dist ? coord : min;
					}, coordinates[0].slice().reverse());

				popup.setLatLng(minimum);
			});
		}
	}, [parentRef]);

	return ref;
};

const Tooltip = ({ children, parentRef }) => {
	const ref = usePopupBind(parentRef);
	return (
		<Popup closeButton={false} ref={ref}>
			{children}
		</Popup>
	);
};

const RouteTooltip = ({ ride, user, token, parentRef }) => (
	<Tooltip parentRef={parentRef}>
		<RideSummary ride={ride} user={user} token={token} />
	</Tooltip>
);

export const makeRouteTooltip = ({ ride, user, token }) => ({ parentRef }) => (
	<RouteTooltip ride={ride} user={user} token={token} parentRef={parentRef} />
);
const NewRouteTooltip = ({ feature, parentRef }) => {
	const {
		properties: { summary }
	} = feature;

	return (
		<Tooltip parentRef={parentRef}>
			<Grid>
				{summary.distance}
				{summary.duration}
			</Grid>
		</Tooltip>
	);
};

export const makeNewRouteTooltip = ({ feature, mousePos }) => ({
	parentRef
}) => (
	<NewRouteTooltip
		feature={feature}
		mousePos={mousePos}
		parentRef={parentRef}
	/>
);
