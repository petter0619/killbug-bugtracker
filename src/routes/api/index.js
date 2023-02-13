const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

module.exports = router
