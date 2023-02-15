const { validationResult } = require('express-validator')
const { ValidationError } = require('../../utils/errors')

exports.validate = (validations) => {
	return async (req, res, next) => {
		await Promise.all(validations.map((validation) => validation.run(req)))

		const results = validationResult(req)
		if (results.isEmpty()) {
			return next()
		}

		return next(new ValidationError('Validation Error', results))

		// res.status(400).json({ errors: results.array() });
	}
}
