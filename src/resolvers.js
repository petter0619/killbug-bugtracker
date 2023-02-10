const path = require('path')
const crypto = require('crypto')
const { deleteFile, fileExists, readJsonFile, writeJsonFile } = require('./utils/fileHandling')
const { GraphQLError } = require('graphql')
const { getCartProductData } = require('./utils/carts')

const cartDirectory = path.join(__dirname, 'data', 'carts')
const productDirectory = path.join(__dirname, 'data', 'products')

exports.resolvers = {
	Query: {
		getCartById: async (_, args) => {
			const cartId = args.cartId

			const filePath = path.join(cartDirectory, `${cartId}.json`)

			const fileDoesExist = await fileExists(filePath)
			if (!fileDoesExist) return new GraphQLError('That cart does not exist')

			const cartData = await readJsonFile(filePath)

			cartData.products = await getCartProductData(cartData.products)

			return cartData
		},
		getProductById: async (_, args) => {
			const articleNumber = args.articleNumber

			const filePath = path.join(productDirectory, `${articleNumber}.json`)

			const fileDoesExist = await fileExists(filePath)
			if (!fileDoesExist) return new GraphQLError('That cart does not exist')

			const productData = await readJsonFile(filePath)

			return productData
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
			const { articleNumber, quantity: quantityToAdd } = args.productInput

			if (quantityToAdd <= 0) return new GraphQLError('You must add 1 or more of a product')

			const cartFilePath = path.join(cartDirectory, `${cartId}.json`)
			const productFilePath = path.join(productDirectory, `${articleNumber}.json`)

			const cartDoesExist = await fileExists(cartFilePath)
			if (!cartDoesExist) return new GraphQLError('That cart does not exist')

			const productDoesExist = await fileExists(productFilePath)
			if (!productDoesExist) return new GraphQLError('That product does not exist')

			const cartData = await readJsonFile(cartFilePath)

			const exisingProductIndex = cartData.products.findIndex((prod) => prod.articleNumber === articleNumber)

			if (exisingProductIndex > -1) {
				cartData.products[exisingProductIndex].quantity += quantityToAdd
			} else {
				cartData.products.push({
					articleNumber: articleNumber,
					quantity: quantityToAdd,
				})
			}

			const productData = await readJsonFile(productFilePath)
			cartData.totalAmount += productData.unitPrice * quantityToAdd

			await writeJsonFile(cartFilePath, cartData)

			cartData.products = await getCartProductData(cartData.products)

			return cartData
		},
		removeFromCart: async (_, args) => {
			const cartId = args.cartId
			const { articleNumber, quantity: quantityToRemove } = args.productInput

			const cartFilePath = path.join(cartDirectory, `${cartId}.json`)
			const productFilePath = path.join(productDirectory, `${articleNumber}.json`)

			const cartDoesExist = await fileExists(cartFilePath)
			if (!cartDoesExist) return new GraphQLError('That cart does not exist')

			const cartData = await readJsonFile(cartFilePath)

			if (cartData.products.length === 0) return new GraphQLError('Cart is already empty')

			const productIndex = cartData.products.findIndex((prod) => prod.articleNumber == articleNumber)

			if (productIndex < 0) return new GraphQLError('That product does not exist in cart')

			if (cartData.products[productIndex].quantity > quantityToRemove) {
				cartData.products[productIndex].quantity -= quantityToRemove
			} else {
				cartData.products = cartData.products.filter((prod) => prod.articleNumber !== articleNumber)
			}

			const productData = await readJsonFile(productFilePath)
			cartData.totalAmount -= productData.unitPrice * quantityToRemove

			await writeJsonFile(cartFilePath, cartData)

			cartData.products = await getCartProductData(cartData.products)

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
