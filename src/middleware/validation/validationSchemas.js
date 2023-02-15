const { body } = require('express-validator')

exports.registerSchema = [
	body('email').isEmail().withMessage('You must provide a valid email'),
	body('password')
		.not()
		.isEmpty()
		.isLength({ min: 6 })
		/* .custom((password) => {
			return true
		}) */
		.withMessage('Your desired password must be at least 6 characters long'),
	body('username')
		.not()
		.isEmpty()
		.isLength({ min: 3, max: 50 })
		.withMessage('Your desired username must be between 3 and 50 characters long'),
]

exports.loginSchema = [
	body('email').isEmail().withMessage('You must provide a valid email'),
	body('password').not().isEmpty().withMessage('You must provide a password'),
]
