exports.errorMiddleware = (error, req, res, next) => {
	console.log(error)

	const customErrorResponse = {
		statusCode: error.statusCode || 500,
		message: error.message,
	}

	if (error.name === 'CastError') {
		customErrorResponse.statusCode = 404
		customErrorResponse.message = 'A resource with that id does not exist'
	}

	// prettier-ignore
	return res
		.status(customErrorResponse.statusCode)
		.json(customErrorResponse)
}
