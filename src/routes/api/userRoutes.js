const express = require('express')
const router = express.Router()
const { getAllUsers, getUserById, deleteUserById } = require('../../controllers/api/userControllers')

router.get('/', getAllUsers) // admin only
router.get('/:userId', getUserById) // authenticated
router.delete('/:userId', deleteUserById) // authenticated (user themselves && admin only)

module.exports = router
