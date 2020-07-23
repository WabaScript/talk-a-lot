const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Sir Talk-a-Lot-Bot';

//Run whe client connects
io.on('connection', socket => {
    console.log('New WS connected...');

    socket.on('joinRoom', ({ username, room }) => {
        //Create User
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome -- single client only
        socket.emit('message', formatMessage(botName, `${user.username}, Welcome to the party.`));
    
        //Broadcast when user connects -- to all users except client connecting
        socket.broadcast.to(user.room).emit(
            'message', 
            formatMessage(botName, `${user.username} has joined the chat!`)
        );

        // Send users + room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    
    //Listen for new chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
    });

    //Broadcast when client disconnects - to all
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the chat.`));
        
        // Send users + room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));