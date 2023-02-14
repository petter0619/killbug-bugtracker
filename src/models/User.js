const mongoose = require('mongoose')
const { userRoles } = require('../constants/users')

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	role: {
		type: String,
		enum: Object.keys(userRoles),
		default: userRoles.USER,
	},
})

module.exports = mongoose.model('User', UserSchema)
