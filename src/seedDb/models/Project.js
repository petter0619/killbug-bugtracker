const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 100,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		/* tickets: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Ticket',
		}, */
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Project', ProjectSchema)
