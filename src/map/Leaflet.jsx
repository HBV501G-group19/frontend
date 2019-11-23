import React, { useContext } from "react";
import { Map, TileLayer, GeoJSON, Tooltip, Popup } from "react-leaflet";
import { MapState } from "./Map";

const tilesUrl =
	"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

const tilesAttribution =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const Leaflet = ({
	provider: Provider,
	options,
	className,
	children
}) => {
	return (
		<Map className={className} {...options}>
			<Provider>{children}</Provider>
			<TileLayer attribution={tilesAttribution} url={tilesUrl} />
		</Map>
	);
};

export const LeafletOverlays = () => {
	const { layers } = useContext(MapState);
	console.log("dispatching: ", layers);
	return layers.map(({ id, data, tooltip, popup, ...rest }) => (
		<GeoJSON key={id} data={data} {...rest}>
			{console.log(rest)}
			{popup && (
				<Popup
					onOpen={popup.open}
					onClose={popup.close}
					position={popup.position}
				>
					{popup.content}
				</Popup>
			)}
			{tooltip && tooltip.content && (
				<Tooltip onOpen={tooltip.open} onClose={tooltip.close}>
					{tooltip.content}
				</Tooltip>
			)}
		</GeoJSON>
	));
};
