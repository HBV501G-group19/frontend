import { useState, useEffect } from "react";
import { useGeoname } from "./useData";

export const useNamedEndpoints = (originCoords, destinationCoords, token) => {
	const [origin, setOrigin] = useState();
	const [destination, setDestination] = useState();

	const { run: o } = useGeoname(setOrigin, true, token, originCoords);
	const { run: d } = useGeoname(setDestination, true, token, destinationCoords);

	useEffect(() => {
		if (originCoords) o();
	}, [originCoords, o]);

	useEffect(() => {
		if (destinationCoords) d();
	}, [destinationCoords, d]);

	return { origin, destination };
};
