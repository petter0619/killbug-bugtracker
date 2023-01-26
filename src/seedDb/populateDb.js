require('dotenv').config()
const mongoose = require('mongoose')
const Project = require('../models/Project')
const Ticket = require('../models/Ticket')
const { mockProjectData } = require('./projects')
const { ticketPriority, ticketStatus, ticketType } = require('../enums/tickets')
const { faker } = require('@faker-js/faker')
const { randomItemFromArray, capitalizeFirstLetter, getRandomBetween } = require('../utils/utils')

const createMockTicket = (projectId) => {
	return {
		project: projectId,
		type: randomItemFromArray(Object.values(ticketType)),
		priority: randomItemFromArray(Object.values(ticketPriority)),
		status: randomItemFromArray(Object.values(ticketStatus)),
		title: `${capitalizeFirstLetter(faker.word.adjective())} ${capitalizeFirstLetter(
			faker.color.human()
		)} ${faker.animal.cat()}`,
		description: capitalizeFirstLetter(faker.lorem.words(getRandomBetween(5, 15))),
	}
}

const populateDbWithMockData = async (connectionString) => {
	try {
		mongoose.set('strictQuery', false) // https://stackoverflow.com/questions/74747476/deprecationwarning-mongoose-the-strictquery-option-will-be-switched-back-to
		const conn = await mongoose.connect(connectionString)
		console.log(`MongoDB connected: ${conn.connection.host}`)

		await Project.deleteMany()
		await Ticket.deleteMany()

		const projectRes = await Project.create(mockProjectData)

		const ticketsToCreate = []
		// @ts-ignore
		projectRes.forEach((project) => {
			for (let i = 0; i < getRandomBetween(1, 4); i++) {
				ticketsToCreate.push(createMockTicket(project.id))
			}
		})

		const ticketRes = await Ticket.create(ticketsToCreate)

		// @ts-ignore
		/* for (const project of projectRes) {
			const tickets = ticketRes.filter((ticket) => project._id.equals(ticket.project)).map((ticket) => ticket._id)

			await Project.findByIdAndUpdate(project._id, {
				tickets: tickets,
			})
		} */

		console.log('Database successfully populated with test data')
	} catch (error) {
		console.error(error)
	} finally {
		process.exit(0)
	}
}

populateDbWithMockData(process.env.MONGO_CONNECTION_STRING)
