const menuBtn = document.querySelector('.menu-btn')
const hamburger = document.querySelector('.menu-btn__burger')
const nav = document.querySelector('nav')
let showMenu = false

function toggleMenu() {
	if (!showMenu) {
		hamburger.classList.add('open')
		nav.style.transition = 'all 0.3s ease-in-out'
		nav.classList.add('open')

		showMenu = true
	} else {
		hamburger.classList.remove('open')
		nav.classList.remove('open')

		setTimeout(function () {
			nav.style.transition = ''
		}, 300)

		showMenu = false
	}
}

menuBtn.addEventListener('click', toggleMenu)

const accordionBtn = document.querySelectorAll('.accordion__btn')

function toggleAccordion(element) {
	//element.previousElementSibling.lastElementChild
	if (element.style.maxHeight) {
		element.style.maxHeight = null

		element.previousElementSibling.lastElementChild.classList.remove('fa-chevron-up')
		element.previousElementSibling.lastElementChild.classList.add('fa-chevron-down')
	} else {
		//element.style.maxHeight = element.scrollHeight + "px";
		element.style.maxHeight = '100%'

		element.previousElementSibling.lastElementChild.classList.remove('fa-chevron-down')
		element.previousElementSibling.lastElementChild.classList.add('fa-chevron-up')
	}
}

accordionBtn.forEach((btn) => {
	btn.addEventListener('click', function (e) {
		toggleAccordion(this.parentElement.nextElementSibling)
		//this.parentElement.nextElementSibling
	})
	toggleAccordion(btn.parentElement.nextElementSibling)
})

/* ------------------------------------------------------------------------------
------------------------------ MOCK DATA ----------------------------------------
------------------------------------------------------------------------------ */

function getRandomBetween(min, max, randomNumber = Math.random()) {
	return Math.floor(randomNumber * (max - min) + min)
}

function randomItemFromArray(arr, not) {
	const item = arr[Math.floor(Math.random() * arr.length)]
	if (item === not) {
		console.log('----- Used that one last time. Look again. -----')
		return randomItemFromArray(arr, not) // Recursion
	}
	return item
}

function makeExampleId(length) {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

function randomDate(year) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return `${randomItemFromArray(months)} ${getRandomBetween(1, 28)}, ${year}`
}

function generateLorem(length, type = 'characters') {
	const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id ligula elementum, rutrum turpis a, facilisis quam. Mauris egestas nisl erat, sit amet bibendum sem ullamcorper id. Mauris in felis elementum, venenatis quam eget, posuere lorem. Sed gravida est augue, vel aliquet lectus hendrerit sit amet. Phasellus ut augue in ante hendrerit pharetra id at augue. Donec volutpat nunc a neque pulvinar, sit amet placerat sapien elementum. Pellentesque vehicula sollicitudin ipsum non vehicula. Integer vehicula pellentesque risus, eu tincidunt tellus accumsan et. Duis ac libero at augue facilisis efficitur nec sed urna. Donec at neque felis. Maecenas leo ipsum, fringilla id mauris in, fringilla vestibulum nisl.
      Praesent sed orci vitae sem interdum viverra. Quisque sed sapien vitae turpis pulvinar lobortis non vulputate eros. Fusce ultricies, justo porta posuere mollis, purus sem aliquam turpis, vitae tristique enim sem ac velit. Aliquam nec cursus purus. Suspendisse consectetur mattis facilisis. Phasellus hendrerit mattis consectetur. Curabitur maximus, turpis a maximus euismod, nibh tortor imperdiet dui, eget iaculis felis erat in justo. Nulla lacus nunc, tincidunt sit amet ex sed, commodo tempor nunc. Quisque mauris purus, dapibus porttitor ante in, luctus feugiat est. Pellentesque quis condimentum dolor.
      Maecenas luctus sem nisi, et lacinia est semper et. Integer eu leo eros. Suspendisse potenti. Pellentesque in magna condimentum, semper eros id, sodales dolor. Maecenas commodo dui eu nulla pharetra, vitae fringilla enim porttitor. Aliquam augue urna, posuere at ipsum aliquet, ornare egestas justo. Donec id condimentum est. In a maximus odio, in aliquam leo. Aenean nec est a diam viverra molestie bibendum at augue.
      Pellentesque ut faucibus felis. Nulla a tincidunt nibh. Vestibulum eu ultrices ex. Integer efficitur lacus eu ornare ultricies. Aenean eu turpis sed odio ullamcorper tincidunt vel quis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec iaculis urna eget finibus convallis. Quisque laoreet rutrum justo, in pellentesque diam consequat quis. Etiam ultricies enim et venenatis lacinia. Praesent eu velit aliquet, mattis mauris bibendum, volutpat massa. Cras orci orci, rhoncus in quam ut, sollicitudin interdum arcu. Phasellus eleifend, eros ac facilisis faucibus, ex enim iaculis nunc, eget faucibus lacus mauris et est. Integer finibus tristique nunc, sed tincidunt erat rhoncus lacinia. Duis auctor ultricies mattis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum eget magna nunc.
      Aenean sit amet molestie libero. Etiam commodo sapien vitae laoreet facilisis. Sed posuere turpis ut dolor pretium sollicitudin. Aliquam dapibus fringilla molestie. Etiam eget elit in metus sagittis blandit ac id ipsum. Praesent ultrices, erat at bibendum facilisis, nunc velit porta leo, in pretium diam quam a nisl. Maecenas vel diam a tellus sollicitudin luctus quis in purus. Aliquam eget justo eu ex dignissim dapibus ut id ligula.
      Vivamus porttitor, nunc et efficitur sagittis, mauris neque porta quam, sit amet consequat arcu dui sed quam. Nam non ex mollis, consequat ex at, euismod elit. Nunc eget diam id leo sagittis blandit. Donec pellentesque lacus sed congue maximus. Mauris maximus ultricies varius. Vestibulum nibh nibh, tincidunt vitae blandit.';
      Lorem ipsum.`
	const lorem = loremIpsum.replace(/(\r\n|\n|\r)/gm, '')
	if (type === 'characters') {
		return lorem.slice(0, length)
	} else if (type === 'words') {
		const loremWords = lorem.split(' ').slice(0, length)
		return loremWords.join(' ')
	}
}

// @ts-ignore
function Project(name) {
	this.name = name
	this.description = generateLorem(getRandomBetween(10, 50), 'words')
	this.manager = randomItemFromArray(['Osmund, Richard', 'Riley, Rachel', 'Diamond, Anne', 'Burr, Bill'])
	this.created = randomDate(2020)
	this.projectId = makeExampleId(10)
}
