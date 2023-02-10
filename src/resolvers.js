const path = require('path')
const crypto = require('crypto')
const { deleteFile, fileExists, readJsonFile, writeJsonFile } = require('./utils/fileHandling')
const { GraphQLError } = require('graphql')

const cartDirectory = path.join(__dirname, 'data', 'carts')

exports.resolvers = {
	Query: {
		getCartById: async (_, args) => {
			const cartId = args.cartId

			const filePath = path.join(cartDirectory, `${cartId}.json`)

			const fileDoesExist = await fileExists(filePath)
			if (!fileDoesExist) return new GraphQLError('That cart does not exist')

			const cartData = await readJsonFile(filePath)

			return cartData
		},
	},
	Mutation: {
		createCart: async (_) => {
			const newCart = {
				id: crypto.randomUUID(),
				totalAmount: 0,
				products: [],
			}

			const filePath = path.join(cartDirectory, `${newCart.id}.json`)

			await writeJsonFile(filePath, newCart)

			return newCart
		},
		addToCart: async (_, args) => {
			const cartId = args.cartId
			const productToAdd = args.product

			const filePath = path.join(cartDirectory, `${cartId}.json`)

			const fileDoesExist = await fileExists(filePath)
			if (!fileDoesExist) return new GraphQLError('That cart does not exist')

			const cartData = await readJsonFile(filePath)

			cartData.products.push(productToAdd)
			cartData.totalAmount += productToAdd.price

			await writeJsonFile(filePath, cartData)

			return cartData
		},
		removeFromCart: async (_, args) => {
			const cartId = args.cartId
			const productToRemove = args.product

			const filePath = path.join(cartDirectory, `${cartId}.json`)

			const fileDoesExist = await fileExists(filePath)
			if (!fileDoesExist) return new GraphQLError('That cart does not exist')

			const cartData = await readJsonFile(filePath)

			if (cartData.products.length === 0) return new GraphQLError('Cart is already empty')

			const prodToRemoveExists = cartData.products.some((prod) => {
				// prettier-ignore
				return prod.id === productToRemove.id 
          && prod.name === productToRemove.name 
          && prod.price === productToRemove.price
			})

			if (!prodToRemoveExists) return new GraphQLError('That product does not exist on this cart')

			const newProductsArray = cartData.products.filter((prod) => {
				// prettier-ignore
				const isProdToRemove = prod.id === productToRemove.id 
          && prod.name === productToRemove.name 
          && prod.price === productToRemove.price

				return !isProdToRemove
			})

			const productsRemovedCount = cartData.products.length - newProductsArray.length

			cartData.products = newProductsArray
			cartData.totalAmount -= productToRemove.price * productsRemovedCount

			await writeJsonFile(filePath, cartData)

			return cartData
		},
		deleteCart: async (_, args) => {
			const cartId = args.cartId

			const filePath = path.join(cartDirectory, `${cartId}.json`)

			const fileDoesExist = await fileExists(filePath)
			if (!fileDoesExist) return new GraphQLError('That cart does not exist')

			try {
				await deleteFile(filePath)

				return {
					success: true,
					deletedResourceId: cartId,
				}
			} catch (error) {
				console.error(error)
				return {
					success: false,
					deletedResourceId: cartId,
				}
			}
		},
	},
}
