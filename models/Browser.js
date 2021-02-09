const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;
//mongoose.Schema.Types.Mixed
const browserSchema = new mongoose.Schema({
  account: {type: Schema.Types.ObjectId, ref: 'Account'},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  program: {type: Schema.Types.ObjectId, ref: 'Program'},
  option: {type: Schema.Types.ObjectId, ref: 'Option'},
  used: {type: Boolean}
  // logs: [{type: Schema.Types.ObjectId, ref: 'Log'}]
},{
  timestamps: true
})

browserSchema.plugin(deepPopulate);

// browserSchema.statics.create = async function(payload){
//   const p = new this(payload);
//   await p.save();
//   return p;
// }

// browserSchema.methods.log = function(msg){
//   console.log(this.account.id, msg);
// }




// userSchema.statics.find = function(id){
//   return this.findOne({socketId:id});
// }

// userSchema.statics.updateOne = function(socketId, data){
//   return this.findOneAndUpdate({socketId}, data, {new:true});
// }

module.exports = mongoose.models.Browser || mongoose.model("Browser", browserSchema);
