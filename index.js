const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = module.exports = socketio(server);

const router = require('./router');

app.use(router);
app.use(cors());

const socket = require('./socket');
io.on('connection', socket);


server.listen(PORT, () => {
  console.log(`Server is started on PORT ${PORT}`);
});