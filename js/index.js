let state;

function init() {
	//get user from api
	$('#user-btn').on('click', getUser);
	draw(state);
	//get 10 users on start up
	getUsersOnStartup();
	//change random user every 20 seconds
	setInterval(changeRandomUser, 20000);
}

function changeRandomUser() {
	console.log('changing...');

	api
		.getUserAPI(1)
		.then((user) => {
			console.log(user.results);
			user.results.map((userResult) => {
				const newUser = new UserModel(
					userResult.picture.large,
					userResult.gender,
					userResult.name.first,
					userResult.dob.age,
					userResult.email,
					userResult.login.uuid
				);
				//get random user index
				const randomUserIndex = Math.round(Math.random() * (state.length - 1));
				//update random user
				state[randomUserIndex] = newUser;
				saveToLocalStorage('usersData', state);
				draw(state);
			});
		})
		.catch((e) => console.log(e));
}

function getUsersOnStartup() {
	api
		.getUserAPI(10)
		.then((users) => {
			users.results.map((userResult) => {
				//create a new user modal
				const newUser = new UserModel(
					userResult.picture.large,
					userResult.gender,
					userResult.name.first,
					userResult.dob.age,
					userResult.email,
					userResult.login.uuid
				);
				//save to state and local storage
				state.unshift(newUser);
				saveToLocalStorage('usersData', state);
			});
		})
		.then(() => draw(state))
		.catch((e) => console.log(e));
}

function getUser() {
	api
		.getUserAPI(1)
		.then((user) => {
			console.log(user.results);
			user.results.map((userResult) => {
				const newUser = new UserModel(
					userResult.picture.large,
					userResult.gender,
					userResult.name.first,
					userResult.dob.age,
					userResult.email,
					userResult.login.uuid
				);
				state.unshift(newUser);
				saveToLocalStorage('usersData', state);
				draw(state);
			});
		})
		.catch((e) => console.log(e));
}

function draw(stateUI) {
	if (!stateUI) return;
	//clean ui
	$('#main').html('');
	stateUI.map((user) => {
		//clone existing card in html
		const domElement = $('#user-cloned').clone();
		domElement.css({ display: 'inline-block' });
		domElement.find('img').addClass('img-fluid').attr({ src: user.image });
		domElement.find('#gender').html('gender:' + user.gender);
		domElement.find('#name').html('name:' + user.name);
		domElement.find('#age').html('age:' + user.age);
		domElement.find('#email').html('email:' + user.email);
		//delete button
		domElement.find('#btn-delete').on('click', () => {
			//find user to delete by id
			const indexToDelete = state.findIndex((stateUser) => stateUser.id === user.id);
			state.splice(indexToDelete, 1);
			saveToLocalStorage('usersData', state);
			draw(state);
		});

		domElement.find('#btn-edit').on('click', function() {
			//   alert('editing');
			const indexToEdit = state.findIndex((stateUser) => stateUser.id === user.id);
			const currentState = state[indexToEdit];
			//change editing state
			currentState.editing = !currentState.editing;
			//get user to change name and email
			//editing true
			if (currentState.editing) {
				domElement.find('#name').html(`name: <input  name="name" value=${currentState.name} />`);
				domElement.find('#email').html(`name: <input  name="email" value=${currentState.email} />`);
				$(this).text('Save');
				$(this).removeClass('btn-info').addClass('btn-success');
			} else {
				//update the user from input
				//editing false
				const newUserName = domElement.find('input[name="name"]').val();
				const newUserEmail = domElement.find('input[name="email"]').val();
				$(this).text('Edit');
				$(this).removeClass('btn-success').addClass('btn-info');
				currentState.name = newUserName;
				currentState.email = newUserEmail;
				saveToLocalStorage('usersData', state);
				draw(state);
			}
		});

		$('#main').append(domElement);
	});
}

function saveToLocalStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

$(function() {
	//if state already exist get else set it to empty array
	state = JSON.parse(localStorage.getItem('usersData')) || [];
	//init application
	init();
});
