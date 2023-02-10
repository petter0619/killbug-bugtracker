const { readJsonFile } = require('./fileHandling')
const path = require('path')

const productDirectory = path.join(__dirname, '..', 'data', 'products')

exports.getCartProductData = async (cartDataProducts = []) => {
	const promises = []
	for (const prod of cartDataProducts) {
		promises.push(readJsonFile(path.join(productDirectory, `${prod.articleNumber}.json`)))
	}

	const missingProductData = await Promise.all(promises)

	missingProductData.forEach((missingProd) => {
		const index = cartDataProducts.findIndex((prod) => missingProd.articleNumber === prod.articleNumber)
		if (index > -1) {
			cartDataProducts[index].name = missingProd.name
			cartDataProducts[index].unitPrice = missingProd.unitPrice
		}
	})

	return cartDataProducts
}
