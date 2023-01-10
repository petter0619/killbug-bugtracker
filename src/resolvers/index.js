const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists } = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')

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
		getAllProjects: (_, args) => {
			return null
		},
	},
	Mutation: {
		createProject: (_, args) => {
			return null
		},
		updateProject: (_, args) => {
			return null
		},
		deleteProject: (_, args) => {
			return null
		},
	},
}
