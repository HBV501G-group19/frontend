import { postRequest } from "../api/utils";

export const getGeocodes = postRequest("/ors/geocode");
export const getGeoname = postRequest("/ors/geoname");
export const getDirections = postRequest("/ors/directions");
