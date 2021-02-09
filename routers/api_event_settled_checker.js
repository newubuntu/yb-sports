const CronJob = require('cron').CronJob;
const PAPI = require('./papi');
let papi;



module.exports = async MD=>{
  let {
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
    refreshTab,
    refreshMoney,
    refreshBet365Money,
    refreshBet365TotalMoney,
    updateBet365Money,
    updateBet365TotalMoney,
    getSetting,
    calc,
    MoneyManager
  } = MD;

  let pdata = await getSetting(["pinnacleId", "pinnaclePw"])
  papi = new PAPI(Buffer.from(pdata.pinnacleId + ':' + pdata.pinnaclePw).toString('base64'));

  // let cycleTime = 1000 * 60 * 60 * 1;

  // setInterval(process, cycleTime);
  // 매시간 0분 0초 마다 스케쥴
  let job = new CronJob('0 */15 * * * *', function() {
     process();
  });
  job.start();

  ///// test
  // let user = await User.findOne({email:"asdf1212@gmail.com"});
  // // // change to accepted
  // await BetData.updateMany({user, betStatus:{$ne:"ACCEPTED"}}, {betStatus:"ACCEPTED"});
  // // //// virture bet
  // let list = await BetData.find({user, betStatus:"ACCEPTED"});
  // for(let i=0; i<list.length; i++){
  //   let b = list[i];
  //   await MoneyManager.withdrawMoney(user, b.siteStake, `virture bet (odds:${b.siteOdds}, stake:${b.siteStake})`);
  // }

  async function process(){
    console.log("============ bet result process ============", (new Date()).toLocaleString());
    let list = await BetData.find({betStatus:"ACCEPTED"}).select(["betId", "event"]).lean();
    // 여기서 이미 결과처리 완료된 이벤트가 있으면 어떻게 처리하냐? papi호출전에 정리되는게 맞다.
    // 하지만, 보통 배팅결과처리가 배팅과 비슷한시기에 되지는 않기때문에,,, 괜찮을듯.
    if(list.length == 0) return;

    let ids = list.map(d=>d.betId);
    let results = await papi.getBets({betIds:ids.join()});
    // console.log("results:", results);
    if(Array.isArray(results.straightBets)){
      let users = {};
      for(let i=0; i<results.straightBets.length; i++){
        let bets = results.straightBets[i];
      // results.straightBets.forEach(async bets=>{
        // console.log(bets);
        try{
          await Event.updateOne({_id:bets.uniqueRequestId, betStatus:"ACCEPTED"}, bets);
        }catch(e){
          console.error(e);
        }
        try{
          let list = await BetData.find({betStatus:"ACCEPTED", betId:bets.betId}).populate([
            {
              path: "user",
              model: User
            }
            // ,
            // {
            //   path: "account",
            //   model: Account,
            //   select: "id"
            // }
          ]);
          for(let i=0; i<list.length; i++){
            let betData = list[i];
            // if(bets.price !== betData.siteOdds){
            //   console.log("############################################");
            //   console.log("########피나클 배팅후 배당이 달라짐.##########");
            //   console.log("############################################");
            //   betData.siteOdds = bets.price;
            //   // betData.profit = calc.profit(betData.siteOdds, betData.bookmakerOdds, betData.siteStake, betData.bookmakerStake);
            //   // betData.profitP = calc.profitP(betData.siteOdds, betData.bookmakerOdds);
            //   // event는 위에서 수정되었을것임.
            // }

            // betData.betStatus = bets.betStatus;
            // if(bets.betStatus == "WON"){
            //   console.log(`---- Settled Bet: WON ----`);
            //   console.log(`-- user: ${betData.user.email}`);
            //   // console.log(`-- account: ${betData.account.id}`);
            //   console.log(`-- result: ${betData.siteOdds * betData.siteStake}`);
            //   // betData.user.money += bets.price * betData.siteStake;
            //   await MoneyManager.depositMoney(betData.user._id, betData.siteOdds * betData.siteStake, `bet <span class="text-info">WON</span> result (odds:${betData.siteOdds}, stake:${betData.siteStake})`);
            // }else if(bets.betStatus == "REFUNDED" || bets.betStatus == "CANCELLED"){
            //   console.log(`---- Settled Bet: ${bets.betStatus} ----`)
            //   console.log(`-- user: ${betData.user.email}`);
            //   // console.log(`-- account: ${betData.account.id}`);
            //   console.log(`-- result: ${betData.siteStake}`);
            //   // console.log("TEST:", bets.betStatus, betData.user.money, '+', betData.siteStake);
            //   // betData.user.money += betData.siteStake;
            //   await MoneyManager.depositMoney(betData.user._id, betData.siteStake, `bet <span class="text-warning">${bets.betStatus}</span> result`);
            // }
            // // await betData.user.save();
            // await betData.save();

            await betData.resultProcess(MoneyManager, bets.betStatus);
            users[betData.user.email] = betData.user;
          }

          // if(bets.price !== betData.siteOdds){
          //   console.log("############################################");
          //   console.log("########피나클 배팅후 배당이 달라짐.##########");
          //   console.log("############################################");
          //   betData.siteOdds = bets.price;
          //   betData.profit = calc.profit(betData.siteOdds, betData.bookmakerOdds, betData.siteStake, betData.bookmakerStake);
          //   betData.profitP = calc.profitP(betData.siteOdds, betData.bookmakerOdds);
          //   // event는 위에서 수정되었을것임.
          //   await betData.save();
          // }
          // BetData.updateMany({betId:bets.betId}, updateObj);
          // let betData = await BetData.findOneAndUpdate({betId:bets.betId}, {betStatus:bets.betStatus}, {new:true})
          // .populate([
          //   // {
          //   //   path: "event",
          //   //   model: Event
          //   // },
          //   {
          //     path: "user",
          //     model: User
          //   }
          // ]);
          // // console.log("???????????????", bets)
          //
          //

        }catch(e){
          console.error(e);
        }
      }

      Object.keys(users).forEach(email=>{
        // console.log(email, users[email]);
        // refreshMoney(users[email], true);
        refreshTab(users[email], "/betHistory");
      })
    }
    console.log("===============================================");
  }
}
