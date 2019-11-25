import React, { createContext, useReducer, useCallback } from "react";
import L from "leaflet";

import { ACTIONS, LAYERTYPES as LAYERSTRINGS } from "./constants";

export const MapContext = createContext(null);
export const MapDispatch = createContext(null);
export const MapState = createContext(null);

// const marker = {
// 	id: 3,
//  type: "MARKER",
//  payload: {
//   	tooltip: "a tooltip",
//   	coordinates: [-21, 64],
//   	listeners: [
//   		{
//   			event: "mouseenter",
//   			cb: () => {
//   				console.log("mouse entered");
//   			}
//   		}
//   	]
//   }
// };

// const lineString = {
// 	id: 5,
// 	type: "LINESTRING",
// 	payload: {
// 		coordinates: [
// 			[-21, 64],
// 			[-20, 65]
// 		],
// 		options: {
// 			color: "#f00"
// 		},
// 		listeners: [
// 			{
// 				event: "click",
// 				cb: () => {
// 					console.log("clicked!");
// 				}
// 			}
// 		]
// 	}
// };

export const LAYERTYPES = {
	[LAYERSTRINGS.LINESTRING]: L.lineString,
	[LAYERSTRINGS.MARKER]: L.marker,
	[LAYERSTRINGS.GEOJSON]: L.geoJSON
};

const mapReducer = (state, { payload, type }) => {
	switch (type) {
		case ACTIONS.SETMAP:
			return {
				...state,
				id: payload.id,
				map: payload.map,
				tiles: payload.tiles
			};

		case ACTIONS.CLEANINSERT:
			return { ...state, layers: [payload] };

		case ACTIONS.CLEANINSERTMULTI:
			return { ...state, layers: [...payload] };

		case ACTIONS.INSERT:
			const found = state.layers.find(({ id }) => id === payload.id);
			// only update the state if the layer is not already there
			return !found ? { ...state, layers: [...state.layers, payload] } : state;

		case ACTIONS.INSERTMULTI:
			// only update the state if the layer is not already there
			const toAdd = payload.filter(
				layer => !state.layers.find(({ id }) => id === payload.id)
			);
			console.log("rides: ", payload, toAdd);

			return { ...state, layers: [...state.layers, ...toAdd] };

		case ACTIONS.REMOVE:
			return {
				...state,
				layers: state.layers.filter(layer => layer.id !== payload.id)
			};
		case ACTIONS.REMOVEMULTI:
			return {
				...state,
				layers: state.layers.filter(layer => !payload.includes(layer.id))
			};
		case ACTIONS.CLEAR: {
			return { ...state, layers: [] };
		}
		default:
			return state;
	}
};

export const useLeaflet = ({ id, center, zoom, children }) => {
	const [state, dispatch] = useReducer(mapReducer, {
		layers: [],
		map: null,
		id: null
	});

	const dispatchCb = useCallback(
		({ children }) => (
			<MapDispatch.Provider value={dispatch}>{children}</MapDispatch.Provider>
		),
		[dispatch]
	);
	const stateCb = useCallback(
		({ children }) => (
			<MapState.Provider value={state}>{children}</MapState.Provider>
		),
		[state]
	);

	return {
		DispatchProvider: dispatchCb,
		MapStateProvider: stateCb
	};
};
