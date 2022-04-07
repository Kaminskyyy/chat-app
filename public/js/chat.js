const messageForm = document.getElementById('message-form');

const socket = io();

socket.on('message', (message) => {
	console.log(message);	
});

messageForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const form = new FormData(messageForm);

	socket.emit('sendMessage', form.get('message'));
});