const express = require('express')
const router = express.Router()
const {
	getAllProjects,
	getProjectById,
	createNewProject,
	updateProjectById,
	deleteProjectById,
} = require('../controllers/projectController')
const { catchErrors } = require('../utils/errors')

// Routes
// GET /api/v1/projects - Get all projects
router.get('/', catchErrors(getAllProjects))

// GET /api/v1/projects/:projectId - Get project by id
router.get('/:projectId', catchErrors(getProjectById))

// POST /api/v1/projects - Create new project
router.post('/', catchErrors(createNewProject))

// PUT /api/v1/projects/:projectId - Update project (by id)
router.put('/:projectId', catchErrors(updateProjectById))

// DELETE /api/v1/projects/:projectId - Delete project (by id)
router.delete('/:projectId', catchErrors(deleteProjectById))

module.exports = router
