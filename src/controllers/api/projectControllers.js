const Project = require('../../models/Project')
const { BadRequestError, NotFoundError } = require('../../utils/errors')

exports.getProjects = async (req, res) => {
	const limit = Number(req.query?.limit) || 10
	const offset = Number(req.query?.offset) || 0

	const projects = await Project.find().sort({ createdAt: 'desc' }).skip(offset).limit(limit)
	const totalProjects = await Project.countDocuments()

	return res.json({
		projects: projects,
		meta: {
			total: totalProjects,
			limit: limit,
			offset: offset,
			count: projects.length,
		},
	})
}

exports.getProjectById = async (req, res) => {
	const projectId = req.params.id

	const project = await Project.findById(projectId)
	if (!project) throw new NotFoundError('That project does not exist...')

	return res.json(project)
}

exports.createProject = async (req, res) => {
	const newProjectName = req.body?.name
	const newProjectDescription = req.body?.description || ''

	if (!newProjectName || newProjectName.toString().length === 0) {
		throw new BadRequestError('You must provide a name for your project...')
	}

	const newProject = await Project.create({
		name: newProjectName,
		description: newProjectDescription,
	})

	// prettier-ignore
	return res
		.setHeader('Location', `/api/v1/projects/${newProject._id.toString()}`)
		.status(201)
		.json(newProject)
}

exports.updateProjectById = async (req, res) => {
	const projectId = req.params.id
	const newName = req.body?.name
	const newDescription = req.body?.description

	if (!newName && !newDescription) {
		throw new BadRequestError('You must provide either a new project name or new project description')
	}

	const project = await Project.findById(projectId)
	if (!project) throw new NotFoundError('That project does not exist...')

	// Sending back updated object is a preference but not required
	// NOTE: Good to send back object if server side logic is applied...
	// ...that adds/changes information client does not know the result of.
	/*
		if (newName) project.name = newName
		if (newDescription) project.description = newDescription
		const response = await project.save() // NOTE: Runs validators...
		return res.status(200).json(response)
		*/

	await project.update({ ...req.body }, { runValidators: true })
	return res.sendStatus(204)
}

exports.deleteProjectById = async (req, res) => {
	const projectId = req.params.id

	const projectToDelete = await Project.findById(projectId)
	if (!projectToDelete) throw new NotFoundError('That project does not exist...')

	await projectToDelete.delete()

	return res.sendStatus(204)
}
