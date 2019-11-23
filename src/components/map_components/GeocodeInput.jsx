import React, { useState, useContext, useEffect, useRef } from "react";
import L from "leaflet";
import styled from "styled-components";
import Async, { useAsync } from "react-async";

import { AuthenticationContext } from "../../context/Authentication";
import { useLocationCoords } from "../../hooks/useLocationCoords";

import { MapDispatch } from "../../map/Map";
import { ACTIONS } from "../../map/constants";
import { Input } from "../forms/input";
import { List } from "../styles";
import { ListItem } from "@material-ui/core";

import { Marker } from "./Marker";
import { BASEURL } from "../../api/utils";
import { getGeocode } from "../../api/ors";
import { useGeocode } from "../../hooks/useData";

const $Li = styled.li`
	font-weight: ${({ hover }) => (hover ? "bold" : "normal")};
`;
const ListMarker = ({
	feature,
	options,
	onClick: _onClick = () => {},
	markerColor
}) => {
	const dispatch = useContext(MapDispatch);
	const [hover, setHover] = useState(false);
	const onClick = e => {
		e.preventDefault();
		_onClick();
	};

	const onClickMarker = e => {
		onClick();
	};

	const {
		properties: { label }
	} = feature;

	useEffect(() => {
		console.log("dispatching: ", feature);
		dispatch({
			type: ACTIONS.INSERT,
			payload: {
				data: feature,
				onClick,
				onMouseOver: e => {
					setHover(true);
				},
				onMouseOut: e => {
					setHover(false);
				}
			}
		});
	});

	return (
		<>
			<ListItem
				onClick={onClick}
				onMouseOver={e => {
					setHover(true);
				}}
				onMouseOut={e => {
					setHover(false);
				}}
				hover={hover}
			>
				<p
					style={{
						fontWeight: hover ? "bold" : "normal"
					}}
				>
					{label}
				</p>
			</ListItem>
		</>
	);
};

const getGeocodes = async ([geocode, focus, token]) => {
	const res = await fetch("http://localhost:8080/ors/geocode", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accepts: "application/json, application/geo+json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ geocode, focus })
	});

	if (!res.ok) throw new Error(res.statusText);
	return res.json();
};

export const GeocodeInput = ({ setLocation, formLabel, options }) => {
	const { token } = useContext(AuthenticationContext);
	const ref = useRef(null);

	const [features, setFeatures] = useState([]);
	const [value, setValue] = useState("");

	const _setFeatures = featureCollection => {
		setFeatures(featureCollection.features);
	};

	const coords = useLocationCoords();
	const { isPending, error, run } = useGeocode(_setFeatures, true, token, {
		geocode: value,
		focus: coords
	});

	const removeOtherMarkers = features => id => {
		const feature = features.find(f => f.properties.id === id);
		setFeatures([feature]);
	};

	const removeOthers = removeOtherMarkers(features);

	const submit = e => {
		e.preventDefault();
		run();
	};

	const focus = () => {
		if (ref.current) ref.current.focus();
	};

	return (
		<>
			<Input
				focusRef={ref}
				onChange={setValue}
				value={value}
				onKeyEnter={submit}
				label={formLabel}
				disabled={isPending}
			/>
			{error && <p>error.message</p>}
			<List>
				{features.map(feature => (
					<ListMarker
						key={feature.properties.id}
						feature={feature}
						onClick={e => {
							focus();
							setValue(feature.properties.label);
							setLocation({
								label: feature.properties.label,
								geometry: feature.geometry
							});
							removeOthers(feature.properties.id);
						}}
					/>
				))}
			</List>
		</>
	);
};
