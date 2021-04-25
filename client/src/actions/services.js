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

export const verifyUser = (
	code
) => {
	return fetch(`${base}/auth/confirm/${code}`, {
		method: "GET",
		headers: getHeader(),
	})
	.then(handleResponse);
}

/* Ranking */

export const fetchRankings = param => {
	let url = `${base}/ranking/`
	if (param) url += param;
	return fetch(url, {
			method: "GET",
			headers: getHeader(),
		})
		.then(handleResponse);
};

export const entryRankings = input => {
	const decision = input === "Lahku" ? "leave" : "join"
	return fetch(`${base}/ranking/${decision}`, {
			method: "POST",
			headers: getHeader({
				token: true
			}),
		})
		.then(handleResponse);
};

/* Challenges */

export const fetchChallenges = param => {
	let url = `${base}/challenge/`
	if (param) url += param;
	return fetch(url, {
			method: "GET",
			headers: getHeader({
				token: true
			}),
		})
		.then(handleResponse);
};

export const updateChallenge = (id, data) => {
	return fetch(`${base}/challenge/update/${id}`, {
			method: "PUT",
			headers: getHeader({
				token: true
			}),
			body: JSON.stringify(data)
		})
		.then(handleResponse);
};

export const deleteChallenge = id => {
	return fetch(`${base}/challenge/delete/${id}`, {
			method: "DELETE",
			headers: getHeader({
				token: true
			})
		})
		.then(handleResponse);
};

export const acceptChallenge = id => {
	return fetch(`${base}/challenge/accept/${id}`, {
			method: "PUT",
			headers: getHeader({
				token: true
			})
		})
		.then(handleResponse);
};

export const createChallenge = (id, data) => {
	return fetch(`${base}/challenge/create/${id}`, {
			method: "POST",
			headers: getHeader({
				token: true
			}),
			body: JSON.stringify(data)
		})
		.then(handleResponse);
};

export const fetchChallengeHistory = id => {
	return fetch(`${base}/challenge/history/${id}`, {
			method: "GET",
			headers: getHeader({
				token: true
			}),
		})
		.then(handleResponse);
};

/* Notifications */

export const fetchNotifications = () => {
	return fetch(`${base}/notification/`, {
			method: "GET",
			headers: getHeader({
				token: true
			}),
		})
		.then(handleResponse);
};

export const updateNotification = (id, data) => {
	return fetch(`${base}/notification/update/${id}`, {
			method: "PUT",
			headers: getHeader({
				token: true
			}),
			body: JSON.stringify(data)
		})
		.then(handleResponse);
};

export const deleteNotification = id => {
	return fetch(`${base}/notification/delete/${id}`, {
			method: "DELETE",
			headers: getHeader({
				token: true
			})
		})
		.then(handleResponse);
};

export const deleteAllNotification = () => {
	return fetch(`${base}/notification/deleteAll`, {
			method: "DELETE",
			headers: getHeader({
				token: true
			})
		})
		.then(handleResponse);
};

export const markAllNotificationsRead = () => {
	return fetch(`${base}/notification/readAll`, {
			method: "PUT",
			headers: getHeader({
				token: true
			})
		})
		.then(handleResponse);
};

/* User */

export const updateUser = data => {
	return fetch(`${base}/user/update`, {
			method: "PUT",
			headers: getHeader({
				token: true
			}),
			body: JSON.stringify(data)
		})
		.then(handleResponse);
};