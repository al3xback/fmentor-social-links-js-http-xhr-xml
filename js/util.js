const sendHttpRequest = (method, url, cb) => {
	const xhr = new XMLHttpRequest();

	xhr.open(method, url);

	xhr.onload = function () {
		cb(xhr.responseText);
	};

	xhr.send();
};

export { sendHttpRequest };
