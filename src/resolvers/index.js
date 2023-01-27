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

			const projectTickets = await Ticket.find({
				project: project._id,
			})

			const returnProject = {
				id: project._id,
				name: project.name,
				description: project.description,
				tickets: projectTickets,
			}

			return returnProject
		},
		getAllProjects: async (_, args) => {
			const take = args.take || 0
			const skip = args.skip || 0
			const projects = await Project.find().limit(take).skip(skip)

			const projectIds = projects.map((project) => project._id)

			const tickets = await Ticket.find({
				project: { $in: projectIds },
			})

			const projectData = projects.map((project) => {
				return {
					id: project._id,
					name: project.name,
					description: project.description,
					tickets: tickets.filter((ticket) => ticket.project.equals(project._id)),
				}
			})

			return projectData
		},
		getAllTickets: async (_, args) => {
			const take = args.take || 0
			const skip = args.skip || 0

			const filters = {}

			if (args.filters?.projectId) filters.project = args.filters.projectId
			if (args.filters?.type) filters.type = args.filters.type
			if (args.filters?.status) filters.status = args.filters.status
			if (args.filters?.priority) filters.priority = args.filters.priority

			const tickets = await Ticket.find(filters).limit(take).skip(skip).populate('project')
			return tickets
		},
		getTicketById: async (_, args) => {
			const ticket = await Ticket.findById(args.ticketId).populate('project')
			return ticket
		},
	},
	Mutation: {
		createProject: async (_, args) => {
			const newProject = await Project.create({ ...args })
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
			const deletedProject = await Project.findByIdAndDelete(args.projectId)
			if (!deletedProject) return new GraphQLError('That project does not exist')

			return {
				deletedId: deletedProject._id,
				success: true,
			}
		},
		createTicket: async (_, args) => {
			// const { title, description, type, priority, projectId } = args.input
			const { projectId } = args.input

			const project = await Project.findById(projectId)
			if (!project) return new GraphQLError('That project does not exist')

			/* 
			const newTicket = await Ticket.create({
				title,
				description,
				type,
				priority,
				project: projectId,
			}) 
			*/

			/* 
			const ticketData = { ...args.input }
			delete ticketData.projectId
			ticketData.project = projectId
			const newTicket = await Ticket.create(ticketData)
			*/

			const newTicket = await Ticket.create({
				...args.input,
				project: projectId,
			})

			return await newTicket.populate('project')
		},
		deleteTicket: async (_, args) => {
			const ticketId = args.ticketId

			const deletedTicket = await Ticket.findByIdAndDelete(ticketId)

			return {
				deletedId: ticketId,
				success: Boolean(deletedTicket),
			}
		},
		updateTicket: async (_, args) => {
			const updatedTicket = await Ticket.findByIdAndUpdate(args.ticketId, args.input, { new: true })

			if (!updatedTicket) return new GraphQLError('That ticket does not exist...')

			return await updatedTicket.populate('project')
		},
	},
}
