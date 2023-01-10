let msg = 'Hello world'

exports.resolvers = {
	Query: {
		helloQuery: (_, args) => {
			return msg
		},
	},
	Mutation: {
		helloMutation: (_, args) => {
			msg = args.message
			return msg
		},
	},
}
