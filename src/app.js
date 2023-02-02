require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const projectRoutes = require('./routes/projectRoutes')

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

app.use('/api/v1/projects', projectRoutes)
// app.use('/api/v1/tickets', ticketRoutes)

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
