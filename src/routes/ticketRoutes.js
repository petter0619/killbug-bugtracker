const express = require('express')
const router = express.Router()
const { getAllTickets } = require('../controllers/ticketController')

// GET /api/v1/tickets - Get all tickets
router.get(/*Prepended: /api/v1/tickets */ '/', getAllTickets)

module.exports = router
