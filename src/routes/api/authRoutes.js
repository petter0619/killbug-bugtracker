const express = require('express')
const router = express.Router()
const { login, register } = require('../../controllers/api/authControllers')
const { loginSchema, registerSchema } = require('../../middleware/validation/validationSchemas')
const { validate } = require('../../middleware/validation/validationMiddleware')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

module.exports = router
