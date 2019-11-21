export const BASEURL = process.env.REACT_APP_API_URL;

export const httpMethod = {
	GET: "GET",
	POST: "POST",
	PATCH: "PATCH"
};

export const payloadRequest = method => path => async ([
	payload,
	token = null
]) => {
	console.log(payload, token);
	const url = new URL(path, BASEURL);
	const headers = {
		accept: "application/json",
		"content-type": "application/json"
	};

	if (token) headers["authorization"] = `Bearer ${token}`;

	const res = await fetch(url, {
		method,
		headers,
		body: JSON.stringify(payload)
	});

	if (!res.ok) throw new Error(res.statusText);
	return res.json();
};

export const getRequest = path => async ([params, token = null]) => {
	const url = new URL(`${path}/${params}`, BASEURL);
	const headers = {
		accept: "application/json"
	};
	if (token) headers.authorization = `Bearer ${token}`;

	const res = await fetch(url, {
		method: httpMethod.GET,
		headers
	});

	if (!res.ok) throw new Error(res.statusText);
	return res.json();
};

export const postRequest = payloadRequest(httpMethod.POST);

export const patchRequest = payloadRequest(httpMethod.PATCH);
