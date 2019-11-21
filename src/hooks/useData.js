import { useState, useEffect, useCallback } from "react";
import { useAsync } from "react-async";

import { getRide, createRide } from "../api/rides";
import { getUser } from "../api/user";
import { getDirections, getGeocodes } from "../api/ors";
import { getConversation, getConversationList } from "../api/messages";

const makeDataHook = request => (setState, defer = false, token, ...args) => {
	const [oldData, setOldData] = useState(null);
	const { data, isPending, error, run } = useAsync({
		deferFn: request
	});

	const runWrap = useCallback(() => run(...args, token), [token, args]);

	useEffect(() => {
		if (!defer) runWrap();
	}, []);

	useEffect(() => {
		if (data) setState(data);
	}, [data]);

	return {
		isPending,
		error,
		run: runWrap
	};
};

export const useUser = makeDataHook(getUser);
// export const useCreateUser = makeDataHook(createUser)

export const useRide = makeDataHook(getRide);
export const useCreateRide = makeDataHook(createRide);

export const useDirections = makeDataHook(getDirections);
export const useGeocode = makeDataHook(getGeocodes);

export const useConversation = makeDataHook(getConversation);
export const useConversationList = makeDataHook(getConversationList);
