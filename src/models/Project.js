const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    description: {
      type: String,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Project', ProjectSchema)
