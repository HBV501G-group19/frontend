import React, { useContext, useRef } from "react";
import { Map, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
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

const GeoJSONItem = ({ data, tooltip, popup, icon, ...rest }) => {
	const ref = useRef(null);

	return (
		<GeoJSON ref={ref} data={data} {...rest}>
			{popup && <popup.component parentRef={ref} />}
			{tooltip && tooltip.content && (
				<Tooltip onOpen={tooltip.open} onClose={tooltip.close}>
					{tooltip.content}
				</Tooltip>
			)}
		</GeoJSON>
	);
};

export const LeafletOverlays = () => {
	const { layers } = useContext(MapState);
	console.log(layers);
	return layers.map(({ id, data, tooltip, popup, ...rest }) => (
		<GeoJSONItem
			key={id}
			data={data}
			tooltip={tooltip}
			popup={popup}
			{...rest}
		/>
	));
};
