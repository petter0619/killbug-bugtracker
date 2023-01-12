const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, readJsonFile, deleteFile, getDirectoryFileNames } = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const crypto = require('crypto')

const projectDirectory = path.join(__dirname, '..', 'data', 'projects')

exports.resolvers = {
	Query: {
		getProjectById: async (_, args) => {
			const projectId = args.projectId
			// `../data/projects/${projectId}.json`
			const projectFilePath = path.join(projectDirectory, `${projectId}.json`)

			const projectExists = await fileExists(projectFilePath)
			if (!projectExists) return new GraphQLError('That project does not exist')

			const projectData = await fsPromises.readFile(projectFilePath, { encoding: 'utf-8' })
			const data = JSON.parse(projectData)
			return data
		},
		getAllProjects: async (_, args) => {
			const projects = await getDirectoryFileNames(projectDirectory)

			// const projectData = []

			/* for (const file of projects) {
				// console.log(file)
				const filePath = path.join(projectsDirectory, file)
				const fileContents = await fsPromises.readFile(filePath, { encoding: 'utf-8' })
				const data = JSON.parse(fileContents)
				projectData.push(data)
			} */

			const promises = []
			projects.forEach((fileName) => {
				const filePath = path.join(projectDirectory, fileName)
				promises.push(readJsonFile(filePath))
			})

			const projectData = await Promise.all(promises)
			return projectData
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
				description: args.description || ''
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
				description
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
					success: false
				}
			}

			return {
				deletedId: projectId,
				success: true
			}
		},
	},
}
