const { userRoles } = require('../../constants/users')
const User = require('../../models/User')
const { NotFoundError, UnauthorizedError } = require('../../utils/errors')

exports.getAllUsers = async (req, res) => {
	// prettier-ignore
	const users = await User
    .find()
    .sort({ createdAt: 'desc' })
    .select('-password')

	return res.json(users)
}

exports.getUserById = async (req, res) => {
	// Grab the user id and place in local variable
	const userId = req.params.userId

	// Get the user from the database (NOTE: excluding password)
	const user = await User.findById(userId).select('-password')

	// Not found error (ok since since route is authenticated)
	if (!user) throw new NotFoundError('That user does not exist')

	// Send back user info
	return res.json(user)
}

exports.deleteUserById = async (req, res) => {
	// Grab the user id and place in local variable
	const userId = req.params.userId

	// Check if user is admin || user is requesting to delete themselves
	if (req.user?.role !== userRoles.ADMIN && userId !== req.user?.userId) {
		throw new UnauthorizedError('Unauthorized Access')
	}

	// Get the user from the database
	const user = await User.findById(userId)

	// Not found error (ok since since route is authenticated)
	if (!user) throw new NotFoundError('That user does not exist')

	// Delete the user from the database
	await user.delete()

	// Send back user info
	return res.sendStatus(204)
}
