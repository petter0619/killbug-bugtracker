const { UnauthenticatedError, UnauthorizedError } = require('../utils/errors')
const jwt = require('jsonwebtoken')

exports.isAuthenticated = async (req, res, next) => {
	let token

	// Grab authentication header
	const authHeader = req.headers.authorization

	if (authHeader && authHeader.startsWith('Bearer')) {
		token = authHeader.split(' ')[1]
	}

	// IF (!token) UnauthenticatedError
	if (!token) {
		throw new UnauthenticatedError('Authentication invalid')
	}

	try {
		// Get token payload && verify token
		const payload = jwt.verify(token, process.env.JWT_SECRET)

		// Add a req.user field to request object
		req.user = {
			// @ts-ignore
			userId: payload.userId,
			// @ts-ignore
			role: payload.role,
			// @ts-ignore
			username: payload.username,
		}

		// Go to next step
		next()
	} catch (error) {
		// If token not valid (or something else goes wrong) authentication = invalid
		throw new UnauthenticatedError('Authentication invalid')
	}
}

// NOTE: Must be placed AFTER isAuthenticated middleware
exports.authorizeRoles = (...roles) => {
	// Return proper middleware function
	return (req, res, next) => {
		// Check that user has needed role
		if (!req.user?.role || !roles.includes(req.user.role)) {
			throw new UnauthorizedError('Aunauthorized Access')
		}
		next()
	}
}
