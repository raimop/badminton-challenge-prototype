const base = "/api";

export const getToken = () => localStorage.getItem("token")

export const getHeader = ({ token = false } = {}) => {
	const header = {
		"content-type": "application/json"
	}
	if (token) header["Authorization"] = `Bearer ${getToken()}`
	return header
}

const handleResponse = res => {
	return res.json()
		.then(json => {
			if (res.ok) {
				return json
			} else {
				if (res.status === 401) return Promise.reject("Ligipääs puudub")
				return Promise.reject(json.msg)
			}
		})
}

/* Auth */

export const signup = data => {
	return fetch(`${base}/auth/signup`, {
			method: "POST",
			headers: getHeader(),
			body: JSON.stringify(data)
		})
		.then(handleResponse);
};

export const login = ({
	email,
	password
}) => {
	return fetch(`${base}/auth/login`, {
			method: "POST",
			headers: getHeader(),
			body: JSON.stringify({
				email,
				password
			})
		})
		.then(handleResponse);
};

export const fetchRankings = param => {
	let url = `${base}/ranking/`
	if (param) url += param;
	return fetch(url, {
			method: "GET",
			headers: getHeader(),
		})
		.then(handleResponse);
};