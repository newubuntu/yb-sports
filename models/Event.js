const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
//mongoose.Schema.Types.Mixed
const eventSchema = new mongoose.Schema({
  number: {type: Number},
  // _id: {type: String, unique:true, required:true},
  data: {type: Schema.Types.Mixed, default: null}
},{
  timestamps: true,
  // _id: false
})

autoIncrement.initialize(mongoose.connection);
eventSchema.plugin(autoIncrement.plugin, {
  model : 'Setting',
  field : 'number',
  startAt : 0, //시작
  increment : 1 // 증가
});

eventSchema.statics.create = function(payload){
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

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
