const express = require('express')
const router = express.Router()
const {
	getAllProjects,
	getProjectById,
	createNewProject,
	updateProjectById,
	deleteProjectById,
} = require('../controllers/projectController')

// Routes
// GET /api/v1/projects - Get all projects
router.get('/', getAllProjects)

// GET /api/v1/projects/:projectId - Get project by id
router.get('/:projectId', getProjectById)

// POST /api/v1/projects - Create new project
router.post('/', createNewProject)

// PUT /api/v1/projects/:projectId - Update project (by id)
router.put('/:projectId', updateProjectById)

// DELETE /api/v1/projects/:projectId - Delete project (by id)
router.delete('/:projectId', deleteProjectById)

module.exports = router
