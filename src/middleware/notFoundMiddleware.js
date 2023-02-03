const path = require('path')
const { NotFoundError } = require('../utils/errors')

exports.notFoundMiddleware = (req, res) => {
	const isApiPath = req.path.startsWith('/api/')

	if (isApiPath) throw new NotFoundError('That endpoint does not exist')

	return res.status(404).sendFile(path.join(__dirname, '../views/notFound.html'))
}
