const path = require('path')

exports.notFoundMiddleware = (req, res) => {
	const isApiPath = req.path.startsWith('/api/')

	if (isApiPath) return res.sendStatus(404)

	return res.status(404).sendFile(path.join(__dirname, './views/notFound.html'))
}
