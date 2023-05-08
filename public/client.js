// create a socket connection to the server
const socket = io();

// prompt user to enter their name
let userName;
do {
    userName = prompt("Please enter your name: ");
} while (!userName);

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
        message: message.trim()
    }
    // append the message to the UI with 'outgoing' style
    appendMessage(msg, 'outgoing');
    scrollToBottom();
    textarea.value = '';

    // send the message to the server
    socket.emit('message', msg);
}

// append a message to the UI with the specified style
function appendMessage(msg, type) {
    let mainDiv = document.createElement("div");
    let className = type;
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
