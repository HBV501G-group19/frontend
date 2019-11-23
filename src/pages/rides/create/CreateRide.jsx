import React, {
	useState,
	useContext,
	useCallback,
	useEffect,
	useRef
} from "react";
import { useHistory } from "react-router-dom";

import { AuthenticationContext } from "../../../context/Authentication";

import { CreateRideForm } from "./components/CreateRideForm";
import { Column } from "../../../components/styles";

import { FeatureCollection as LineStrings } from "../../../components/map_components/geojson";
import { useDirections, useCreateRide } from "../../../hooks/useData";
import { MapDispatch } from "../../../map/Map";
import { ACTIONS } from "../../../map/constants";
import { colors } from "@material-ui/core";
import L from "leaflet";

export const CreateRide = props => {
	const {
		user: { id },
		token
	} = useContext(AuthenticationContext);
	const [endpoints, setEndpoints] = useState();
	const [ride, setRide] = useState(null);
	const [[route], setRoute] = useState([null]);

	const history = useHistory();
	const mapDispatch = useContext(MapDispatch);

	// need to fix the ORS directions api so that it accepts only two points
	const {
		isPending: createPending,
		error: createError,
		runCreate
	} = useCreateRide(setRide, true, token);

	const {
		isPending: routePending,
		error: routeError,
		data: routeData,
		run: runRoute
	} = useDirections(setRoute, true, token, endpoints);

	useEffect(() => {
		if (endpoints) runRoute();
	}, [endpoints, runRoute]);

	const submitRide = useCallback(
		({ seats, origin, destination, departureTime }) => {
			// creating a ride, we only have 1 route
			const { geometry, properties } = routeData[0];
			const {
				summary: { duration }
			} = properties;
			runCreate({
				duration,
				driverId: id,
				seats,
				origin,
				destination,
				departureTime,
				route: geometry
			});
		},
		[id, routeData, runCreate]
	);
	const r = [
		{
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: { type: "Point", coordinates: [-21.94935, 64.14051] },
					properties: {
						id: "6935418",
						gid: "geonames:venue:6935418",
						layer: "venue",
						source: "geonames",
						source_id: "6935418",
						name: "Háskóli Íslands",
						confidence: 0.7,
						distance: 0.181,
						accuracy: "point",
						country: "Iceland",
						country_gid: "whosonfirst:country:85633249",
						country_a: "ISL",
						region: "Capital Region",
						region_gid: "whosonfirst:region:85672493",
						region_a: "NE",
						locality: "Reykjavik",
						locality_gid: "whosonfirst:locality:101751753",
						continent: "Europe",
						continent_gid: "whosonfirst:continent:102191581",
						label: "Háskóli Íslands, Reykjavik, Iceland",
						profile: "driving-car",
						FILTERBUBBLE: "XXXX"
					}
				},
				{
					type: "Feature",
					geometry: { type: "Point", coordinates: [-21.69096, 64.168677] },
					properties: {
						id: "101751749",
						gid: "whosonfirst:locality:101751749",
						layer: "locality",
						source: "whosonfirst",
						source_id: "101751749",
						name: "Mosfellsbaer",
						confidence: 0.5,
						distance: 1.747,
						accuracy: "centroid",
						country: "Iceland",
						country_gid: "whosonfirst:country:85633249",
						country_a: "ISL",
						region: "Capital Region",
						region_gid: "whosonfirst:region:85672493",
						region_a: "NE",
						locality: "Mosfellsbaer",
						locality_gid: "whosonfirst:locality:101751749",
						continent: "Europe",
						continent_gid: "whosonfirst:continent:102191581",
						label: "Mosfellsbaer, Iceland",
						profile: "driving-car",
						FILTERBUBBLE: "XXXX"
					}
				},
				{
					type: "Feature",
					geometry: { type: "LineString", coordinates: [] },
					properties: {
						summary: { distance: 14734.5, duration: 1302.1 },
						way_points: [0, 257],
						profile: "driving-car",
						FILTERBUBBLE: "XXXX"
					}
				}
			]
		}
	];
	useEffect(() => {
		if (route) {
			const features = route.features.map((feature, idx) => ({
				data: feature,
				tooltip: {
					content: feature.properties.name || feature.properties.street || null,
					open: () => {},
					close: () => {}
				},
				style: () => {
					return {
						weight: 5,
						opacity: 0.8,
						color:
							feature.geometry.type === "LineString"
								? colors.indigo[500]
								: colors.teal[500]
					};
				},
				onEachFeature: (feature, layer) => {
					console.log("the info", feature, layer);

					if (feature.geometry.type === "LineString") {
						const tooltip = L.popup().setContent("text");
						layer.bindPopup(tooltip);
						layer.on("mouseover", function(e) {
							const popup = e.target.getPopup();
							popup.setLatLng(e.latlng).openOn(layer);
						});

						layer.on("mouseout", function(e) {
							e.target.closePopup();
						});

						layer.on("mousemove", function(e) {
							console.log(e);
							const loc = L.latLng(e.latlng);
							const end = e.target.getBounds().getSouthWest();

							console.log(feature);
							const minPmet =
								feature.properties.summary.duration /
								60 /
								feature.properties.summary.distance;

							tooltip.setLatLng(e.latlng).openOn(layer);
							tooltip.setContent(
								`~${(
									Math.ceil((minPmet * loc.distanceTo(end)) / 5) * 5
								).toFixed()} minutes`
							);
						});
					}
				}
			}));

			mapDispatch({
				type: ACTIONS.CLEANINSERTMULTI,
				payload: features
			});
		}
	}, [route, mapDispatch]);

	if (ride) {
		const { id: rideId } = ride;
		history.push(`/rides/${rideId}`, {
			ride
		});
	}

	return (
		<Column>
			<h2>Submit your Ride</h2>
			{createPending ? <p>Creating ride...</p> : null}
			{createError ? <p>Something went wrong :(</p> : null}
			{routeError ? <p>Error getting route directions</p> : null}
			{routeData ? <LineStrings featureCollection={routeData} /> : null}
			<CreateRideForm submitEndpoints={setEndpoints} submitRide={submitRide} />
		</Column>
	);
};
