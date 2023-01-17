const exampleProjects = [
	new Project('Booli'),
	new Project('Hitta Mäklare'),
	new Project('Bubbleroom'),
	new Project('Halens'),
	new Project('Cellbes'),
	new Project('Discount24'),
	new Project('Vasakronan'),
	new Project('Aller Media'),
	new Project('Aftonbladet'),
	new Project('Global Robot Parts'),
	new Project('LowPower.se'),
	new Project('Mathem'),
	new Project('Svenska Kyrkan'),
	new Project('Filippa K'),
]

/* ------------------------------------------------------------------------------
------------------------------ TABLE DATA ---------------------------------------
------------------------------------------------------------------------------ */

// Get data for table ++ Sort tableData by date (last created first)
const tableData = [...exampleProjects]
	.sort((firstEl, secondEl) => {
		return Date.parse(firstEl.created) - Date.parse(secondEl.created)
	})
	.reverse()

/* ------------------------------------------------------------------------------
  ------------------------------ VARIABLES ----------------------------------------
  ------------------------------------------------------------------------------ */

// Table build variables
const dataTable = document.querySelector('#allProjectsTable')

const showEntries_select = document.querySelector('select[name="tableLength"]')
const sortBy_select = document.querySelector('select[name="sortByCol"]')
const sortDir_select = document.querySelector('select[name="sortDir"]')
const tableFilter_input = document.querySelector('input[name="tableFilter"]')

const paginationArea = document.querySelector('.tableRow__bottom--pagination')
const showInfo = document.querySelector('.tableRow__bottom--showInfo')

// Current table sort values
// @ts-ignore
let numOfEntries = showEntries_select.value
// @ts-ignore
let sortBy = sortBy_select.value
// @ts-ignore
let sortDir = sortDir_select.value
let currentPage = 1
// @ts-ignore
let currentFilter = tableFilter_input.value

/* ------------------------------------------------------------------------------
  ---------------------------- CUSTOM EVENTS --------------------------------------
  ------------------------------------------------------------------------------ */

// Page Change Event
const event_pageChange = new Event('pageChange')

/* ------------------------------------------------------------------------------
  ------------------------------ FUNCTIONS ----------------------------------------
  ------------------------------------------------------------------------------ */

// Build table
function buildProjectTable(data, nmOfRows = 10, currentPage = 1, sortBy = 'date', sortDir = 'desc', currentFilter = '') {
	// --------------- CHECK IF DATA IS FILTERED ---------------
	let dataToProcess = []
	if (currentFilter) {
		dataToProcess = [...data].filter((item) => {
			const tableString = item.name + item.description + item.manager + item.created
			if (tableString.toLowerCase().includes(currentFilter)) return true
		})
	} else {
		dataToProcess = [...data]
	}

	// --------------- SORT A COPY OF data PARAM ---------------
	let sortedData
	switch (sortBy) {
		case 'date':
			sortedData = [...dataToProcess].sort((firstEl, secondEl) => {
				return Date.parse(firstEl.created) - Date.parse(secondEl.created)
			})
			break
		case 'name':
			sortedData = [...dataToProcess].sort((firstEl, secondEl) => {
				if (firstEl[sortBy].toLowerCase() < secondEl[sortBy].toLowerCase()) {
					return -1
				}
				if (firstEl[sortBy].toLowerCase() < secondEl[sortBy].toLowerCase()) {
					return 1
				}
				// names must be equal
				return 0
			})
			break
		case 'description':
			sortedData = [...dataToProcess].sort((firstEl, secondEl) => {
				if (firstEl[sortBy].toLowerCase() < secondEl[sortBy].toLowerCase()) {
					return -1
				}
				if (firstEl[sortBy].toLowerCase() < secondEl[sortBy].toLowerCase()) {
					return 1
				}
				// names must be equal
				return 0
			})
			break
		default:
			console.log(`Sorry, no valid value provided! Sorting by date.`)
			sortedData = [...dataToProcess].sort((firstEl, secondEl) => {
				return Date.parse(firstEl.created) - Date.parse(secondEl.created)
			})
			break
	}
	if (sortDir === 'desc') {
		sortedData.reverse()
	}
	// --------------- SELECT data TO SHOW ON SCREEN ---------------
	const sliceStart = (currentPage - 1) * nmOfRows
	const sliceEnd = nmOfRows * currentPage
	const tableRows = sortedData.slice(sliceStart, sliceEnd)

	// --------------- CREATE TABLE BODY AND INSERT ON SCREEN ---------------
	const tableBody = tableRows
		.map((project) => {
			return `<tr>
              <td>${project.name}</td>
              <td>${
								project.description.length < 150 ? project.description : project.description.slice(0, 150) + ' (...)'
							}</td>
              <td>${project.manager}</td>
              <td>${project.created}</td>
              <td><a href="/projects/details?id=${project.projectId}">Details</a></td>
          </tr>`
		})
		.join('')
	dataTable.querySelector('tbody').innerHTML = tableBody

	// --------------- ADD || UPDATE PAGINATION BUTTON AREA ---------------
	const numOfTablePages = Math.ceil(sortedData.length / nmOfRows)
	let pageBtns = []
	for (let i = 1; i <= numOfTablePages; i++) {
		pageBtns.push(`
              <button class="${i === currentPage ? 'paginateBtn currentPg' : 'paginateBtn'}" ${
			i === currentPage ? 'disabled="true"' : ''
		}>${i}</button>
          `)
	}
	paginationArea.innerHTML = `
          <button class="paginateBtn paginateBtn-prev" ${currentPage === 1 ? 'disabled="true"' : ''}>Previous</button>
              <span class="tableRow__bottom--paginationPages">
                  ${pageBtns.join('')}
              </span>
          <button class="paginateBtn paginateBtn-next" ${
						currentPage === numOfTablePages || numOfTablePages === 1 ? 'disabled="true"' : ''
					}>Next</button>
      `
	// Find and add event listeners on the new pageBtns
	const paginateBtns = document.querySelectorAll('.paginateBtn')
	paginateBtns.forEach((button) => {
		button.addEventListener('click', () => button.dispatchEvent(event_pageChange))
		button.addEventListener('pageChange', handlePageChange)
	})

	// ADD || UPDATE SHOWINFO
	showInfo.textContent = `Showing ${sliceStart + 1} to ${sortedData.length < sliceEnd ? sortedData.length : sliceEnd} of ${
		sortedData.length
	} entries`
}

