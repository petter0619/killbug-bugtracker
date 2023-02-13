const express = require('express')
const { userRoles } = require('../../constants/users')
const router = express.Router()
const { getAllUsers, getUserById, deleteUserById } = require('../../controllers/api/userControllers')
const { isAuthenticated, authorizeRoles } = require('../../middleware/authenticationMiddleware')

router.get('/', isAuthenticated, authorizeRoles(userRoles.ADMIN), getAllUsers) // admin only
router.get('/:userId', isAuthenticated, getUserById) // authenticated
router.delete('/:userId', isAuthenticated, deleteUserById) // authenticated (user themselves && admin only)

module.exports = router
