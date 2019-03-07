let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Message = require('./message');

let schema = new Schema({
  roomId: { type: String },
  candidateID: { type: String, unique: true },
  deviceIDToken: { type: String },
  consultantIDs: [{ type: String }],
  messages: [{ type: Message.Message }]
})

module.exports = mongoose.model('Chat', schema);