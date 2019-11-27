import { useState, useEffect, useCallback } from "react";
import { useAsync } from "react-async";

import {
	getRide,
	createRide,
	getConvinientRides,
	addPassenger
} from "../api/rides";
import { getUser } from "../api/user";
import { getDirections, getGeocodes, getGeoname } from "../api/ors";
import {
	getConversation,
	getConversationList,
	getConversationPost
} from "../api/messages";
import { getRequest } from "../api/utils";

const makeDataHook = request => (setState, defer = false, token, payload) => {
	const [hasRun, setHasRun] = useState(false);
	const { data, isPending, error, run } = useAsync({
		deferFn: request
	});
	// run identity is stable
	// eslint-disable-next-line
	const runWrap = useCallback(
		deferedPayload =>
			deferedPayload ? run(deferedPayload, token) : run(payload, token),
		[token, payload, run]
	);

	useEffect(() => {
		// effect should only run on mount if it isn't deffered
		if (!defer) runWrap();
	}, []); // eslint-disable-line

	useEffect(() => {
		if (data) {
			setState(data);
		}
		if (data || error) {
			setHasRun(true);
		}
	}, [data, error, setState, setHasRun]);

	return {
		hasRun,
		isPending,
		error,
		run: runWrap
	};
};

export const useUser = makeDataHook(getUser);

export const useRide = makeDataHook(getRide);
export const useCreateRide = makeDataHook(createRide);
export const useConvinientRides = makeDataHook(getConvinientRides);
export const useAddPassenger = makeDataHook(addPassenger);

export const useDirections = makeDataHook(getDirections);
export const useGeocode = makeDataHook(getGeocodes);
export const useGeoname = makeDataHook(getGeoname);

export const useConversation = makeDataHook(getConversation);
export const useConversationPost = makeDataHook(getConversationPost);
export const useConversationList = makeDataHook(getConversationList);

const getFuel = getRequest("http://apis.is/petrol");

export const useFuelCosts = distance => {
	const [cost, setCost] = useState(0);
	const { data, isPending, error, run } = useAsync({
		deferFn: getFuel
	});

	useEffect(() => {
		if (data) {
			const { results } = data;
			const avg = results.reduce(
				(avg, { bensin95 }) => avg + bensin95 / results.length,
				0
			);
			const costPkm = 0.1 * avg; // assume 10l/100km fuel consumption
			const km = distance / 1000;
			const _cost = costPkm * km;
			setCost(Math.ceil(_cost / 500) * 500, 500); // round to nearest 500, with minimum of 500
		} else {
			run("");
		}
	}, [data, distance, run]);
	console.log(distance);
	console.log(data, cost);

	return {
		isPending,
		error,
		cost
	};
};
