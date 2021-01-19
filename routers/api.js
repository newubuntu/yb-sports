const router = require("express").Router();
// const session = require("express-session");
const mongoose = require("mongoose");
const User = require('../models/User');
const Program = require('../models/Program');
const Browser = require('../models/Browser');
const Log = require('../models/Log');
const Account = require('../models/Account');
const Option = require('../models/Option');
const Approval = require('../models/Approval');
const Setting = require('../models/Setting');
const BetData = require('../models/BetData');
const Event = require('../models/Event');


const config = require('../config');
const {comma} = require('../utils');

const {v4:uuidv4} = require('uuid');

module.exports = io=>{

  function sendDataToMain(pid, bid, com, data){
    // io.to(pid).emit("toMain", {bid, com, data, from:"server"});
    emitToProgram(pid, "toMain", {bid, com, data, from:"server"});
  }

  function sendDataToBg(pid, bid, com, data){
    // io.to(pid).emit("toBg", {bid, com, data, from:"server"});
    emitToProgram(pid, "toBg", {bid, com, data, from:"server"});
  }

  function sendDataToBet365(pid, bid, com, data){
    // io.to(pid).emit("toBet365", {bid, com, data, from:"server"});
    emitToProgram(pid, "toBet365", {bid, com, data, from:"server"});
  }

  function emitToMember(...args){
    let email = args.shift();
    let context = io.to(email);
    context.emit.apply(context, args);
  }

  function emitToAdmin(...args){
    let context = io.to('admin');
    context.emit.apply(context, args);
  }





  function emitToProgram(pid, ...args){
    let context = io.to(pid);
    context.emit.apply(context, args);
  }

  let socketResolveList = {};
  function emitToProgramPromise(pid, ...args){
    let context = io.to(pid);
    let uuid = uuidv4();
    args.push(uuid);
    context.emit.apply(context, args);
    return new Promise(resolve=>{
      socketResolveList[uuid] = resolve;
    })
  }





  // function adminCheck(res, req, next){
  //   if(!(req.user.authority || req.user.master)){
  //     res.json({
  //       status: "fail",
  //       message: "권한이 없는 요청입니다."
  //     })
  //     return;
  //   }
  //   next();
  // }
  //
  // function masterCheck(res, req, next){
  //   if(!req.user.master){
  //     res.json({
  //       status: "fail",
  //       message: "권한이 없는 요청입니다."
  //     })
  //     return;
  //   }
  //   next();
  // }



  function authAdmin(req, res, next){
    // /api 미들웨어 부분에서 이미 무조건 user를 가져와서 처리하게 해놨다.
    // let user = await User.findOne({_id:req.user._id}).select(["authority", "master"]);
    let user = req.user;
    if(user && (user.authority || user.master)){
      next();
      return;
    }

    res.status(500).json({
      status: "fail",
      message: "관리자 권한이 필요한 기능입니다."
    });
  }

  function authMaster(req, res, next){
    // /api 미들웨어 부분에서 이미 무조건 user를 가져와서 처리하게 해놨다.
    // let user = await User.findOne({_id:req.user._id}).select("master");
    let user = req.user;
    if(user && user.master){
      next();
      return;
    }

    res.status(500).json({
      status: "fail",
      message: "마스터 권한이 필요한 기능입니다."
    });
  }

  function task(cb){
    return function(req, res){
      try{
        cb(req, res);
      }catch(e){
        console.error(e);
        res.status(500).json({
          status: "fail",
          message: e.message
        });
      }
    }
  }

  //for master.  재사용하기위해
  async function deposit(account, money){
    // console.error("#########deposit");
    // let updateData = {
    //   depositStatus: 'complete',
    //   depositMoney: money
    // }
    // money = money || account.depositMoney;
    if(money !== undefined){
      account.depositMoney = money;
    }else{
      money = account.depositMoney;
    }
    account.depositStatus = 'complete';
    //account.depositMoney = money
    account.money = 0;
    account.trash = true;

    // updateData.money = 0;
    await User.updateOne({_id:account.user}, {$inc:{wallet:money}});
    await account.save();
    await refreshBet365Money(account);
    // await updateBet365Money(account, 0, true);
    // 출금횟수는 빈번하지 않으니 아래를 진행해도 될듯.
    await updateBet365TotalMoney(account.user, true);
    // await Account.updateOne({_id:account.}, updateData);
  }

  async function approvalTask(com, data){
    let account, user;
    switch(com){
      case "deposit":
        account = await Account.findOne({_id:data.aid});
        if(account){
          // await account.deposit();
          await deposit(account);
        }
      break;

      case "refreshMoney":
        // user = await User.findOne({_id:data.uid});
        await refreshMoney(data.uid);
      break;
    }
  }

  async function refreshMoney(user){
    user = getUser(user);
    if(user){
      // console.error("######1", user.bet365Money);
      // await updateBet365TotalMoney(user);
      // console.error("######2", user.bet365Money);
      emitToMember(user.email, "updateMoney", user);
    }
  }

  async function updateMoney(user, sync){
    user = getUser(user);
    if(user){
      await updateBet365TotalMoney(user);
      if(sync){
        await refreshMoney(user);
      }
    }
  }


 ///////////////////////////////
  async function getAccount(account){
    // console.log("########################");
    // console.log(account instanceof mongoose.Types.ObjectId);
    // console.log(account.user instanceof mongoose.Types.ObjectId);
    // console.log(account.user);
    // console.log("@@@", (!(account instanceof mongoose.Types.ObjectId) && account.user instanceof mongoose.Types.ObjectId));
    // console.log("########################");
    if(
      (account instanceof mongoose.Types.ObjectId || typeof account === "string") ||
      (!(account instanceof mongoose.Types.ObjectId) && account.user instanceof mongoose.Types.ObjectId) ||
      (!(account instanceof mongoose.Types.ObjectId) && !(account.user && account.user.email))
    ){
      // console.log("before findone", account);

      account = await Account.findOne({_id:account}).populate({
        path: 'user',
        model: User,
        options:{
          select: "email"
        }
      });

      // console.log("after findone", account);
    }
    return account;
  }

  async function refreshBet365Money(account){
    account = await getAccount(account);
    if(account && account.user){
      console.log("refreshBet365Money");
      emitToMember(account.user.email, "updateEachBet365Money", {
        account: {
          _id: account._id,
          money: account.money
        },
        updateTarget: ["/dashboard", "/accountManager"]
      })
    }
  }

 // 벳삼 돈 갱신
  async function updateBet365Money(account, money, sync){
    account = await getAccount(account);
    if(account){
      account.money = Math.floor(money);
      await account.save();
      if(sync){
        await refreshBet365Money(account);
      }
    }
  }

  async function getUser(user){
    if(user instanceof mongoose.Types.ObjectId || typeof user === "string"){
      user = await User.findOne({_id:user}).select('-password');
    }
    return user;
  }

  async function refreshBet365TotalMoney(user){
    user = await getUser(user);
    emitToMember(user.email, "updateMoney", {bet365Money:user.bet365Money});
  }

  // 자주 호출하지 말자.
  async function updateBet365TotalMoney(user, sync){
    console.log("updateBet365TotalMoney");
    // 유저에 표시할 벳삼머니는 유저가 가진 벳삼머니의 총합이다.
    user = await getUser(user);

    if(!user) return;

    let filter = {user:user, trash:false, removed:false};
    let accounts = await Account.find(filter);
    let totalMoney = accounts.reduce((r,account)=>r+account.money, 0);
    // console.log("@@@@@@ totalMoney", totalMoney);
    user.bet365Money = Math.floor(totalMoney);
    await user.save();
    // await User.updateOne({_id:browser.user}, {bet365Money:result[0].money});
    if(sync){
      await refreshBet365TotalMoney(user);
      // emitToMember(user.email, "updateMoney", {bet365Money:totalMoney});
    }

    return totalMoney;
  }

  // select is string array
  async function getSetting(select){
    let data = await Setting.findOne().sort({createdAt:-1});
    if(data){
      return select ? select.reduce((r,v)=>{
        r[v] = data.value[v];
        return r;
      },{}) : data.value;
    }
  }

  let MD = {
    io,
    mongoose,
    sendDataToMain,
    sendDataToBg,
    sendDataToBet365,
    emitToMember,
    emitToAdmin,
    emitToProgram,
    emitToProgramPromise,
    socketResolveList,
    config,
    comma,
    router,
    User,
    Program,
    Browser,
    BetData,
    Event,
    Log,
    Account,
    Option,
    Approval,
    Setting,
    authAdmin,
    authMaster,
    task,
    deposit,
    approvalTask,
    refreshMoney,
    refreshBet365Money,
    refreshBet365TotalMoney,
    updateBet365Money,
    updateBet365TotalMoney,
    getSetting
  }

  require('./api_socket')(MD);
  require('./api_option')(MD);
  require('./api_user')(MD);
  require('./api_account')(MD);
  require('./api_program')(MD);
  require('./api_deposit')(MD);
  require('./api_approval')(MD);


  // from betburger
  router.post("/input_data", (req, res)=>{
    // console.log("receive gamedata");
    //io.to("__checker__")
    // console.log("send gamedata");
    io.to("__data_receiver__").emit("gamedata", req.body);
    // sendDataToMain(pid, bid, com, data){
    res.send('1');
  })

  router.post("/input_bet", task(async (req, res)=>{
    let data = req.body;
    data.user = req.user._id;
    let bd;
    console.log("input bet", data);
    try{
      bd = await BetData.create(data);
    }catch(e){
      console.error(e);
      res.json({
        status: "fail",
        message: "배팅기록 생성 오류"
      })
      return;
    }

    res.json({
      status: "success",
      data: bd._id
    })
  }))

  router.post("/set_setting", authMaster, task(async (req, res)=>{
    let data = req.body;
    if(!data){
      res.json({
        status: "fail",
        message: "저장 할 설정값이 없습니다."
      })
      return;
    }
    // console.log(data);
    let count = await Setting.countDocuments();
    let setting;
    if(count){
      setting = await Setting.findOne().sort({createdAt:-1});
      setting.value = Object.assign(setting.value, data);
      setting.markModified('value');
      await setting.save();
    }else{
      setting = new Setting({value:data});
      await setting.save();
    }

    res.json({
      status: "success"
    })
  }))

  router.get("/get_setting/:fields", authMaster, task(async (req, res)=>{
    // let setting = await Setting.findOne().sort({createdAt:-1});
    let fields = req.params.fields;
    if(fields != "undefined"){
      fields = fields.split(',');
    }else{
      fields = null;
    }
    let data = await getSetting(fields);

    res.json({
      status: "success",
      data: data
    })
  }))

  router.get("/get_pncinfo/:email", task(async (req, res)=>{
    console.error("###params", req.params);
    let user = await User.findOne({email:req.params.email});
    if(!user){
      res.json({
        status: "fail",
        message: "회원 이메일로 요청해주세요"
      })
      return;
    }

    let data = await getSetting(["pinnacleId", "pinnaclePw"]);
    console.error("pncinfo", data);

    res.json({
      status: "success",
      data: data
    })
  }))

  router.get("/get_country_list", task(async (req, res)=>{
    let setting = await Setting.findOne().sort({createdAt:-1});

    let json;
    if(setting){
      try{
        json = JSON.parse(setting.value['countryJson']);
      }catch(e){
        json = {};
      }
    }

    res.json({
      status: "success",
      data: json
    })
  }))

  router.get("/get_proxy/:code", task(async (req, res)=>{
    let setting = await Setting.findOne().sort({createdAt:-1});
    let code = req.params.code;
    if(!setting){
      res.json({
        status: "fail",
        message: "셋팅 정보를 찾을 수 없습니다."
      })
      return;
    }

    let json;
    // console.log("??", code)
    if(code != "undefined"){
      // console.log("#$%");
      json = {
        zone: setting.value["proxyZone-" + code],
        user: setting.value["proxyUser-" + code],
        pw: setting.value["proxyPw-" + code]
      };
    }else{
      json = {};
      // console.log("!!", setting.value);
      for(let o in setting.value){
        // console.log("-", o);
        if(o.indexOf("proxy") == 0){
          let countryCode = o.split('-').pop();
          // console.log(o.replace("proxy",''));
          // console.log(o.replace("proxy",'').replace('-'+countryCode,''));
          let key = o.replace("proxy",'').replace('-'+countryCode,'').toLowerCase();
          if(!json[countryCode]){
            json[countryCode] = {};
          }
          // console.log(countryCode, key, setting.value[o]);
          json[countryCode][key] = setting.value[o];
        }
      }
    }
    // console.log("####", json);
    // for(let o in setting.value){
    //   if(o.indexOf("proxy") > -1){
    //     json[o] = setting.value[o];
    //   }
    // }

    res.json({
      status: "success",
      data: json
    })
  }))

  router.get("/balance", async (req, res)=>{
    let user = await User.findOne({email:req.user.email}).select(["money", "wallet", "bet365Money"]);
    // console.error("@@@@@@1", user.bet365Money);
    await updateBet365TotalMoney(user);
    // console.error("@@@@@@2", user.bet365Money);
    res.json({
      status: "success",
      data: {
        email: user.email,
        money: user.money,
        wallet: user.wallet,
        bet365Money: user.bet365Money
      }
    })
  })

  router.get("/refreshMoney", async (req, res)=>{
    let user = await User.findOne({email:req.user.email}).select(["money", "wallet", "bet365Money"]);
    await updateBet365TotalMoney(user);
    io.to(user.email).emit("updateMoney", {
      money: user.money,
      wallet: user.wallet,
      bet365Money: user.bet365Money
    });

    res.json({
      status: "success"
    })
  })

  return router;
}
