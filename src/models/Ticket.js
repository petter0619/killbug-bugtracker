const mongoose = require('mongoose')
const { ticketType, ticketPriority, ticketStatus } = require('../constants/tickets')

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
			enum: Object.values(ticketType),
			required: true,
			uppercase: true,
		},
		priority: {
			type: String,
			enum: Object.values(ticketPriority),
			uppercase: true,
			default: ticketPriority.LOW,
		},
		status: {
			type: String,
			enum: Object.values(ticketStatus),
			uppercase: true,
			default: ticketStatus.NEW,
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
