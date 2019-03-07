let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  sender: {
    type: { type: String },
    ID: { type: String },
    name: { type: String },
    pictureUrl: { type: String }
  },
  messageBody: { type: String },
  isDelivered: { type: Boolean },
  isRead: { type: Boolean },
  createdAt: { type: Date }
});

module.exports = {
  Message: schema
}