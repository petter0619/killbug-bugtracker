const Project = require('../models/Project')
const { NotFoundError, BadRequestError } = require('../utils/errors')

exports.getAllProjects = async (req, res, next) => {
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
}

exports.getProjectById = async (req, res, next) => {
	// Get our project id (put in local variable)
	const projectId = req.params.projectId

	// Find project with that id
	const project = await Project.findById(projectId)

	// IF(no project) return 404
	if (!project) throw new NotFoundError('This project does not exist')

	// respond with project data (200 OK)
	return res.json(project)
}

exports.createNewProject = async (req, res, next) => {
	// Get data from req.body and place in local variables
	const name = req.body.name
	const description = req.body.description

	// If (no name || name is empty string) respond bad request
	if (!name) throw new BadRequestError('You must provide a name')

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
}

exports.updateProjectById = async (req, res, next) => {
	// Place project id in local variable
	const projectId = req.params.projectId

	// Place name and description from req.body in local variables
	const { name, description } = req.body

	// If no name && description respond with Bad Request
	if (!name && !description) throw new BadRequestError('You must provide a name or a description to update...')

	// Get project
	const projectToUpdate = await Project.findById(projectId)

	// If (no project) respond with Not Found
	if (!projectToUpdate) throw new NotFoundError('This project does not exist')

	// Update project
	if (name) projectToUpdate.name = name
	if (description) projectToUpdate.description = description
	const updatedProject = await projectToUpdate.save()

	// Craft response (return updated project)
	return res.json(updatedProject)
}

exports.deleteProjectById = async (req, res, next) => {
	// Get project id and place in local variable
	const projectId = req.params.projectId
	// Check if project exists
	const projectToDelete = await Project.findById(projectId)
	// IF (no project) return Not Found
	if (!projectToDelete) throw new NotFoundError('This project does not exist')

	// Delete project
	await projectToDelete.delete()

	// Craft our response
	return res.sendStatus(204)
}