async function handlePageChange(e) {
	// Check which type of button was pressed
	if (e.currentTarget.textContent.toLowerCase() === 'next') {
		currentPage += 1
	} else if (e.currentTarget.textContent.toLowerCase() === 'previous') {
		currentPage -= 1
	} else {
		currentPage = parseInt(e.currentTarget.textContent)
	}
	const projects = await fetchProjectsFromGraphQL()
	// Rebuild table
	buildProjectTable(/* tableData */ projects, numOfEntries, currentPage, sortBy, sortDir, currentFilter)
}

/* ------------------------------------------------------------------------------------
  ------------------------------ EVENT LISTENERS ----------------------------------------
  ------------------------------------------------------------------------------------ */

// @ts-ignore
const graphQlQuery = async (url, query, variables = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	})

	const res = await response.json()
	return res
}

const projectsQuery = `query Projects {
  projects {
    id
    name
    description
  }
}`

const fetchProjectsFromGraphQL = async () => {
	try {
		const res = await graphQlQuery('http://localhost:5000/graphql', projectsQuery)
		const fetchedData = res.data?.projects.map((projectData) => {
			return {
				projectId: projectData.id,
				manager: randomItemFromArray(['Osmund, Richard', 'Riley, Rachel', 'Diamond, Anne', 'Burr, Bill']),
				created: randomDate(2022),
				name: projectData.name,
				description: projectData.description,
			}
		})
		return fetchedData
	} catch (error) {
		console.error(error)
		return []
	}
}

showEntries_select.addEventListener('input', async function () {
	numOfEntries = this.value
	const projects = await fetchProjectsFromGraphQL()
	buildProjectTable(/* tableData */ projects, numOfEntries, currentPage, sortBy, sortDir, currentFilter)
})

sortBy_select.addEventListener('input', async function () {
	sortBy = this.value
	const projects = await fetchProjectsFromGraphQL()
	buildProjectTable(/* tableData */ projects, numOfEntries, currentPage, sortBy, sortDir, currentFilter)
})

sortDir_select.addEventListener('input', async function () {
	sortDir = this.value
	const projects = await fetchProjectsFromGraphQL()
	buildProjectTable(/* tableData */ projects, numOfEntries, currentPage, sortBy, sortDir, currentFilter)
})

tableFilter_input.addEventListener('input', async function () {
	currentFilter = this.value
	currentPage = 1
	const projects = await fetchProjectsFromGraphQL()
	buildProjectTable(/* tableData */ projects, numOfEntries, currentPage, sortBy, sortDir, currentFilter)
})

/* ------------------------------------------------------------------------------------
  -------------------------- On PageLoad execute...  ------------------------------------
  ------------------------------------------------------------------------------------ */

setTimeout(async () => {
	const projects = await fetchProjectsFromGraphQL()
	buildProjectTable(/* tableData */ projects, numOfEntries, currentPage)
}, 500)
