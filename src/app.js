require('dotenv').config()
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const apiRoutes = require('./routes/api')
const { errorMiddleware } = require('./middleware/errorMiddleware')
const { notFoundMiddleware } = require('./middleware/notFoundMiddleware')
// Security imports
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const { rateLimit } = require('express-rate-limit')
const { default: helmet } = require('helmet')
const path = require('path')

/* ----------- Create our Expres app ------------ */
const app = express()
app.use(express.static(path.join(__dirname, 'public')))

/* ---------------------------------------------- */
/* ----------------- Middleware ----------------- */
/* ---------------------------------------------- */
app.use(express.json())

app.use((req, res, next) => {
	console.log(`Processing ${req.method} request to ${req.path}`)
	next()
})

/* ---------------------------------------------- */
/* ------------ Security Middleware ------------- */
/* ---------------------------------------------- */
app.use(
	cors(/* {
		origin: ['https://www.citygross.se', 'https://www.example.com'],
		methods: ['GET'],
	} */)
)
app.use(xss())
app.use(mongoSanitize())
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minuter
		max: 60,
	})
)
app.use(
	helmet(/* {
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
	} */)
)

/* ---------------------------------------------- */
/* ------------------- Routes ------------------- */
/* ---------------------------------------------- */
app.use('/api/v1', apiRoutes)

app.use('/test/:param', (req, res) => {
	return res.json({
		body: req.body,
		queryStrings: req.query,
	})
})

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
