import React, {
	useState,
	useContext,
	useRef,
	useCallback,
	useEffect
} from "react";

import { AuthenticationContext } from "../../context/Authentication";
import { useLocationCoords } from "../../hooks/useLocationCoords";

import { MapDispatch } from "../../map/Map";
import { ACTIONS } from "../../map/constants";
import { Input } from "../forms/input";
import { List, CollapsableList } from "../styles";
import { ListItem, Typography, Box } from "@material-ui/core";
import { useGeocode } from "../../hooks/useData";
import { useBoundMarker } from "../../map/hooks";
import { Icon } from "../../map/mapUtils";

const ListMarker = ({ feature, onClick = () => {} }) => {
	const [hover, setHover] = useState(false);

	const self = useRef(null);

	const dispatchMarker = useBoundMarker({
		id: feature.properties.id,
		feature,
		clean: false,
		events: [
			{
				event: hover,
				trigger: "openTooltip",
				untrigger: "closeTooltip"
			}
		],
		onClick,
		tooltip: {
			content: feature.properties.name || feature.properties.label
		},
		hoverTrigger: setHover,
		controlRef: self,
		iconComponent: Icon
	});

	useEffect(() => {
		if (feature) {
			dispatchMarker(ACTIONS.INSERT);
		}
	}, [feature, dispatchMarker]);
	return (
		<ListItem
			ref={self}
			onClick={onClick}
			onMouseOver={e => {
				setHover(true);
			}}
			onMouseOut={e => {
				setHover(false);
			}}
			hover={hover ? 1 : 0}
		>
			<Typography component="span">
				<Box fontWeight={hover ? "bold" : "normal"}>
					{feature.properties.label}
				</Box>
			</Typography>
		</ListItem>
	);
};

export const GeocodeInput = ({ setLocation, formLabel, options }) => {
	const { token } = useContext(AuthenticationContext);
	const dispatch = useContext(MapDispatch);
	const ref = useRef(null);

	const [features, setFeatures] = useState([]);
	const [value, setValue] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const _setFeatures = useCallback(featureCollection => {
		setFeatures(featureCollection.features);
	}, []);

	const coords = useLocationCoords();
	const { isPending, error, run } = useGeocode(_setFeatures, true, token, {
		geocode: value,
		focus: coords
	});

	const removeOtherMarkers = features => id => {
		const feature = features.find(f => f.properties.id === id);
		const removalIds = features
			.filter(f => f.properties.id !== id)
			.map(f => f.properties.id);
		dispatch({
			type: ACTIONS.REMOVEMULTI,
			payload: removalIds
		});

		setFeatures([feature]);
	};

	const removeOthers = removeOtherMarkers(features);

	const submit = e => {
		e.preventDefault();
		run();
		setSubmitted(true);
	};

	const focus = () => {
		if (ref.current) ref.current.focus();
	};

	useEffect(() => {
		console.log("changed", features);
	}, [features]);

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
			<CollapsableList in={submitted}>
				{/* <List> */}
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
				{/* </List> */}
			</CollapsableList>
		</>
	);
};
