function Message(username, text) {
	this.username = username;
	this.text = text;
	this.createdAt = new Date().getTime();
}

function LocationMessage(username, url) {
	this.username = username;
	this.url = url;
	this.createdAt = new Date().getTime();
}

export { Message, LocationMessage };