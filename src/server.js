require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { resolvers } = require('./resolvers')
const { loadFiles } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const path = require('path')
const { startStandaloneServer } = require('@apollo/server/standalone')

async function run() {
	try {
		const typeDefs = await loadFiles(path.join(__dirname, 'schema.graphql'))
		const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers })
		const server = new ApolloServer({ schema: schema })
		const res = await startStandaloneServer(server)
		console.log(`🚀 Server ready at ${res.url}`)
	} catch (error) {
		console.error(error)
	}
}

run()
