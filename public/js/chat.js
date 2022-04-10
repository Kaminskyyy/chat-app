const socket = io();

// ------ Elements ------
// Message
const $messageForm = document.getElementById('message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.getElementById('messages');

// Location
const $sendLocationButton = document.getElementById('send-location');

// ----- Templates -----
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-tamplate').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

// ----- Options -----
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
	const html = Mustache.render(messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('k:mm'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (locationMessage) => {
	const html = Mustache.render(locationMessageTemplate, {
		username: locationMessage.username,
		url: locationMessage.url,
		createdAt: moment(locationMessage.createdAt).format('k:mm'),
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({room, users}) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users,
	});
	document.getElementById('sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (event) => {
	event.preventDefault();

	$messageFormButton.setAttribute('disabled', 'disabled');

	const form = new FormData($messageForm);

	socket.emit('sendMessage', form.get('message'), (error) => {
		$messageFormButton.removeAttribute('disabled');
		$messageFormInput.value = '';
		$messageFormInput.focus();

		if (error) console.log(error);
		else console.log('Message delivered!');
	});
});

$sendLocationButton.addEventListener('click', (event) => {
	event.preventDefault();

	if (!navigator.geolocation) {
		return alert('Geaolocation is not supported by your browser!');
	}

	$sendLocationButton.setAttribute('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit(
			'sendLocation',
			{
				latitude: position.coords.latitude,
				longtitude: position.coords.longitude,
			},
			() => {
				$sendLocationButton.removeAttribute('disabled');
				console.log('Location shared!');
			}
		);
	});
});

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = '/';
	}
});
