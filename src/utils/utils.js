// Get a random number between X and Y
const getRandomBetween = (min, max, randomNumber = Math.random()) => {
	return Math.floor(randomNumber * (max - min) + min)
}

// Return a random item from an array
const randomItemFromArray = (arr, not) => {
	const item = arr[Math.floor(Math.random() * arr.length)]
	if (item === not) {
		console.log('----- Used that one last time. Look again. -----')
		return randomItemFromArray(arr, not) // Recursion
	}
	return item
}

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
	randomItemFromArray,
	getRandomBetween,
	capitalizeFirstLetter,
}
