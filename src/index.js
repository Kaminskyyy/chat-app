import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('./public'));

io.on('connection', (socket) => {
	console.log('New WebSocket connection');

	socket.emit('message', 'Welcome!');

	socket.on('sendMessage', (message) => {
		io.emit('message', message);
	});
});

server.listen(port, () => {
	console.log('Server is up on port ' + port);
});
