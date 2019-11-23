import { ACTIONS } from "./constants";

export const addRideToMap = (ride, dispatch, clean = true) => {
	const { id, origin, destination, route } = ride;
	const action = {
		type: clean ? ACTIONS.CLEANINSERTMULTI : ACTIONS.INSERTMULTI,
		payload: [
			{
				id: `${id}origin`,
				data: origin
			},
			{
				id: `${id}destination`,
				data: destination
			},
			{
				id: `${id}route`,
				data: route
			}
		]
	};
	dispatch(action);
};
