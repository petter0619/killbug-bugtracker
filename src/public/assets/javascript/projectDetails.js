const exampleProject = new Project('Global Robot Parts')
// console.log(exampleProject)

const projectDetailsForm = document.querySelector('#projectDetailsForm')
// Form fields
let projectName = projectDetailsForm.querySelector('input[name="projectName"]')
let projectDescription = projectDetailsForm.querySelector('textarea[name="projectDescription"]')
let projectManager = projectDetailsForm.querySelector('input[name="projectManager"]')
let createdAt = projectDetailsForm.querySelector('input[name="created"]')

// Fill fields
// @ts-ignore
projectName.value = /* exampleProject.name */ '...loading...'
projectDescription.textContent = /* exampleProject.description */ '...loading...'
// @ts-ignore
projectManager.value = /* exampleProject.manager */ '...loading...'
// @ts-ignore
createdAt.value = /* exampleProject.created */ '...loading...'

projectDescription.setAttribute('rows', `${Math.floor(projectDescription.scrollHeight / 24)}`)
//projectDescription.style.height = `${projectDescription.scrollHeight}px`;

// Edit Form Button
const editFormBtn = document.querySelector('#editFormBtn')
const detailsForm__submitArea = projectDetailsForm.querySelector('.detailsForm__group--submit')
const cancelEditBtn = detailsForm__submitArea.querySelector('#editFormBtn__cancel')
const isArchived = projectDetailsForm.querySelector('input[name="archive"]')

editFormBtn.addEventListener('click', function () {
	projectName.removeAttribute('disabled')
	projectDescription.removeAttribute('disabled')
	isArchived.removeAttribute('disabled')

	// @ts-ignore
	detailsForm__submitArea.style.display = 'flex'
	// @ts-ignore
	editFormBtn.style.display = 'none'
})

cancelEditBtn.addEventListener('click', function () {
	projectName.setAttribute('disabled', 'true')
	projectDescription.setAttribute('disabled', 'true')
	isArchived.setAttribute('disabled', 'true')

	// @ts-ignore
	detailsForm__submitArea.style.display = 'none'
	// @ts-ignore
	editFormBtn.style.display = 'inline-block'
})

// Add Project Member Form
const addMemberForm = document.querySelector('#projectTeamForm')
const addMemberBtn = document.querySelector('#addProjectMemberBtn')

addMemberBtn.addEventListener('click', function () {
	console.log(this)

	// @ts-ignore
	if (addMemberForm.style.display === 'none') {
		// @ts-ignore
		addMemberForm.style.display = 'block'
		this.textContent = 'Cancel'
		// @ts-ignore
		this.classList.add('closeFormBtn')
	} else {
		// @ts-ignore
		addMemberForm.style.display = 'none'
		this.textContent = '+ Add Member'
		// @ts-ignore
		this.classList.remove('closeFormBtn')
	}
})

// Prevent form submit
const forms = document.querySelectorAll('form')
forms.forEach((form) =>
	form.addEventListener('submit', (e) => {
		e.preventDefault()
	})
)

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

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

const projectQuery = `query Projects($projectId: ID!) {
  project(projectId: $projectId) {
    id
    name
    description
  }
}`

const onStart = async () => {
	// @ts-ignore
	let params = new URL(document.location).searchParams
	let projectId = params.get('id')

	if (!projectId) {
		window.location.replace('/projects')
	}

	try {
		const res = await graphQlQuery('http://localhost:5000/graphql', projectQuery, {
			projectId: projectId,
		})

		// @ts-ignore
		projectName.value = res.data?.project.name
		projectDescription.textContent = res.data?.project.description
		// @ts-ignore
		projectManager.value = randomItemFromArray(['Osmund, Richard', 'Riley, Rachel', 'Diamond, Anne', 'Burr, Bill'])
		// @ts-ignore
		createdAt.value = randomDate(2022)
	} catch (error) {
		console.error(error)
		alert('Failed to fetch project data. You will be redirected pack to project table...')
		window.location.replace('/projects')
	}
}

onStart()
