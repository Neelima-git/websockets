const express = require('express');
const app = express();

// create HTTP server using the Express app
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

// start listening on the specified port
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// serve static files from public directory
app.use(express.static(__dirname + '/public'))

// serve the index.html file for root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

// setup socket.io
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Connected...');

    let room;

// handle message events from clients
socket.on('message', (msg) => {
    // broadcast the message to all clients in the same room except the sender
    socket.to(msg.room).emit('message', msg);
    console.log(`Message from ${msg.user}: ${msg.message}`);
});


    // handle join room events from clients
    socket.on('joinRoom', (roomName) => {
        // leave any existing rooms
        socket.leaveAll();

        // join the specified room
        socket.join(roomName);
        room = roomName;

        console.log(`${socket.id} joined room ${room}`);
    });
});

