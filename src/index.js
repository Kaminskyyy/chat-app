import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Filter from 'bad-words';
import { LocationMessage, Message } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users.js';

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('./public'));

io.on('connection', (socket) => {
	console.log('New WebSocket connection');

	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room });

		if (error) {
			return callback(error);
		}

		socket.join(user.room);

		socket.emit('message', new Message('Admin', 'Welcome!'));
		socket.broadcast.to(user.room).emit('message', new Message(user.username, `${username} has joined!`));
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room),
		});

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		if (!user) {
			return callback('Invalid user!');
		}

		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed!');
		}

		io.to(user.room).emit('message', new Message(user.username, message));
		callback();
	});

	socket.on('sendLocation', (coords, callback) => {
		const user = getUser(socket.id);

		if (!user) {
			return callback('Invalid user!');
		}

		io.to(user.room).emit(
			'locationMessage',
			new LocationMessage(user.username, `https://google.com/maps?${coords.latitude},${coords.longtitude}`)
		);
		callback();
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('message', new Message('Admin' ,`${user.username} has left`));
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});
});

server.listen(port, () => {
	console.log('Server is up on port ' + port);
});
