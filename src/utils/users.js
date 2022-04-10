const users = [];

function addUser({ id, username, room }) {
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	if (!username || !room) {
		return {
			error: 'Username and room are required!',
		};
	}

	const existingUser = users.find((user) => {
		return user.room === room && user.username === username;
	});

	if (existingUser) {
		return {
			error: 'Username is in use!',
		};
	}

	const user = { id, username, room };
	users.push(user);
	return { user };
}

function removeUser(id) {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

function getUser(id) {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users[index];
	}
}

function getUsersInRoom(room) {
	room = room.trim().toLowerCase();
	return users.filter((user) => user.room === room);
}

export {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};