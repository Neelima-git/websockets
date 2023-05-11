// create a socket connection to the server
const socket = io({
    transports: ['websocket']
  });  

// prompt user to enter their name and room
let userName;
let roomName;
do {
    userName = prompt("Please enter your name: ");
} while (!userName);

do {
    roomName = prompt("Please enter the room name: ");
} while (!roomName);

// emit joinRoom event to the server with the room name
socket.emit('joinRoom', roomName);

// get references to the textarea and message area elements
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

// listen for Enter key press in the textarea and send message
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
})

// send message to server and update UI
function sendMessage(message) {
    let msg = {
        user: userName,
        message: message.trim(),
        room: roomName
    }
    // append the message to the UI with 'outgoing' style
    if (msg.user !== userName) {
        appendMessage(msg, 'outgoing');
    }
    scrollToBottom();
    textarea.value = '';

    // send the message to the server
    socket.emit('message', msg);

    console.log(`Message sent: ${msg.message}`);
}

// append a message to the UI with the specified style
function appendMessage(msg) {
    let mainDiv = document.createElement("div");
    let className = msg.user === userName ? 'outgoing' : 'incoming';
    mainDiv.classList.add(className, 'message');

    let markUp = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markUp;
    messageArea.appendChild(mainDiv);
}

// listen for incoming messages from the server and update UI
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
})

// scroll to the bottom of the message area
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
