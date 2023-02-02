const express = require('express')
const router = express.Router()

const projectRoutes = require('./projectRoutes')
const ticketRoutes = require('./ticketRoutes')

router.use('/projects', projectRoutes)
router.use('/tickets', ticketRoutes)

module.exports = router
