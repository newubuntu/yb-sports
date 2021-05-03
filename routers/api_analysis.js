module.exports = MD=>{
  let {
    getEventKeyNames,
    getEventKeys,
    getEventKey,
    isLockEvent,
    lockEvent,
    unlockEvent,
    setGameData,
    pullGameData,
    util,
    setRedis,
    getRedis,
    room_checker,
    room_bettor,
    argv,
    redisClient,
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
    BenEvent,
    Proxy,
    Withdraw,
    AccountWithdraw,
    Account,
    Option,
    Approval,
    Setting,
    DepositLog,
    Data,
    BackupHistory,
    authAdmin,
    authMaster,
    task,
    deposit,
    approvalTask,
    refreshTab,
    refreshMoney,
    refreshBet365Money,
    refreshBet365TotalMoney,
    updateBet365Money,
    updateBet365TotalMoney,
    getSetting,
    calc,
    MoneyManager,
    uuidv4
  } = MD;



  let bdhMap = {'<':'$lt', '<=':'$lte', '>':'$gt', '>=':'$gte', '==':'$eq', '!=':'$not'};
  router.post("/get_analysis", authAdmin, task(async (req, res)=>{
    let {
      sports, period,
      emails, range, betTypes, odds1, oddsCon1, odds2, oddsCon2
    } = req.body;
    // let query = {user:req.user._id, event:{$ne:null}, sportName};
    let query = {};

    let $and = [
      {event:{$ne:null}}
    ];

    if(sports && sports.length){
      $and.push({sportName:{$in:sports}});
    }

    // let user;
    // if(admin){
    //   delete query.user;
    //   if(email){
    //     user = await User.findOne({email}).select(["_id", "money"]).lean();
    //     if(user){
    //       // query.user = user._id;
    //       $and.push({user:user._id});
    //     }else{
    //       // query.user = null;
    //       $and.push({user:null});
    //     }
    //   }
    // }else{
    //   $and.push({user:req.user._id});
    // }



    if(oddsCon1 && odds1){
      let q = {};
      q[bdhMap[oddsCon1]] = odds1;
      $and.push({bookmakerOdds:q});
    }

    if(oddsCon2 && odds2){
      let q = {};
      q[bdhMap[oddsCon2]] = odds2;
      $and.push({bookmakerOdds:q});
    }

    if(betTypes && betTypes.length){
      $and.push({betType:{$in:betTypes}});
    }

    if(range){
      // query.createdAt= {
      //   $gte: new Date(range.start),
      //   $lte: new Date(range.end)
      // }
      $and.push({createdAt: {
        $gte: new Date(range.start),
        $lte: new Date(range.end)
      }})
    }

    let groupMap = {
      day: {$dateToString:{ format: "%Y-%m-%d", date: "$createdAt"}},
      week: {$week: "$createdAt"},
      month: {$dateToString:{ format: "%Y-%m", date: "$createdAt"}},
      year: {$dateToString:{ format: "%Y", date: "$createdAt"}}
    }

    // let gm = JSON.parse(JSON.stringify(groupMap[period]));
    // _id = {};
    // if(sports && sports.length){
    //   _id['sports'] = '$sportName';
    // }
    // _id['label'] = groupMap[period];
    // if(period){
    //   period
    // }

    query = {$and};

    console.log("query", query);

    let mainChart = await BetData.aggregate()
    .match(query)
    .group({
      _id: {
        label: groupMap[period]
      },
      siteProfit: {$sum: {
        $cond: [
          {$eq: ["$betStatus", "LOSE"]},
          "$siteStake",
          {$cond:[
            {$or:[
              {$eq:["$betStatus", "REFUNDED"]},
              {$eq:["$betStatus", "CANCELLED"]}
            ]},
            0,
            {$subtract:[0, {$multiply: ["$siteStake", {$subtract:["$siteOdds",1]}]} ]}
          ]}
        ]
      }},
      // bookmakerRisk: {$sum: "$bookmakerStake"},
      bookmakerProfit: {$sum: {
        $cond: [
          {$eq: ["$betStatus", "LOSE"]},
          {$multiply: ["$bookmakerStake", {$subtract:["$bookmakerOdds",1]}]},
          {$cond:[
            {$or:[
              {$eq:["$betStatus", "REFUNDED"]},
              {$eq:["$betStatus", "CANCELLED"]}
            ]},
            0,
            {$subtract:[0,"$bookmakerStake"]}
          ]}
        ]
      }}
    })
    .sort({_id:1});

    let sportsChart = await BetData.aggregate()
    .match(query)
    .group({
      _id: {
        label: groupMap[period],
        key: "$sportName"
      },
      bookmakerProfit: {$sum: {
        $cond: [
          {$eq: ["$betStatus", "LOSE"]},
          {$multiply: ["$bookmakerStake", {$subtract:["$bookmakerOdds",1]}]},
          {$cond:[
            {$or:[
              {$eq:["$betStatus", "REFUNDED"]},
              {$eq:["$betStatus", "CANCELLED"]}
            ]},
            0,
            {$subtract:[0,"$bookmakerStake"]}
          ]}
        ]
      }}
    })
    .sort({_id:1});

    let betTypeChart = await BetData.aggregate()
    .match(query)
    .match({betType:{$ne:null}})
    .group({
      _id: {
        label: groupMap[period],
        key: "$betType"
      },
      bookmakerProfit: {$sum: {
        $cond: [
          {$eq: ["$betStatus", "LOSE"]},
          {$multiply: ["$bookmakerStake", {$subtract:["$bookmakerOdds",1]}]},
          {$cond:[
            {$or:[
              {$eq:["$betStatus", "REFUNDED"]},
              {$eq:["$betStatus", "CANCELLED"]}
            ]},
            0,
            {$subtract:[0,"$bookmakerStake"]}
          ]}
        ]
      }}
    })
    .sort({_id:1});

    // let result = resultObj[0] ? resultObj[0].result : {};
    // result.totalMoney = totalMoney;
    // console.log("aggregate result", mainData);

    res.json({
      status: "success",
      data: {result:{mainChart, sportsChart, betTypeChart}, period}
    });
  }))
}
