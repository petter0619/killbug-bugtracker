const express = require('express')
const router = express.Router()
const {
	getTickets,
	createTicket,
	getTicketById,
	updateTicketById,
	deleteTicketById,
} = require('../../controllers/api/ticketControllers')

// GET /api/v1/tickets - Get all tickets
router.get('/', getTickets)

// GET /api/v1/tickets/:id - Get single ticket by id
router.get('/:id', getTicketById)

// POST /api/v1/tickets - Create new ticket
router.post('/', createTicket)

// PUT /api/v1/tickets/:id - Update ticket (by id)
router.put('/:id', updateTicketById)

// DELETE /api/v1/tickets/:id - Delete single ticket (by id)
router.delete('/:id', deleteTicketById)

module.exports = router
