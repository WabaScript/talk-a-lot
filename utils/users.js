const users = [];

//Join User to chat
const userJoin = (id, username, room) => {
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Get Current User
const getCurrentUser = id => {
    return users.find(user => user.id === id);
}

//User Leaves Chat
const userLeave = id => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Get room users
const getRoomUsers = room => {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}