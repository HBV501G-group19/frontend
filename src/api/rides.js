import { postRequest, patchRequest, getRequest } from "./utils";

export const createRide = postRequest("/rides/create");

export const getConvinientRides = postRequest("/rides/convenient");

export const getRide = getRequest("/rides");

export const addPassenger = patchRequest("/rides/addpassenger");
