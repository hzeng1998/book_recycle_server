const Socket = require('socket.io');
const db = require('./middleware/db');

let SOCKET_LIST = new Map();

let count = 0;

module.exports = (server) => {
  const io = Socket(server);
  io.on('connection', socket => {

    let temp_id;

    console.log('connect');

    socket.emit('info', 'connect');

    socket.on('id', (id) => {
      temp_id = id;
      SOCKET_LIST.set(id, socket);
    });

    socket.on('message', (message) => {

      console.log('receive:' + message);

      message = JSON.parse(message);

      let fp = SOCKET_LIST.get(message.receiver);

      if (fp) {
        fp.emit('message', JSON.stringify(message));
      }

      const sql = `insert into message_log (sender, receiver, message) values('${message.sender}','${message.receiver}','${message.message}')`;

      try {
        db.query(sql);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      SOCKET_LIST.delete(temp_id);
    });
  });
};