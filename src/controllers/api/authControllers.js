const { BadRequestError, UnauthenticatedError } = require('../../utils/errors')
const bcrypt = require('bcrypt')
const User = require('../../models/User')
const { userRoles } = require('../../constants/users')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
	// Place desired username, email and password into local variables
	const { username, password, email } = req.body

	// Validate that the needed information was sent in
	if (!username || !password || !email) {
		throw new BadRequestError('You must provide a username, email and password in order to register')
	}

	// Encrypt the desired password
	const salt = await bcrypt.genSalt(10)
	const hashedpassword = await bcrypt.hash(password, salt)

	const newUser = {
		username,
		email,
		password: hashedpassword,
	}

	// If first user ever make them an admin (for demo purposes)
	const usersInDb = await User.countDocuments()
	if (usersInDb === 0) newUser.role = userRoles.ADMIN

	// Add the new user to database
	await User.create(newUser)

	// Request response
	return res.status(201).json({
		message: 'Registration succeeded. Please log in.',
	})
}

exports.login = async (req, res) => {
	// Place candidate email and password into local variables
	const { email, password: canditatePassword } = req.body

	// Validate that the needed information was sent in
	if (!email || !canditatePassword) {
		throw new BadRequestError('You must provide an email and password in order to log in')
	}

	// Check if user with that email exits in db
	const user = await User.findOne({ email: email })
	if (!user) throw new UnauthenticatedError('Invalid Credentials')

	// Check if password is corrrect
	const isPasswordCorrect = await bcrypt.compare(canditatePassword, user.password)
	if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')

	// Create JWT payload (aka JWT contents)
	const jwtPayload = {
		userId: user._id,
		role: user.role,
		username: user.username,
	}

	// Create the JWT token
	const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1d' /* 2h */ })

	// Return the token
	return res.json({ token: jwtToken, user: jwtPayload })
}
