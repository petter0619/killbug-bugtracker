const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 50,
		},
		description: {
			type: String,
			maxLength: 500,
		},
		type: {
			type: String,
			enum: ['BUG', 'NEW_FEATURE', 'OTHER'],
			required: true,
			uppercase: true,
		},
		priority: {
			type: String,
			enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
			uppercase: true,
			default: 'LOW',
		},
		status: {
			type: String,
			enum: ['NEW', 'IN_DEVELOPMENT', 'IN_REVIEW', 'COMPLETED', 'READY_FOR_TEST'],
			uppercase: true,
			default: 'NEW',
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Ticket', TicketSchema)
