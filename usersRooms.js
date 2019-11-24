const users = [];

// user = {
//   userId, 
//   userName,
//   rooms: []
// }

const MAIN_ROOM = 'MAIN_ROOM';
const rooms = [
  {
    roomId: MAIN_ROOM,
    roomName: 'Main',
    usersInRoom: []
  }
];

//Getting user in users array and returning user object if there is one or underfined if not
const getUser = (userId) => {
  return users.find(user => user.userId === userId);
};

//Getting user name in array of users and returning user object if there is such name otherwise underfined
const getUserName = (userName) => {
  userName = userName.trim();
  return users.find(user => user.userName.toLowerCase() === userName.toLowerCase());
};

//Getting room in rooms array and returning room object if there is one or underfined if not
const getRoom = (roomId) => {
  return rooms.find(room => room.roomId === roomId);
};

//Creating room by roomId and roomName and returning room object
const createRoom = ({ roomId, roomName }) => {
  console.log('room id ', roomId, ' room name', roomName);
  const newRoom = {
    roomId,
    roomName,
    usersInRoom: []
  };
  rooms.push(newRoom);
  console.log('rooms ', rooms);
  return newRoom;
};

//getting current time in format '14:47'
const getHHMM = () => {
  return new Date(Date.now()).toTimeString().slice(0, 5);
};

//Adding user in user array if there is no such name and returnig its object
const addUser = ({ userId, userName }) => {
  if (getUserName(userName)) {
    return { errorMessage: 'User name is taken!' };
  }
  const user = { userId, userName, rooms: [] };
  users.push(user);
  return { user };
};

//Adding user to room if room exists otherwise 
const addUserToRoom = ({ userName, roomId, roomName }) => {
  const existingRoom = getRoom(roomId);
  const user = getUserName(userName);
  if (existingRoom) {
    existingRoom.usersInRoom.push(user);
    user.rooms.push(roomId);
    return { room: existingRoom };
  } else {
    const room = createRoom({ roomId, roomName });
    room.usersInRoom.push(user);
    user.rooms.push(roomName);
    return { room };
  };
};

//Getting array of users in room and if there is no room in rooms array return empty usersInRoom array 
const getUsersInRoom = (roomId) => {
  const room = getRoom(roomId);
  if (!room) {
    return { usersInRoom: [] }
  } else {
    return { usersInRoom: room.usersInRoom };
  };
};

//Removing user from room with id roomId if removed returns true or false if not
const removeUserFromRoom = ({ userId, roomId }) => {
  const user = getUser(userId);
  const room = getRoom(roomId);
  if (!user || !room) {
    console.log('ERROR in removeUserFromRoom', user, room);
    return false;
  } else {
    const userIndex = room.usersInRoom.findIndex(el => el.userId === userId);
    if (userIndex !== -1) {
      room.usersInRoom.splice(userIndex, 1);
      return true;
    };
  };
};

//Removing room from room array if it not MAIN_ROOM
const removeRoom = (roomId) => {
  if (roomId === MAIN_ROOM) return;
  const index = rooms.findIndex(room => room.roomId = roomId);
  rooms.splice(index, 1);
};

//Removing user from user array and each room he had otherwise return false
const removeUser = (userId) => {
  const index = users.findIndex(user => user.userId === userId);
  if (index !== -1) {
    const removed = getUser(userId);
    removed.rooms.forEach(roomId => removeUserFromRoom({ userId, roomId }));
    users.splice(index, 1);
    return removed;
  } else {
    return false;
  };
};

module.exports = { getUser, addUser, addUserToRoom, getHHMM, getUsersInRoom, removeUserFromRoom, removeRoom, removeUser };
