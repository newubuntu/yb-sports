const CronJob = require('cron').CronJob;
const PAPI = require('./papi');
let papi;



module.exports = async MD=>{
  let {
    argv,
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
  if(pdata){
    papi = new PAPI(Buffer.from(pdata.pinnacleId + ':' + pdata.pinnaclePw).toString('base64'));
  }else{
    console.error("you must be set pinnacle ID/PW");
  }

  // let cycleTime = 1000 * 60 * 60 * 1;

  // setInterval(process, cycleTime);
  if(argv[0] == "master"){
    console.error("##MASTER");
    // 매시간 15분 마다 이벤트 결과 확인
    let job15m = new CronJob('0 */15 * * * *', function() {
       eventSettledCheckProcess();
    });
    job15m.start();
  }


  // 1일마다 브라우져당 log에서 500개 이상일 때,
  // 마지막 500개를 제외하고 앞에것을 제거하는 스케쥴을 작성


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

  async function eventSettledCheckProcess(){
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

            await betData.resultProcess(MoneyManager, bets.betStatus);
            users[betData.user.email] = betData.user;
          }

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
