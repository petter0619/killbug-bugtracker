const mongoose = require('mongoose')
const { ticketPriority, ticketStatus, ticketType } = require('../../enums/tickets')

const TicketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			maxlength: 100,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
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
			default: ticketPriority.LOW,
			uppercase: true,
		},
		status: {
			type: String,
			enum: Object.values(ticketStatus),
			default: ticketStatus.NEW,
			uppercase: true,
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Ticket', TicketSchema)
