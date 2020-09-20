
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get User and Room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get Room and Users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Notification Sound
const messageSound = () => {
    console.log("sound playing")
    const audio = new Audio('../audio/swiftly_noti.mp3');
    audio.play();
}

//Message from Server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Notification sound
    // messageSound();

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Keyboard fix for iPhones
chatForm.addEventListener("focus", () => { 
    e.preventDefault();
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
})

//Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Grab message text
    const msg = e.target.elements.msg.value

    //Emit message to server
    socket.emit('chatMessage', msg)

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    e.target.elements.msg.blur()
})

//Output message to DOM
const outputMessage = message => {
    const div =document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//Add Room Name to DOM
const outputRoomName = room => {
    roomName.innerText = room;
};

//Add Users to DOM
const outputUsers = users => {
    userList.innerHTML = `
    ${users.map(user => `<li><i id="user-icon" class="fas fa-user"></i> ${user.username}</li>`).join('')}
    `;
}