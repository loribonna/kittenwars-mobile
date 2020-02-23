export const post = async (url: string, body: FormData, JWTtoken?: string) => {
	let headers: any = {
	};
	if (JWTtoken) {
		headers = {
			...headers,
			Authorization: `Bearer ${JWTtoken}`
		};
	}

	return fetch(url, {
		method: 'POST',
		body: body,
		headers: headers
	}).then(res => {
		if (!res.ok) {
			throw { status: res.status };
		}
		return res.json();
	});
};

export const getFile = async (url: string, JWTtoken?: string) => {
	let headers;
	if (JWTtoken) {
		headers = {
			Authorization: `Bearer ${JWTtoken}`
		};
	}

	return fetch(url, {
		method: 'GET',
		headers: headers
	}).then(res => {
		if (!res.ok) {
			throw { status: res.status };
		}
		return res.text();
	});
};

export const get = async (url: string, JWTtoken?: string) => {
	let headers;
	if (JWTtoken) {
		headers = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${JWTtoken}`
		};
	}

	return fetch(url, {
		method: 'GET',
		headers: headers
	}).then(res => {
		if (!res.ok) {
			throw { status: res.status };
		}
		return res.json();
	});
};

export const put = async (url: string, body: Object, JWTtoken?: string) => {
	let headers: any = {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	};
	if (JWTtoken) {
		headers = {
			...headers,
			Authorization: `Bearer ${JWTtoken}`
		};
	}

	return fetch(url, {
		method: 'PUT',
		body: body ? JSON.stringify(body) : null,
		headers: headers
	}).then(async res => {
		if (!res.ok) {
			throw { status: res.status, data: await res.json() };
		}
		return res.json();
	});
};

export const del = async (url: string) => {
	return fetch(url, { method: 'DELETE' }).then(res => {
		if (!res.ok) {
			throw { status: res.status };
		}

		return res.statusText === 'No Content' ? null : res.json();
	});
};
