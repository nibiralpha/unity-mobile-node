const WebSocket = require('ws');
const MessageFunctions = require('../../functions/chat');

module.exports = {
  start: function (bserver) {
    const wss = new WebSocket.Server({ server: bserver });
    console.log('ws server starting');

    setInterval(() => {
      keepSckAlive();
    }, 3000)

    wss.on('connection', ws => {
      console.log('connected');
      ws.room = [];

      // This is the most important callback for us, we'll handle
      // all messages from users here.
      ws.on('message', async function (message) {
        // console.log('MESSAGE: ', JSON.parse(message));
        var JSONmessage = JSON.parse(message);
        if (JSONmessage.join) {
          MessageFunctions.createChatRoom(JSONmessage).then(chatRoom => {
            ws.room.push(chatRoom.roomId);
          });

        } else if (JSONmessage.room) {
          MessageFunctions.addMessageToChat(JSONmessage).then(() => {
            broadcast(JSONmessage);
          });
        }
      });
      ws.on('close', function (connection) {
        // close user connection
      });
    });
    function broadcast(message) {
      wss.clients.forEach(client => {
        console.log('CLIENT ROOM: ', client.room);
        //client.send(JSON.stringify(message));
        if (client.room.indexOf(message.room) > -1) {
          console.log('message being broadcast: ', message);
          client.send(JSON.stringify(message));
          console.log('successfully broadcast message');
        }
      });
    }

    function keepSckAlive() {
      console.log("zzz");
      
      if (wss && wss.clients && wss.clients !== undefined) {
        wss.clients.forEach(client => {
          // if (client.room.indexOf(message.room) > -1) {
            client.send("ping");
          // }
        });
      }
    }
  }
}