import React, {
	createContext,
	useContext,
	useCallback,
	useReducer
} from "react";
import { getRequest } from "../api/utils";
import { AuthenticationContext } from "./Authentication";
import { getGeoname } from "../api/ors";
import { useAsync } from "react-async";

const NextRideContext = createContext(null);

const reducer = (state, { type, payload }) => {
	switch (type) {
		case "ride": {
			return { ...state, ride: payload };
		}
		case "drive": {
			return { ...state, drive: payload };
		}
		case "both": {
			return { ...state, ride: payload.ride, drive: payload.drive };
		}
		default:
			return state;
	}
};

const getRideWithGeonames = async (rides, id, token) => {
	const req = getRequest(`/users/${id}/${rides ? "rides" : "drives"}`);
	const json = await req(["", token]);
	const res = await json.json();

	const [next] = res.sort((a, b) =>
		a.departureTime > b.departureTime
			? 1
			: a.departureTime < b.departureTime
			? -1
			: 0
	);

	const { origin: o, destination: d } = next;

	const originJson = await getGeoname([o, token]);
	const origin = await originJson.json();
	const destinationJson = await getGeoname([d, token]);
	const destination = await destinationJson.json();

	return {
		ride: next,
		origin,
		destination
	};
};

export const NextRideProvider = ({ children }) => {
	const { user, token } = useContext(AuthenticationContext);

	const getData = useCallback(async () => {
		const nextRide = await getRideWithGeonames(true, user.id, token);
		const nextDrive = await getRideWithGeonames(false, user.id, token);

		dispatch({
			action: "both",
			ride: nextRide,
			drive: nextDrive
		});
	}, [user, token]);

	const { run } = useAsync({
		deferFn: getData
	});

	const [state, dispatch] = useReducer(reducer, {}, () => {
		run();
	});

	return (
		<NextRideContext.Provider value={(state, dispatch)}>
			{...children}
		</NextRideContext.Provider>
	);
};
