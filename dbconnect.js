const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");//global.Promise;
module.exports = mongoose.connect("mongodb://localhost/yb", {useNewUrlParser: true, useUnifiedTopology : true});
//
// .then(()=>console.log("Successfully connected to mongodb"))
// .catch(e=>console.error(e));
