const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, readJsonFile, deleteFile, getDirectoryFileNames } = require('../utils/fileHandling')
const { GraphQLError, printType } = require('graphql')
const crypto = require('crypto')
const { ticketType, ticketPriority, ticketStatus } = require('../enums/tickets')
const axios = require('axios').default

const Project = require('../models/Project')
const Ticket = require('../models/Ticket')

// Create a variable holding the file path (from computer root directory) to the project fiel directory
const projectDirectory = path.join(__dirname, '..', 'data', 'projects')

exports.resolvers = {
	Query: {
		getProjectById: async (_, args) => {
			const project = await Project.findById(args.projectId)
			return project
		},
		getAllProjects: async (_, args) => {
			const take = args.take || 0
			const skip = args.skip || 0
			const projectData = await Project.find().limit(take).skip(skip)
			return projectData
		},
		getAllTickets: async (_, args) => {
			const take = args.take || 0
			const skip = args.skip || 0

			const { projectId, type, status, priority } = args.filters
			const filters = {}

			if (projectId) filters.project = projectId
			if (type) filters.type = type
			if (status) filters.status = status
			if (priority) filters.priority = priority

			const tickets = await Ticket.find(filters).limit(take).skip(skip)
			return tickets
		},
		getTicketById: async (_, args) => {
			const ticket = await Ticket.findById(args.ticketId)
			return ticket
		},
	},
	Mutation: {
		createProject: async (_, args) => {
			// Verify name: om strängen är tom, return:a en error
			if (args.name.length === 0) return new GraphQLError('Name must be at least 1 character long')

			// Skapa ett unikt id + data objektet
			const newProject = {
				// Generera ett random id (av typ UUID)
				id: crypto.randomUUID(),
				name: args.name,
				description: args.description || '',
			}

			// Skapa filePath för där vi ska skapa våran fil
			let filePath = path.join(projectDirectory, `${newProject.id}.json`)

			// Kolla att vårat auto-genererade projektid inte har använts förut
			let idExists = true
			while (idExists) {
				const exists = await fileExists(filePath) // kolla om filen existerar
				console.log(exists, newProject.id)
				// om filen redan existerar generera ett nytt projektId och uppdatera filePath
				if (exists) {
					newProject.id = crypto.randomUUID()
					filePath = path.join(projectDirectory, `${newProject.id}.json`)
				}
				// uppdatera idExists (för att undvika infinite loops)
				idExists = exists
			}

			// Skapa en fil för projektet i /data/projects
			await fsPromises.writeFile(filePath, JSON.stringify(newProject))

			// Return:a våran respons; vårat nyskapade projekt
			return newProject
		},
		updateProject: async (_, args) => {
			// Hämta alla parametrar från args
			/* const projectId = args.id
			const projectName = args.name
			const projectDescription = args.description */

			const { id, name, description } = args

			// Skapa våran filePath
			const filePath = path.join(projectDirectory, `${id}.json`)

			// Finns det projekt som de vill ändra?
			// IF (no) return Not Found Error
			const projectExists = await fileExists(filePath)
			if (!projectExists) return new GraphQLError('That project does not exist')

			// Skapa updatedProject objekt
			const updatedProject = {
				id,
				name,
				description,
			}

			// Skriv över den gamla filen med nya infon
			await fsPromises.writeFile(filePath, JSON.stringify(updatedProject))

			// return updatedProject
			return updatedProject
		},
		deleteProject: async (_, args) => {
			// get project id
			const projectId = args.projectId

			const filePath = path.join(projectDirectory, `${projectId}.json`)
			// does this project exist?
			// If no (return error)
			const projectExists = await fileExists(filePath)
			if (!projectExists) return new GraphQLError('That project does not exist')

			// delete file
			try {
				await deleteFile(filePath)
			} catch (error) {
				return {
					deletedId: projectId,
					success: false,
				}
			}

			return {
				deletedId: projectId,
				success: true,
			}
		},
		createTicket: async (_, args) => {
			// Destructure input variables
			const { title, description, type, priority, projectId } = args.input

			// Skapa filePath till prjektet
			const filePath = path.join(projectDirectory, `${projectId}.json`)

			// Finns projektet som de vill skapa en ticket för?
			// IF (no) return Error
			const projectExists = await fileExists(filePath)
			if (!projectExists) return new GraphQLError('That project does not exist')

			// Skapa ett JS objekt som motsvarar hur vi vill att
			// datan ska läggas in i vårt Sheet
			// + generate random ID för våran Ticket
			const newTicket = {
				id: crypto.randomUUID(),
				title,
				description: description || '',
				type,
				priority: priority || ticketPriority.LOW,
				status: ticketStatus.NEW,
				projectId,
			}

			// POST request till SheetDB API:et = Lägga till en rad för
			// denna ticket i vårat sheet
			try {
				const endpoint = process.env.SHEETDB_URI
				const response = await axios.post(
					endpoint,
					{
						data: [newTicket],
					},
					{
						headers: {
							'Accept-Encoding': 'gzip,deflate,compress',
						},
					}
				)
			} catch (error) {
				console.error(error)
				return new GraphQLError('Could not create the ticket...')
			}

			// IF (success) return JS objekt som mostvarar våran Ticket type i schemat
			return newTicket
		},
		deleteTicket: async (_, args) => {
			const ticketId = args.ticketId

			try {
				const endpoint = `${process.env.SHEETDB_URI}/id/${ticketId}`

				const response = await axios.delete(endpoint)

				return {
					deletedId: ticketId,
					success: true,
				}
			} catch (error) {
				console.error(error)
				return {
					deletedId: ticketId,
					success: false,
				}
			}
		},
		updateTicket: async (_, args) => {
			return null
		},
	},
}
