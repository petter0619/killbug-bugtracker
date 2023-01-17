// Enables Node to be able to read our .env variables
require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { resolvers } = require('./resolvers')
const { loadFiles } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const path = require('path')
// const { startStandaloneServer } = require('@apollo/server/standalone')
const { expressMiddleware } = require('@apollo/server/express4')
const express = require('express')

const app = express()

app.use(express.json())

const port = process.env.PORT || 5000
async function run() {
	try {
		// Loads our schema.graphql file and reformats it for use in the next step
		const typeDefs = await loadFiles(path.join(__dirname, 'schema.graphql'))
		// Creates a schema from our typeDefs (see step above) and our resolvers
		const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers })
		// Creates a GraphQL server from our schema
		const server = new ApolloServer({ schema: schema })
		// Starts the server in
		// const res = await startStandaloneServer(server)
		// console.log(`🚀 Server ready at ${res.url}`)
		await server.start()

		app.use('/graphql', expressMiddleware(server))

		app.listen(port, () => {
			console.log(`🚀 Server ready at http://localhost:5000`)
		})
	} catch (error) {
		console.error(error)
	}
}

run()
