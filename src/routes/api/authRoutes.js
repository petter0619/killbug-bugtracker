const express = require('express')
const router = express.Router()
const { login, register } = require('../../controllers/api/authControllers')
const { loginSchema, registerSchema } = require('../../middleware/validation/validationSchemas')
const { validate } = require('../../middleware/validation/validationMiddleware')

// const { body } = require('express-validator')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema) /* body('password').isLength({ min: 3 }) */, login)

module.exports = router
