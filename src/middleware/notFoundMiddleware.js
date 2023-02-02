const path = require('path')
const { NotFoundError } = require('../utils/errors')

exports.notFoundMiddleware = (req, res, next) => {
	const isApiPath = req.path && req.path.startsWith('/api/')

	if (isApiPath) {
		next(new NotFoundError('This endpoint does not exist...'))
	} else {
		return res.sendFile(path.join(__dirname, '..', 'views', 'notFound.html'))
	}
}

// exports.notFound = (req, res) => res.status(404).send('Route does not exist')
