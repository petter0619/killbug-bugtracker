require('dotenv').config()
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const apiRoutes = require('./routes/api')
const { errorMiddleware } = require('./middleware/errorMiddleware')
const { notFoundMiddleware } = require('./middleware/notFoundMiddleware')

/* ----------- Create our Expres app ------------ */
const app = express()

/* ---------------------------------------------- */
/* ----------------- Middleware ----------------- */
/* ---------------------------------------------- */
app.use(express.json())

app.use((req, res, next) => {
	console.log(`Processing ${req.method} request to ${req.path}`)
	next()
})

/* ---------------------------------------------- */
/* ------------------- Routes ------------------- */
/* ---------------------------------------------- */
app.use('/api/v1', apiRoutes)

/* ---------------------------------------------- */
/* --------------- Error Handling --------------- */
/* ---------------------------------------------- */
app.use(notFoundMiddleware)
app.use(errorMiddleware)

/* ---------------------------------------------- */
/* ---------------- Server Setup ---------------- */
/* ---------------------------------------------- */
const port = process.env.PORT || 5000
const run = async () => {
	try {
		mongoose.set('strictQuery', false)
		const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
		console.log(`MongoDB connected: ${conn.connection.host}`)

		app.listen(port, () => {
			console.log(`Server is listening on ${process.env.NODE_ENV === 'development' ? 'http://localhost:' : 'port '}${port}`)
		})
	} catch (error) {
		console.error(error)
	}
}

run()
