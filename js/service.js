const config = {
	getUserURL: 'https://randomuser.me/api/?results'
};

const api = {
	getUserAPI: (numOfUsers) => {
		return $.ajax({
			url: `${config.getUserURL}=${numOfUsers}`,
			method: 'get'
		});
	}
};
