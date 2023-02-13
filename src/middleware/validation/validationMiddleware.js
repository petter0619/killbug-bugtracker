const { validationResult } = require('express-validator')
const { ValidationError } = require('../../utils/errors')

exports.validate = (schemas) => {
	return async (req, res, next) => {
		await Promise.all(schemas.map((schema) => schema.run(req)))

		const result = validationResult(req)
		if (result.isEmpty()) {
			return next()
		}

		const errors = result.array()
		const error = new ValidationError('Validation error', errors)
		return next(error)
	}
}
