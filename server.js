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

// handle socket connections
io.on('connection', (socket) => {
    console.log('Connected...');

    // handle message events from clients
    socket.on('message', (msg) => {
        // broadcast the message to all clients except the sender
        socket.broadcast.emit('message', msg);
    })
})
