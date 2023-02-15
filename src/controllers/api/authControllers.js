const { BadRequestError, UnauthenticatedError } = require('../../utils/errors')
const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { userRoles } = require('../../constants/users')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
	// Placera inskickad data (epost, lösenord, username) i lokala variabler
	const { email, password, username } = req.body

	// Kryptera lösenordet med bcrypt
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	const newUser = {
		username,
		email,
		password: hashedPassword,
	}

	// ADMIN logic: If (firstUser in db) makeAdmin
	const usersInDb = await User.countDocuments()
	if (usersInDb === 0) newUser.role = userRoles.ADMIN

	// Add new user to db
	await User.create(newUser)

	// Send response
	return res.status(201).json({
		message: 'Registration successful. Please log in.',
	})
}

exports.login = async (req, res) => {
	// Placera inskickad data (epost, lösenord) i lokala variabler
	const { email, password: candidatePassword } = req.body

	// Kolla om användarens epost finns
	const user = await User.findOne({ email: email })
	if (!user) {
		throw new UnauthenticatedError('Invalid credentials')
	}

	// Kolla om lösenordet är korrekt
	const isPasswordCorrect = await bcrypt.compare(candidatePassword, user.password)
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid credentials')
	}

	// Skapa våran JWT token
	const jwtPayload = {
		userId: user._id,
		role: user.role,
		username: user.username,
	}

	const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
		expiresIn: /* '1d' */ '2h',
	})

	// Response
	return res.json({
		token: token,
		user: jwtPayload,
	})
}
