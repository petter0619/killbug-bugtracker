const { body } = require('express-validator')

exports.registerSchema = [
	body('username')
		.not()
		.isEmpty()
		.isLength({ min: 3, max: 50 })
		.withMessage('You must provide a username that is at least 3 characters long'),
	body('email').isEmail().withMessage('You must provide a valid email address'),
	body('password')
		.not()
		.isEmpty()
		.isLength({ min: 6 })
		.withMessage('You must provide a password that is at least 6 characters long'),
]

exports.loginSchema = [
	body('email').isEmail().withMessage('You must provide a valid email address'),
	body('password').not().isEmpty().withMessage('You must provide a password'),
]
