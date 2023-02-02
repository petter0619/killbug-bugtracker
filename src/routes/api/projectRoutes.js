const express = require('express')
const router = express.Router()
const {
	getProjects,
	createProject,
	getProjectById,
	updateProjectById,
	deleteProjectById,
} = require('../../controllers/api/projectControllers')

// GET /api/v1/projects - Get all projects
router.get('/', getProjects)

// GET /api/v1/projects/:id - Get single project by id
router.get('/:id', getProjectById)

// POST /api/v1/projects - Create new project
router.post('/', createProject)

// PUT /api/v1/projects/:id - Update project (by id)
router.put('/:id', updateProjectById)

// DELETE /api/v1/projects/:id - Delete single project (by id)
router.delete('/:id', deleteProjectById)

module.exports = router
