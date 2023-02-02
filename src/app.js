require('dotenv').config()
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const projectRoutes = require('./routes/projectRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const path = require('path')

/* ------- 1) Skapa våran Express app ------- */
const app = express()

/* ------- 3) Sätt upp våran middleware ------- */
// Parse JSON on request body and place on req.body
app.use(express.json())

app.use((req, res, next) => {
	console.log(`Processing ${req.method} request to ${req.path}`)
	// when above code executed; go on to next middleware/routing
	next()
})

/* ------- 4) Create our routes ------- */

app.use('/api/v1/projects' /* /... = see Router => */, projectRoutes)
app.use('/api/v1/tickets' /* /... = see Router => */, ticketRoutes)

/* ------- 5) Post route middleware ------- */
// Not found middleware
app.use((req, res) => {
	const isApiPath = req.path.startsWith('/api/')

	if (isApiPath) return res.sendStatus(404)

	return res.status(404).sendFile(path.join(__dirname, './views/notFound.html'))
})

// Error middleware
app.use((error, req, res, next) => {
	console.log(error)
	return res.json({ error: error.message })
})

/* ------- 2) Start server ------- */
const port = process.env.PORT || 5000
async function run() {
	try {
		// Connect to MongoDB database (via Mongoose)
		mongoose.set('strictQuery', false)
		const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
		console.log(`MongoDB connected: ${conn.connection.host}`)

		// Start server; listen to requests on port
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`)
		})
	} catch (error) {
		console.error(error)
	}
}

run()
