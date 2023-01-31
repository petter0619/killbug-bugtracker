require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Project = require('./models/Project')

/* ------- 1) Skapa våran Express app ------- */
const app = express()

/* ------- 3) Sätt upp våran middleware ------- */
app.use((req, res, next) => {
	console.log(`Processing ${req.method} request to ${req.path}`)
	// when above code executed; go on to next middleware/routing
	next()
})

/* ------- 4) Create our routes ------- */
// CRUD Projects

// GET /api/v1/projects - Get all projects
app.get('/api/v1/projects', async (req, res) => {
	try {
		/* 
      Get only number of projects specified in "limit" query
      parameter. Default limit is 10 (aka unless told otherwise
      only get 10 projects at a time)
    */
		const limit = Number(req.query?.limit || 10)
		/* 
      Skip the number of projects specified in the "offset"
      query parameter according to default project sorting. 
      If no offset given, default is 0 (aka start from the
      beginning)
    */
		const offset = Number(req.query?.offset || 0)

		// Get all projects; filter according to "limit" and "offset" query params
		const projects = await Project.find().limit(limit).skip(offset)
		// Get total number of projects available in database
		const totalProjectsInDatabase = await Project.countDocuments()
		// Create and send our response
		return res.json({
			data: projects, // Send projects result
			meta: {
				// meta information about request
				total: totalProjectsInDatabase, // Total num projects available in db
				limit: limit, // Num of projects asked for
				offset: offset, // Num or projects asked to skip
				count: projects.length, // Num of projects sent back
			},
		})
		// Catch any unforseen errors
	} catch (error) {
		console.error(error)
		// Send the following response if error occurred
		return res.status(500).json({
			message: error.message,
		})
	}
})

// GET /api/v1/projects/:projectId - Get project by id
// POST /api/v1/projects - Create new project
// PUT /api/v1/projects/:projectId - Update project (by id)
// DELETE /api/v1/projects/:projectId - Delete project (by id)

/* ------- 2) Start server ------- */
const port = process.env.PORT || 5000
async function run() {
	try {
		// Connect to MongoDB database (via Mongoose)
		mongoose.set('strictQuery', false)
		const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
		console.log(`MongoDB connected: ${conn.connection.host}`)

		// Start server; listen to requests on port
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`)
		})
	} catch (error) {
		console.error(error)
	}
}

run()
