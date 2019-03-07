const Chat = require('../models/chat');
var admin = require("firebase-admin");

var serviceAccount = require("../pertemps-workforce-firebase-adminsdk-hrga9-cf07c73a2b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pertemps-workforce.firebaseio.com"
});

exports.createChatRoom = async function(message) {
  let chat = new Chat({
    roomId: message.join,
    candidateID: message.join,
    messages: []
  });
  return Chat.findOne({roomId: message.join}, async function(err, chatObj) {
    if (err) {
      console.log(err);
      return;
    } else if (!chatObj) {
      newRoom = await chat.save();
      // console.log('new room: ', newRoom);
      return await newRoom;
    } else {
      // console.log('existing room: ', chatObj);
      return await chatObj;
    }
  });
};

exports.addMessageToChat = async function(message) {
  let query = undefined;
  let newMessage = {
    sender: {
      type: message.message.sender.type,
      ID: message.message.sender.ID,
      name: message.message.sender.name,
      pictureUrl: message.message.sender.pictureUrl
    },
    messageBody: message.message.messageBody,
    createdAt: message.message.createdAt
  }
  if (message.message.sender.type == 'consultant') {
    query = {$addToSet : { consultantIDs: message.message.sender.id }};
  } 
  return Chat.updateOne(
    { roomId: message.room },
    { 
      $push: { messages: newMessage }
    }).exec(async function(err, updatedChat) {
      if (err) {
        console.log(err);
      } else {
        Chat.findOne({roomId: message.room}, function(err, room) {
          if (err) {
            console.log(err);
          } else {
            var payload = {
              notification: {
                title: "Pertemps Chat",
                body: message.message.messageBody
              }
            };
            var options = {
              priority: 'high'
            }
            admin.messaging().sendToDevice(room.deviceIDToken, payload, options)
              .then(function(response) {
                console.log("Successfully sent message:", response);
              })
              .catch(function(error) {
                console.log("Error sending message:", error);
              });
          }
        })
        return await updatedChat;
      }
    })
}

exports.getMessages = function(req, res) {
  let roomId = req.query.roomId;
  Chat.findOne({roomId: roomId })
    .exec(function(err, result) {
      if (err) {
        console.log(err);
        return;
      } else if (result) {
        // console.log('chat messages are: ', result.messages);
        res.json(result.messages);
      } else {
        res.json([]);
      }
    })
}

exports.saveToken = function(req, res) {
  let content = req.body;
  console.log('deviceID token is: ', content);
  Chat.findOne(
    { candidateID: content.cid },
    function(err, obj) {
    if (err) {
      console.log(err);
      return;
    } else if (obj) {
      console.log(obj);
      obj.deviceIDToken = content.deviceIDToken;
      obj.save();
      res.json({message: 'success'});
    }
  })
}