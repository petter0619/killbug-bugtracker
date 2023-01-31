require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Project = require('./models/Project')

/* ------- 1) Skapa våran Express app ------- */
const app = express()

/* ------- 3) Sätt upp våran middleware ------- */
// Parse JSON on request body and place on req.body
app.use(express.json())

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
app.get('/api/v1/projects/:projectId', async (req, res) => {
	// Big outer try-catch
	try {
		// Get our project id (put in local variable)
		const projectId = req.params.projectId

		// Find project with that id
		const project = await Project.findById(projectId)

		// IF(no project) return 404
		if (!project) return res.sendStatus(404)

		// respond with project data (200 OK)
		return res.json(project)
	} catch (error) {
		console.error(error)
		// Send the following response if error occurred
		return res.status(500).json({
			message: error.message,
		})
	}
})

// POST /api/v1/projects - Create new project
app.post('/api/v1/projects', async (req, res) => {
	try {
		// Get data from req.body and place in local variables
		const name = req.body.name || ''
		const description = req.body.description || ''

		// If (no name || name is empty string) respond bad request
		if (!name) {
			return res.status(400).json({
				message: 'You must provide a project name',
			})
		}

		// Create project
		const newProject = await Project.create({
			name: name,
			description: description,
		})

		// Respond
		// prettier-ignore
		return res
      // Add Location header to response
      // Location header = URI pointing to endpoint where user can get new project
      .setHeader(
        'Location', 
        `http://localhost:${process.env.PORT}/api/v1/projects/${newProject._id}`
      )
      .status(201)
      .json(newProject)
	} catch (error) {
		console.error(error)
		// Send the following response if error occurred
		return res.status(500).json({
			message: error.message,
		})
	}
})

// PUT /api/v1/projects/:projectId - Update project (by id)
// DELETE /api/v1/projects/:projectId - Delete project (by id)
app.delete('/api/v1/projects/:projectId', async (req, res) => {
	try {
		// Get project id and place in local variable
		const projectId = req.params.projectId
		// Check if project exists
		const projectToDelete = await Project.findById(projectId)
		// IF (no project) return Not Found
		if (!projectToDelete) return res.sendStatus(404)

		// Delete project
		await projectToDelete.delete()

		// Craft our response
		return res.sendStatus(204)
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			message: error.message,
		})
	}
})

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
