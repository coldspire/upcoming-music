export default class JsonResponse extends Response {
	constructor(body, init) {
		const jsonBody = JSON.stringify(body);
		init = init || {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
		};

		super(jsonBody, init);
	}
}
