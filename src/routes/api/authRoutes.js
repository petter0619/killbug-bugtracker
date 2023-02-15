const express = require('express')
const router = express.Router()
const { login, register } = require('../../controllers/api/authControllers')
const { validate } = require('../../middleware/validation/validationMiddleware')
const { registerSchema, loginSchema } = require('../../middleware/validation/validationSchemas')

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), register)

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login)

module.exports = router
