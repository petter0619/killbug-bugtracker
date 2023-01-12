const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, readJsonFile } = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const crypto = require('crypto')

exports.resolvers = {
	Query: {
		getProjectById: async (_, args) => {
			const projectId = args.projectId
			// `../data/projects/${projectId}.json`
			const projectFilePath = path.join(__dirname, `../data/projects/${projectId}.json`)

			const projectExists = await fileExists(projectFilePath)
			if (!projectExists) return new GraphQLError('That project does not exist')

			const projectData = await fsPromises.readFile(projectFilePath, { encoding: 'utf-8' })
			const data = JSON.parse(projectData)
			return data
		},
		getAllProjects: async (_, args) => {
			const projectsDirectory = path.join(__dirname, '../data/projects')

			const projects = await fsPromises.readdir(projectsDirectory)

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
				const filePath = path.join(projectsDirectory, fileName)
				promises.push(readJsonFile(filePath))
			})

			const projectData = await Promise.all(promises)
			return projectData
		},
	},
	Mutation: {
		createProject: async (_, args) => {
			// Verify name
			if (args.name.length === 0) return new GraphQLError('Name must be at least 1 character long')

			// Skapa ett unikt id + data objektet
			const newProject = {
				id: crypto.randomUUID(),
				name: args.name,
				description: args.description || ''
			}

			let filePath = path.join(__dirname, '..', 'data', 'projects', `${newProject.id}.json`)

			let idExists = true
			while (idExists) {
				const exists = await fileExists(filePath)
				console.log(exists, newProject.id)
				if (exists) {
					newProject.id = crypto.randomUUID()
					filePath = path.join(__dirname, '..', 'data', 'projects', `${newProject.id}.json`)
				}
				idExists = exists
			}

			// Skapa en fil för projektet i /data/projects
			await fsPromises.writeFile(filePath, JSON.stringify(newProject))

			// Skapa våran respons
			return newProject
		},
		updateProject: (_, args) => {
			return null
		},
		deleteProject: (_, args) => {
			return null
		},
	},
}
