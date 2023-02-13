exports.errorMiddleware = (error, req, res, next) => {
	let customError = {
		statusCode: error.statusCode || 500,
		message: error.message || 'Something went wrong try again later',
	}

	if (process.env.NODE_ENV === 'development') {
		console.error(error)

		customError.message = error.message || 'No error message...'
		customError.error = error
	}

	if (error.name === 'ValidationError') {
		customError.validatonErrors = Object.values(error.errors).map((item) => item.message)

		customError.statusCode = 400
	}

	// Reformats Mongoose error when a duplicate value is entered for a...
	// ...field that has the "unique: true" validation
	// prettier-ignore
	if (error.code && error.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }

	if (error.name === 'CastError') {
		customError.message = `No item found with id : ${error.value}`
		customError.statusCode = 404
	}

	return res.status(customError.statusCode).json(customError)
}
