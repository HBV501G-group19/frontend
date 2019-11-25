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
		// setState identity is stable
	}, [data]); // eslint-disable-line

	return {
		hasRun,
		isPending,
		error,
		run: runWrap
	};
};

export const useUser = makeDataHook(getUser);
// export const useCreateUser = makeDataHook(createUser)

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
