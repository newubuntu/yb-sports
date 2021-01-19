const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
//mongoose.Schema.Types.Mixed
const betDataSchema = new mongoose.Schema({
  // number: {type: Number},
  // bet365id
  account: {type: Schema.Types.ObjectId, ref: 'Account'},
  // member
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  event: {type: Schema.Types.ObjectId, ref: 'Event'},

  odds: {type: Number},
  stake: {type: Number},
  bookmakerOdds: {type: Number},
  bookmakerStake: {type: Number}
  // pinnacleId
  // pinnacleId: {type: String},
  // key: {type: String, required: true, unique:true},
  // data: {type: Schema.Types.Mixed, default: null}
},{
  timestamps: true
})

// autoIncrement.initialize(mongoose.connection);
// betDataSchema.plugin(autoIncrement.plugin, {
//   model : 'Setting',
//   field : 'number',
//   startAt : 0, //시작
//   increment : 1 // 증가
// });

betDataSchema.statics.create = function(payload){
  const p = new this(payload);
  return p.save();
}

// optionSchema.statics.find = function(_id){
//   return this.find(_id?{_id}:undefined);
//   // if(_id){
//   // }
// }
//
// optionSchema.statics.findOne = function(_id){
//   return this.findOne({_id});
// }

// settingSchema.statics.updateOne = function(_id, data){
//   return this.updateOne({_id}, data);
// }

module.exports = mongoose.models.BetData || mongoose.model("BetData", betDataSchema);
