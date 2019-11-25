import React, { useState, useContext, useEffect, useCallback } from "react";
import { MapDispatch } from "./Map";
import { preparePoint, Icon as IconComponent } from "./mapUtils";
import L from "leaflet";

export const useBoundMarker = ({
	events,
	hoverTrigger,
	onClick,
	tooltip,
	controlRef,
	feature
}) => {
	const dispatch = useContext(MapDispatch);
	const [marker, setMarker] = useState();
	const [payload, setPayload] = useState(null);

	useEffect(() => {
		if (marker && tooltip) {
			// marker.bindTooltip(tooltip.content);
			// marker.on("tooltipopen", tooltip.open || (() => {}));
			// marker.on("tooltipclose", tooltip.close || (() => {}));
			marker.on(
				"tooltipopen",
				tooltip.open ||
					(() => {
						if (controlRef)
							controlRef.current.dispatchEvent(new Event("mouseenter"));
					})
			);

			marker.on(
				"tooltipclose",
				tooltip.close ||
					(() => {
						if (controlRef)
							controlRef.current.dispatchEvent(new Event("mouseout"));
					})
			);
		}
	}, [tooltip, marker, controlRef]);

	useEffect(() => {
		if (marker) {
			events.forEach(({ event, trigger, untrigger }) => {
				if (event) {
					marker[trigger]();
				} else {
					marker[untrigger]();
				}
			});
		}
	}, [marker, events]);

	useEffect(() => {
		if (feature) {
			const payload = preparePoint({
				feature,
				onClick,
				tooltip,
				onMouseOver: e => {
					hoverTrigger(true);
				},
				onMouseOut: e => {
					hoverTrigger(false);
				},
				onEachFeature: (feature, layer) => {
					setMarker(layer);
				}
			});
			setPayload(payload);
		}
	}, [feature, dispatch, hoverTrigger, onClick, controlRef]);

	const dispatcher = useCallback(
		type => {
			if (payload) {
				dispatch({
					type,
					payload
				});
			}
		},
		[dispatch, payload]
	);

	return dispatcher;
};
