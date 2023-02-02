exports.catchErrors = (fn) => {
	return function (req, res, next) {
		return fn(req, res, next).catch(next)
	}
}

class CustomAPIError extends Error {
	constructor(message) {
		super(message)
	}
}

class NotFoundError extends CustomAPIError {
	constructor(message) {
		super(message)
		this.statusCode = 404
		this.name = 'NotFound'
	}
}

class BadRequestError extends CustomAPIError {
	constructor(message) {
		super(message)
		this.statusCode = 400
		this.name = 'BadRequest'
	}
}

module.exports = {
	CustomAPIError,
	NotFoundError,
	BadRequestError,
}
