const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, readJsonFile, deleteFile, getDirectoryFileNames } = require('../utils/fileHandling')
const { GraphQLError, printType } = require('graphql')
const crypto = require('crypto')
const { ticketType, ticketPriority, ticketStatus } = require('../enums/tickets')
const axios = require('axios').default

// Create a variable holding the file path (from computer root directory) to the project fiel directory
const projectDirectory = path.join(__dirname, '..', 'data', 'projects')

exports.resolvers = {
	Query: {
		getProjectById: async (_, args) => {
			// Place the projectId the user sent in a variable called "projectId"
			const projectId = args.projectId
			// Create a variable holding the file path (from computer root directory) to the project
			// file we are looking for
			const projectFilePath = path.join(projectDirectory, `${projectId}.json`)

			// Check if the requested project actually exists
			const projectExists = await fileExists(projectFilePath)
			// If project does not exist return an error notifying the user of this
			if (!projectExists) return new GraphQLError('That project does not exist')

			// Read the project file; data will be returned as a JSON string
			const projectData = await fsPromises.readFile(projectFilePath, { encoding: 'utf-8' })
			// Parse the returned JSON project data into a JS object
			const data = JSON.parse(projectData)
			// Return the data
			return data
		},
		getAllProjects: async (_, args) => {
			// Get an array of file names that exist in the projects directory
			// (aka a list of all the projects we have)
			const projects = await getDirectoryFileNames(projectDirectory)

			// Create a variable with an empty array to hold our project data
			const projectData = []

			// For each file found in projects...
			for (const file of projects) {
				// ... create the filepath for that specific file
				const filePath = path.join(projectDirectory, file)
				// Read the contents of the file; will return a JSON string of the project data
				const fileContents = await fsPromises.readFile(filePath, { encoding: 'utf-8' })
				// Parse the JSON data from the previous step
				const data = JSON.parse(fileContents)
				// Push the parsed data to the projectData array
				projectData.push(data)
			}

			/* const promises = []
			projects.forEach((fileName) => {
				const filePath = path.join(projectDirectory, fileName)
				promises.push(readJsonFile(filePath))
			})

			const projectData = await Promise.all(promises) */

			// Return the projectData array (which should now hold the data for all our projects)
			return projectData
		},
		getAllTickets: async (_) => {
			let tickets = []
			try {
				const response = await axios.get(process.env.SHEETDB_URI)
				if (response.data?.length > 0) {
					tickets = response.data
				}
			} catch (error) {
				console.error(error)
				return new GraphQLError('Ooops... something went wrong!')
			}
			return tickets
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
	},
}
