const io = require('./index.js');
const {
  getUser,
  addUser,
  addUserToRoom,
  getHHMM,
  getUsersInRoom,
  removeUserFromRoom,
  removeRoom,
  removeUser } = require('./usersRooms.js')


module.exports = socket => {
  console.log('New coonection', socket.id);

  socket.on('VERIFY_USER', ({ userName }, callback) => {
    console.log('verifying ', userName, '...');
    const { errorMessage, user } = addUser({ userId: socket.id, userName });
    callback({ user, errorMessage });
  });

  socket.on('CONNECT_USER_TO_ROOM', ({ userName, roomId, roomName }, callback) => {
    // console.log('adding user ', userName, ' to roomName ', roomName, ' with roomId ', roomId);

    const { room } = addUserToRoom({ userName, roomId, roomName });
    socket.join(roomId);
    callback({ room });

    socket.emit('message', { message: { user: 'admin', text: `${userName}, welcome to the "${room.roomName}" room.`, time: getHHMM() }, roomId });
    socket.to(roomId).broadcast.emit('message', { message: { user: 'admin', text: `${userName} has connected.`, time: getHHMM() }, roomId });

    const { usersInRoom } = getUsersInRoom(roomId);
    io.to(roomId).emit('UPDATE_USERS_IN_ROOM', { usersInRoom, roomId });
    console.log('user ', userName, ' added to ', roomName, ' with roomId ', roomId, ' and usersInRoom is ', usersInRoom);
  });

  socket.on('SEND_MESSAGE', ({ message, activeRoomId }, callback) => {
    const user = getUser(socket.id);
    io.to(activeRoomId).emit('message', { message: { user: user.userName, text: message, time: getHHMM() }, roomId: activeRoomId });
    callback();
  });


  socket.on('DISCONNECT_USER_FROM_ROOM', ({ userId, roomId }) => {
    const user = getUser(userId);
    if (removeUserFromRoom({ userId, roomId })) {
      socket.leave(roomId);
      const { usersInRoom } = getUsersInRoom(roomId);
      if (usersInRoom.length === 0) {
        removeRoom(roomId);
      } else {
        io.to(roomId).emit('UPDATE_USERS_IN_ROOM', { usersInRoom, roomId });
        io.to(roomId).emit('message', { message: { user: 'admin', text: `${user.userName} has left room.`, time: getHHMM() }, roomId });
      };
    };
  });


  socket.on('LOGOUT', () => {
    console.log('logout', socket.id);
    const removed = removeUser(socket.id);
    if (removed) {
      removed.rooms.forEach(roomId => {
        socket.leave(roomId);
        const { usersInRoom } = getUsersInRoom(roomId);
        if (usersInRoom.length === 0) {
          removeRoom(roomId);
        } else {
          io.to(roomId).emit('UPDATE_USERS_IN_ROOM', { usersInRoom, roomId });
          io.to(roomId).emit('message', { message: { user: 'admin', text: `${removed.userName} has left room.`, time: getHHMM() }, roomId });
        };
      });
    };
  });

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
    const removed = removeUser(socket.id);
    if (removed) {
      removed.rooms.forEach(roomId => {
        socket.leave(roomId);
        const { usersInRoom } = getUsersInRoom(roomId);
        if (usersInRoom.length === 0) {
          removeRoom(roomId);
        } else {
          io.to(roomId).emit('UPDATE_USERS_IN_ROOM', { usersInRoom, roomId });
          io.to(roomId).emit('message', { message: { user: 'admin', text: `${removed.userName} has left room.`, time: getHHMM() }, roomId });
        };
      });
    };
  });
};