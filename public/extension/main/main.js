console.log("main.js");
// let socket = io(SOCKET_URL, { transports: ['websocket'] });
var version = 3;
// log.setSendFunc = sendData;


// function getParam(){
//   let r = {};
//   window.location.href.split('?').pop().split('&').forEach(kv=>{
//     let arr = kv.split('=');
//     r[arr[0]] = arr[1];
//   });
//   return r;
// }
let devMode = false;

let api;
let socket;
let $logCon = $(".log-container");
let $logTemp = $('<div class="log-line"></div>');
let prevLog;
let sameLogCount=0;

if(devMode){
  $logCon.css("display", "none");
}

function log(msg, type, sendToServer){
  let $el;
  let str = msg;
  let isSame;
  if(prevLog == msg){
    isSame = true;
    msg += `(${++sameLogCount})`;
  }else{
    sameLogCount = 0;
  }
  prevLog = str;

  if(devMode){
    if(isSame){
      $el = $($logCon[0].lastElementChild).removeClass("log-info log-warning log-success log-danger log-primary log-null");
    }else if($logCon[0].childElementCount < MAX_LOG_LENGTH){
      $el = $logTemp.clone();
    }else{
      $el = $($logCon[0].firstElementChild).removeClass("log-info log-warning log-success log-danger log-primary log-null");
    }
    if(type){
      $el.addClass('log-' + type);
    }

    let isBottom = $logCon.scrollTop()+$logCon.prop('offsetHeight')+20 >= $logCon.prop('scrollHeight');

    $logCon.append($el.html('<span class="text-secondary">'+(new Date()).toLocaleTimeString() + '</span> ' + msg));
    if(isBottom){
      $logCon.scrollTop($logCon.prop('scrollHeight'));
    }
  }

  console.log("[log]", msg);
  if(sendToServer){
    sendDataToServer("log", {msg, type, isSame, time:Date.now()});
  }
}

function round(n,p=0){
  return Math.round(n * Math.pow(10,p))/Math.pow(10,p);
}

var flag = {
  bet365LoginComplete:false,
  isMatching:false
};
let betOption, optionName;
var account, accountInfo;
//from injection.js (by bg)
async function onMessage(message){
  let {com, data} = message;
  // console.error("inner onMessage", com, data, message);
  let resolveData;
  switch(com){
    case "test":
      resolveData = "test!!";
    break;

    // case "getBetmax":
    //   delay(500).then(()=>{
    //     var f = `var t = document.querySelector(".bss-StakeBox_StakeValueInput");
    //     function inputWithEvent(el, value){
    //     	var event = new CustomEvent("input");
    //     	el.value = value;
    //     	el.dispatchEvent(event);
    //     };inputWithEvent(t, ${data});`
    //     sendData("dev", f, PN_BG);
    //   })
    // break;

    case "log":
      log(data.msg, data.type, true);
      // sendDataToServer("log", data);
    break;

    case "foundLocalhost":
      isCheckingMatch = false;
    break;

    case "bettingFail":
      isCheckingMatch = false;
    break;

    case "bet365LoginComplete":
      // console.error("bet365LoginComplete", data);
      account = data.account;
      // pinnacleId = data.pinnacleId;
      betOption = data.betOption;
      optionName = data.optionName;
      $("#optionName").html(`[${optionName}]`);


      if(betOption.action == "checkBetmax"){
        setupMode("dev");
        requestAnimationFrame(animate);
        document.title = 'type'+betOption.dataType.replace(/[^0-9]/g,'')+ ' ' + (betOption.dataChannel||'1') + "채널";
        if(!(/betburger(1|2)/.test(betOption.dataType))){
          log("체크기 옵션에서 데이터 타입설정이 잘못됐습니다.", "danger", true);
        }
      }else{
        document.title = (betOption.dataChannel||'1') + "채널";
      }

      if(!betOption){
        alert("옵션데이터가 없습니다.");
        return;
      }

      let money = data.money;

      if(betOption.useExchange == 'y'){
        betOption.exchangeRate = await api.exchangeRate(betOption.exchangeCode1, betOption.exchangeCode2);
        log(`환율사용 ${betOption.exchangeCode1}->${betOption.exchangeCode2} : ${betOption.exchangeRate}`, 'info', true);

        // 벳삼 loadMoney에 환율적용부분이 있지만, 벳삼 로긴시점에는 betOption이 없는상태라 원래 통화로온다.
        // 여기서 바꾸자
        // // to usd
        money *= betOption.exchangeRate;
        money = round(money, 2);
      }

      sendData("setBetOption", {betOption}, PN_B365, true);

      log(`벳365 (${account.id}) 로그인 완료. 잔액: ${money}`, null, true);
      sendDataToServer("updateMoney", money);

      flag.bet365LoginComplete = true;
      // startPulling();
      if(!flag.isMatching){
        log('매칭을 시작하려면 <span class="text-success">[매칭시작]</span>을 눌러주세요', "warning", true);
      }
    break;

    case "isMatching":
      resolveData = flag.isMatching;
    break;



    // case "afterAccept":
    //   data.odds
    // break;
  }
  return resolveData;
}

function activeBet365(){
  sendData("activeBet365", null, PN_BG, true);
}

function activeMain(){
  sendData("activeMain", null, PN_BG, true);
}

function sendDataToProgram(com, data){
  socket.emit(com, data, BID);
}

function sendDataToServer(com, data){
  socket.emit("toServer", {com, data, bid:BID});
}

function sendDataToSite(com, data){
  socket.emit("toSite", {com, data, bid:BID});
}

function sendDataToServerPromise(com, data){
  return emitPromise("toServer", {com, data, bid:BID});
}

function sendDataToSitePromise(com, data){
  return emitPromise("toSite", {com, data, bid:BID});
}

function emitPromise(com, data){
  let id = uuid.v4();
  socket.emit(com, data, id);
  return new Promise(resolve=>{
    resolveList[id] = resolve;
  })
}

// async function onSocketMessage(com, args){
//   let resolveData;
//   switch(com){
//     case "connect":
//       console.log("socket connected");
//       let data = {bid:params.bid, email:params.email};
//       socket.emit("initMainPage", data);
//       // sendSocketData("loadBrowserInfo", data);
//       sendData("loadBrowserInfo", data, "bg");
//     break;
//   }
//   return resolveData;
// }

let messagePromises = {};

function setupOnMessage(){
  window.addEventListener("message", async message=>{
    if(message.data.isInner) return;


    let {com, data, to, from, _code, _rcode} = message.data;

    if(to === "program"){
      sendDataToProgram(com, data);
    }else if(to === "server"){
      sendDataToServer(com, data);
    }else if(to === "site"){
      sendDataToSite(com, data);
    }else{
      let resolveData = await onMessage(message.data);

      if(_code){
        // console.log("??sendResolveData", _code, resolveData, from);
        sendResolveData(_code, resolveData, from);
      }else if(_rcode && messagePromises[_rcode]){
        messagePromises[_rcode](data);
      }
    }
  });
}

let matchButtonDownTime = 0;
$("#matchButton, #matchButton2").on("click", e=>{
  if(!flag.bet365LoginComplete){
    // log("벳365 로그인 중입니다.");
    return;
  }
  if(Date.now() - matchButtonDownTime > 300){
    matchButtonDownTime = Date.now();
    if(flag.isMatching){
      stopMatch(true);
    }else{
      startMatch(true);
    }
  }
})

function updateMatchButtonState(){
  if(flag.isMatching){
    $(".icon").addClass("active");
    $("#matchButton2").addClass("active");
    $("#matchButton").removeClass("btn-success").addClass("btn-warning").html("매칭중지");
  }else{
    $(".icon").removeClass("active");
    $("#matchButton2").removeClass("active");
    $("#matchButton").removeClass("btn-warning").addClass("btn-success").html("매칭시작");
  }
}

function sendResolveData(_code, data, to){
  window.postMessage({_rcode:_code, data, to, from:PN_MAIN, isInner:true}, "*");
}

function sendData(com, data, to, noResolve){
  if(!to){
    to = PN_BG;
  }
  let msg = {com, data, to, from:PN_MAIN, isInner:true};
  if(noResolve){
    console.log("sendData", msg);
    window.postMessage(msg, "*");
    return;
  }
  // console.log("sendData", com, data, to);
  let mid = guid();
  let _code = com+'@'+mid;
  msg._code = _code;
  console.log("sendData", msg);
  window.postMessage(msg, "*");
  return new Promise(resolve=>{
    messagePromises[_code] = (d)=>{
      delete messagePromises[_code];
      resolve(d);
    }
  })
}

// timeout버전
let isGetBetsTimeout, pncPlaceBetCancelFlag;
async function getBets(betData, timeout=0){
  isGetBetsTimeout = false;
  pncPlaceBetCancelFlag = false;
  if(betData.status == "PENDING_ACCEPTANCE"){
    log(`배팅확인중..`, null, true);
    let itv;
    if(timeout>0){
      itv = setTimeout(()=>{
        isGetBetsTimeout = true;
      }, timeout);
    }
    while(1){
      if(pncPlaceBetCancelFlag){
        pncPlaceBetCancelFlag = false;
        betData.straightBet = null;
        betData.status = "CANCEL";
        break;
      }
      if(isGetBetsTimeout){
        isGetBetsTimeout = false;
        betData.straightBet = null;
        betData.status = "TIMEOUT";
        break;
      }
      let bd = await sendData("getBets", betData.uniqueRequestId, PN_BG);
      console.error(bd);
      if(bd.straightBets && bd.straightBets.length){
        if(bd.straightBets[0].betStatus == "PENDING_ACCEPTANCE"){
          await delay(2000);
          log(`배팅확인중..`, null, true);
          continue;
        }
        // betData
        // return bd.straightBets[0];
        betData.straightBet = bd.straightBets[0];
        betData.status = "ACCEPTED";
        break;
      }
    }
    clearTimeout(itv);
  }
  // return betData;
}


// NOT_ACCEPTED check 버전
async function getBetsForCount(betData, checkCount){
  if(betData.status == "PENDING_ACCEPTANCE"){
    log(`배팅확인중..`, null, true);
    let c = 0;
    // let isTimeout, itv;
    // if(timeout>0){
    //   itv = setTimeout(()=>{
    //     isTimeout = true;
    //   }, timeout);
    // }
    while(1){
      let bd = await sendData("getBets", betData.uniqueRequestId, PN_BG);
      console.error(bd);
      if(bd.straightBets && bd.straightBets.length){
        if(++c<=checkCount && bd.straightBets[0].betStatus == "PENDING_ACCEPTANCE"){
          await delay(2000);
          log(`배팅확인중..`, null, true);
          continue;
        }
        // betData
        // return bd.straightBets[0];
        betData.straightBet = bd.straightBets[0];
        betData.status = "ACCEPTED";
        break;
      }
    }
  }
  // return betData;
}

async function placeBet(line){
  if(line.lineData.status == "SUCCESS"){
    /// test
    // await delay(2000);
    // return {
    //   status: "fail",
    //   message: "TEST"
    // }
    ///

    console.error("wait bets");
    log(`피나클 배팅시작: $${line.lineData.minRiskStake}`, "info", true);
    let bets = await sendData("placeBet", line, PN_BG);
    console.error({bets});
    if(betOption.pncBetCheckType == "half"){
      await getBetsForCount(bets.betData, 3);
    }else{
      await getBets(bets.betData, 25000);
    }
    line.betData = bets.betData;
    if(bets.betData){
      if(bets.betData.status == "ACCEPTED"){
        let chk;
        switch(bets.betData.straightBet.betStatus){
          case "CANCELLED":
            log(`피나클 배팅실패. 취소됨. ${bets.betData.straightBet.betStatus}`, "danger", true);
          break;

          case "REFUNDED":
            log(`피나클 배팅실패. 환불됨. ${bets.betData.straightBet.betStatus}`, "danger", true);
          break;

          case "NOT_ACCEPTED":
            log(`피나클 배팅실패. 허용되지 않음. ${bets.betData.straightBet.betStatus}`, "danger", true);
          break;

          // checkCount방식일때만
          case "PENDING_ACCEPTANCE":
            if(betOption.pncBetCheckType == "half"){
              chk = true;
              console.error("피나클 배팅성공", bets.betData.straightBet);
              if(bets.betData.straightBet.price){
                log(`피나클 배팅성공. odds: ${bets.betData.straightBet.price}, betId:${bets.betData.straightBet.betId}`, "success", true);
              }else{
                log(`피나클 배팅성공.`, "success", true);
              }
            }
          break;

          case "ACCEPTED":
            chk = true;
            console.error("피나클 배팅성공", bets.betData.straightBet);
            if(bets.betData.straightBet.price){
              log(`피나클 배팅성공. odds: ${bets.betData.straightBet.price}, betId:${bets.betData.straightBet.betId}`, "success", true);
            }else{
              log(`피나클 배팅성공.`, "success", true);
            }
          break;

          default:
            console.error("예상치 못한 배팅 상태", bets.betData.straightBet);
            log(`예상치 못한 배팅 상태 ${bets.betData.straightBet}`, "danger", true);
        }

        // sendDataToServer("betData", {pinnacleId, account:account._id, data:bets.betData.straightBet});
        return {
          status: chk ? "success" : "fail",
          data: bets.betData.straightBet
        };
      }else if(bets.betData.status == "PROCESSED_WITH_ERROR"){
        // log(`피나클 배팅실패: ${bets.betData.errorCode} ${bets.betData.errorMessage}`, "danger", true);
        log(`피나클 배팅실패: ${bets.betData.errorCode}`, "danger", true);
      }else{
        switch(bets.betData.status){
          case "TIMEOUT":
            log(`피나클 배팅실패. 시간초과.`, "danger", true);
          break;

          case "CANCEL":
            log(`피나클 배팅취소시킴.`, "danger", true);
          break;

          default:
            log(`피나클 배팅실패: ${bets.betData.status}`, "danger", true);
        }
      }
    }
  }
  return {
    status: "fail"
  }
}

function round(n,p=0){
  return Math.round(n * Math.pow(10,p))/Math.pow(10,p);
}

function printPercent(n){
  return round(n*100,2) + '%';
}

function validProfitP(oddsA, oddsB, noLog){
  let profitP = calc.profitP(oddsA, oddsB, 1);

  if(profitP < betOption.minProfitP/100){
    if(!noLog){
      log(`수익률 <span class="text-danger">${printPercent(betOption.minProfitP/100)} 미만(${printPercent(profitP)})</span>`, null, true);
    }
    return false;
  }

  if(profitP > betOption.maxProfitP/100){
    if(!noLog){
      log(`수익률 <span class="text-danger">${printPercent(betOption.maxProfitP/100)} 초과(${printPercent(profitP)})</span>`, null, true);
    }
    return false;
  }

  if(!noLog){
    log(`수익률: <span class="text-info">${printPercent(profitP)}</span>`, null, true);
  }
  return true;
}

function validProfit(oddsA, oddsB, stakeA, noLog){
  let profit = calc.profit(oddsA, oddsB, stakeA);

  if(profit < betOption.minProfit){
    if(!noLog){
      log(`수익 <span class="text-danger">$${round(betOption.minProfit,2)} 미만($${round(profit,2)})</span>`, null, true);
    }
    return false;
  }

  if(profit > betOption.maxProfit){
    if(!noLog){
      log(`수익 <span class="text-danger">$${round(betOption.maxProfit,2)} 초과($${round(profit,2)})</span>`, null, true);
    }
    return false;
  }

  if(!noLog){
    log(`수익: <span class="text-info">$${round(profit,2)}</span>`, null, true);
  }
  return true;
}

function hasEventMark(id){
  return !!getData(id);
}

function getEventMark(id){
  let em = getData(id);
  if(!em){
    em = {
      lineFindFailCount: 0
      // profitMatchFailCount: 0
    };
    setData(id, em);
  }
  return em;
}

var eventKeyGetter = {
  PK: function(){return this.data.pinnacle.id},
  POK: function(){return this.data.pinnacle.id + this.data.pinnacle.odds},
  BK: function(){return this.data.bet365.id},
  BOK: function(){return this.data.bet365.id + this.data.bet365.odds},
  //origin bet365 event id + odds  key
  // OBOK: data.bet365.eventId + data.bet365.odds,
  OBOK: function(){return this.data.bet365.bookmakerDirectLink + this.data.bet365.odds},
  //origin bet365 event id + odds + id  key
  // OBOIK: data.bet365.eventId + data.bet365.odds + account.id,
  // OBOIK: data.bet365.bookmakerDirectLink + data.bet365.odds + account.id,
  // matchId: data.pinnacle.id + ':' + data.bet365.id
  EK: function(){return this.data.pinnacle.arbHash},
  EBOK: function(){return this.data.pinnacle.arbHash + this.data.bet365.odds},
  EPOK: function(){return this.data.pinnacle.arbHash + this.data.pinnacle.odds}
}

Object.defineProperty(eventKeyGetter, "data", {
  value: null,
  enumerable: false,
  writable: true
})

function getEventKeyNames(){
  return Object.keys(eventKeyGetter);
}

function getEventKey(data, keyName){
  if(eventKeyGetter[keyName]){
    eventKeyGetter.data = data;
    return eventKeyGetter[keyName]();
  }
  return null;
}

function getEventKeys(data){
  eventKeyGetter.data = data;
  return Object.keys(eventKeyGetter).reduce((r,key)=>{
    r[key] = eventKeyGetter[key]();
    return r;
  },{})
  // return {
  //   PK: data.pinnacle.id,
  //   POK: data.pinnacle.id + data.pinnacle.odds,
  //   BK: data.bet365.id,
  //   BOK: data.bet365.id + data.bet365.odds,
  //   //origin bet365 event id + odds  key
  //   // OBOK: data.bet365.eventId + data.bet365.odds,
  //   OBOK: data.bet365.bookmakerDirectLink + data.bet365.odds,
  //   //origin bet365 event id + odds + id  key
  //   // OBOIK: data.bet365.eventId + data.bet365.odds + account.id,
  //   OBOIK: data.bet365.bookmakerDirectLink + data.bet365.odds + account.id,
  //   // matchId: data.pinnacle.id + ':' + data.bet365.id
  //   EK: data.pinnacle.betburgerEventId,
  //   EBOK: data.pinnacle.betburgerEventId + data.bet365.odds,
  //   EPOK: data.pinnacle.betburgerEventId + data.pinnacle.odds,
  // }
}

// function benEventToServer(key, time, msg){
//   api.benEvent()
// }


function benEvent(data, key, time, msg, sendServer){
  // let ids = getEventIds(data);
  // let id = ids[key];
  let id = getEventKey(data, key);
  if(time <= 0){
    console.log("이벤트 영구제외", key, id);
    log(`이벤트 영구제외: ${msg?msg:''}`, "warning", true);
  }else{
    console.log("이벤트 제외", round(time/1000,1)+"초", key, id);
    log(`이벤트 ${round(time/1000,1)}초 제외: ${msg?msg:''}`, "warning", true);
    setTimeout(()=>{
      clearBenEvent(id);
    },time);
  }
  getEventMark(id).ben = true;
  if(sendServer){
    api.benEvent({id, dataType:betOption.dataType, betburgerEventId:data.bet365.betburgerEventId, time, msg});
  }
}

function clearBenEvent(id){
  if(hasEventMark(id)){
    getEventMark(id).ben = false;
  }
}


function isBenEvent(data, keyName){
  let id;
  if(arguments.length==1){
    if(typeof data === "string"){
      id = data;
    }
  }else{
    // let ids = getEventIds(data);
    // id = ids[keyName];
    id = getEventKey(data, keyName);
  }
  if(id){
    return hasEventMark(id) && (!!getEventMark(id).ben);
  }
}

// function lineFindFailCount(id){
//   return getEventMark(id).lineFindFailCount;
// }
//
// function lineFindFailCountUp(id){
//   return ++getEventMark(id).lineFindFailCount;
// }

// function profitMatchFailCountUp(id){
//   return ++getEventMark(id).profitMatchFailCount;
// }

var isCheckingMatch = false;
var isWaiting = false;
async function findMatch(data){
  if(isCheckingMatch){
    return;
  }
  // let data = getNextData();
  log(`매칭확인중..`, null, true);
  // && data.pinnacle.sports == "Soccer"
  if(data){
    if(!dataFilter(data)){
      data = null;
      return;
    }
    // data.bet365.betLink = data.bet365.betLink.replace("/dl/sportsbookredirect?", "/dl/sportsbookredirect/?");
    // console.error("betLink test", data.bet365.betLink);

    data.bet365.originOdds = data.bet365.odds;

    isCheckingMatch = true;
    if(betOption.action == "checkBetmax"){
      let f = await checkBetmaxProcess(data);
      if(!f){
        activeMainEveryBrowser(data.bet365.isLive);
      }else{
        /// test
        // stopMatch(true);
        ///
      }

    }else if(betOption.action == "vl"){
      // 고정 betmax로 벨류
      // await vlProcess(data);
      console.error("준비되지 않은 처리:", betOption.action);
    }else{
      console.error("준비되지 않은 처리:", betOption.action);
    }
    isCheckingMatch = false;
    // log('이벤트 수신 대기중', "primary", true);
  }
}

let currentGameData;
async function findMatch2(data){
  console.error("findMatch2", {isCheckingMatch});
  if(isCheckingMatch){
    return;
  }

  currentGameData = data;


  // let data = getNextData();
  // && data.pinnacle.sports == "Soccer"
  if(data){

    if(!dataFilter(data.betburger)){
      data = null;
      return;
    }

    data.betburger.bet365.originOdds = data.betburger.bet365.odds;

    isCheckingMatch = true;
    if(betOption.action == "yb"){
      await userYbProcess(currentGameData.betburger);
    }else if(betOption.action == "vl"){
      //betmax로 벨류
      await userVlProcess(currentGameData.betburger);
      // console.error("준비되지 않은 처리:", betOption.action);
    }else{
      console.error("준비되지 않은 처리:", betOption.action);
    }

    isCheckingMatch = false;
    // log('이벤트 수신 대기중', "primary", true);
  }
}

function exceptEventCheckByFomula(data){
  if(data && Array.isArray(betOption.exceptEventConditions)){
    let cdts = betOption.exceptEventConditions;
    for(let i=0; i<cdts.length; i++){
      let cmd = generateExceptionFomula(cdts[i]);
      cmd = cmd.replace(/\(\{\}\)/g, "data.bet365");
      // console.error("cmd", cmd);
      let chk = eval(cmd);
      if(chk){
        console.error("event exception fomula check:", cmd, chk);
        return cmd;
      }
    }
  }
}

function dataFilter(data){
  // if(!data) return false;

  let ids = getEventKeys(data);
  for(let key in ids){
    if(isBenEvent(ids[key])){
      console.log(`제외된 이벤트: ${key} ${ids[key]}`);
      return false;
    }
  }

  // if(betOption.sports){
  //   if(!betOption.sports[data.bet365.sports.toLowerCase().trim()]){
  //     console.log(`제외된 종목: ${data.bet365.sports}`);
  //     return false;
  //   }
  // }

  if(exceptEventCheckByFomula(data)){
    return false;
  }

  return true;
}

function generateExceptionFomula(list){
  return list.map(item=>{
    if(item.vType == "string"){
      return `'${item.value}'`;
    }else if(item.vType == "var"){
      return `({}).${item.value}`
    }else{
      return item.value;
    }
  }).join('');
}

function getNextData(){
  let d = getData("gamedata");
  let data;
  while(1){
    data = d.shift();
    if(data){
      // #1 타입확인
      // #2 옵션적용 필터링
      if(Array.isArray(data)){
        data = data.reduce((r,v)=>{
          r[v.bookmaker] = v;
          return r;
        }, {})
      }

      // console.error("data", data);

      if(!dataFilter(data)){
        data = null;
        continue;
      }

      // let ids = getEventIds(data);
      // let out;
      // for(let key in ids){
      //   if(isBenEvent(ids[key])){
      //     console.log(`제외된 이벤트: ${key} ${ids[key]}`);
      //     out = true;
      //     break;
      //   }
      // }
      //
      // if(!out){
      //   if(betOption.sports){
      //     if(!betOption.sports[data.bet365.sports.toLowerCase().trim()]){
      //       console.log(`제외된 종목: ${data.bet365.sports}`);
      //       out = true;
      //     }
      //   }
      // }
      //
      // if(out){
      //   continue;
      // }

      break;
      // return data;
    }else{
      break;
    }
  }

  return data;
}

function getStakeRatio(){
  if(accountInfo && accountInfo.limited){
    return 0.9;
  }

  let stakeRatio = 1;
  let p = parseFloat(betOption.stakeRatioP);
  if(!isNaN(p)){
    try{
      stakeRatio = p / 100;
    }catch(e){
      console.error(e);
    }
  }
  return stakeRatio;
}

function reCalcStake(data, odds){
  data.bet365.stake = calcBetmax(data.bet365.betType, odds) * getStakeRatio();
  if(betOption.useFloorStake == "y"){
    data.bet365.stake = Math.floor(data.bet365.stake);
  }else{
    data.bet365.stake = round(data.bet365.stake, 2);
  }
  updatePncStake(data);
}

async function commonProcess(data, noCheckBalance){
  let emptyObj = {};
  console.log(data);
  // let ids = getEventIds(data);
  printGame(data);

  if(!noCheckBalance){
    if(!(await checkBalance())){
      stopMatch(true);
      return emptyObj;
    }
  }

  let bet365Info, checkProfit, checkType;

  //// test
  // setBet365RandomStake(data, data.bet365.stake);
  // checkProfit = profitAllValidation(data);
  // return {checkProfit};
  ///


  bet365Info = await new Promise(resolve=>{
    let t;
    let itv = setTimeout(()=>{
      t = true;
      log(`벳365 반응없음`, "danger", true);
      resolve(null);
    }, 30000);

    openBet365AndGetInfo(data).then(info=>{
      clearTimeout(itv);
      if(!t){
        resolve(info);
      }
    })
  })
  // bet365Info = await openBet365AndGetInfo(data);
  if(!bet365Info){
    return emptyObj;
  }

  if(!bet365Info.logged){
    log("벳365 로그아웃 됨. 재 로그인 시도 중..", "danger", true);
    // activeBet365();
    // let m = await sendData("reLogin", null, PN_B365);
    // activeMain();
    let m = await reLogin();
    if(m == null){
      log("재 로그인 실패. 브라우져를 다시 켜주세요.", "danger", true);
      stopMatch(true);
      return emptyObj;
    }else{
      log("벳365 재로그인 완료. 링크 다시 여는중..", null, true);
      bet365Info = await openBet365AndGetInfo(data, true);
      if(!bet365Info){
        return emptyObj;
      }
    }
  }

  // 체크기에서 이미 검증된 내용은 다시 검사하지 말자
  // if(!checkBet365TeamName(data, bet365Info)){
  //   log(`배팅취소: 벳삼 팀이름 다름`, "danger", true);
  //   return emptyObj;
  // }

  checkType = await checkGameType(data, bet365Info, false);

  if(!checkType){
    //: 벳삼 타입 다름
    log(`배팅취소: 벳삼 타입다름`, "danger", true);
    benEvent(data, "BK", 0, '', true);
    return emptyObj;
  }

  if(checkLakeMoney(data, bet365Info.money)){
    sendDataToSite("sound", {name:"lakeBet365Money"});
    return emptyObj;
  }

  let res = await api.loadAccountInfo(account.id);
  if(res.status == "success"){
    accountInfo = res.data.account;
    if(!accountInfo){
      log(`계정정보 로딩 실패`, "danger", true);
      // stopMatch(true);
      return emptyObj;
    }
  }

  let oStake = data.bet365.stake;

  reCalcStake(data, data.bet365.odds);

  let stakeRatio = 1;
  if(!accountInfo.limited){
    // if(betOption.stakeRatioP !== undefined){
      stakeRatio = getStakeRatio();
      if(stakeRatio != 1){
        log(`stake 증폭: ${round(oStake, 2)}->${data.bet365.stake} (${round(stakeRatio*100)}%)`, null, true);
      }
    // }
  }else{
    log("리밋계정 증폭적용 X", "warning", true);
  }

  if(checkFallOdds(data)){
    benEvent(data, "OBOK", 20000, "떨어진 배당", true);
    return;
  }





  changeOddsBet365Process(data, bet365Info.odds);
  // if(changeOddsBet365Process(data, bet365Info.odds)){
  //   // updateBet365Stake(data);
  //   updatePncStake(data);
  // }


  if(!checkOddsForBet365(data)){
    log(`배팅취소`, "danger", true);
    benEvent(data, "OBOK", 20000, "벳삼 최소배당 미만", true);
    return emptyObj;
  }



  setBet365RandomStake(data, data.bet365.stake);
  checkProfit = profitAllValidation(data);

  return {bet365Info, checkProfit, checkType};
}

function padEnd0(n,c=2){
  if(typeof n === "number"){
    n = n.toString();
  }
  return n.replace(/\.(\d+)/, function(f,m){
    return '.' + m.padEnd(c, '0');
  })
}

async function bet365PlacebetProcess(data, bet365Info, isDirect=true){
  activeBet365();

  /// test
  // let emptyObj = {};
  // let betData = currentGameData.bookmaker.betData;
  // console.error({betData});
  // let stake = round(data.bet365.stake, 2);
  // let rt = round(data.bet365.stake * data.bet365.odds, 2);
  // betData.data.ns = betData.data.ns.replace(/st=(\d+(?:\.\d+)?)/g, "st="+padEnd0(stake));
  // betData.data.ns = betData.data.ns.replace(/tr=(\d+(?:\.\d+)?)/, "tr="+padEnd0(rt));
  // let r = await sendData("placeBetTest", betData, PN_B365);
  // console.log("r", r);
  //
  // activeMain();
  // return emptyObj;
  ///

  if(accountInfo){
    if(accountInfo.limited){
      let dt = betOption.limitBetDelay || 3;
      let rt = Math.random() * dt;
      log(`리밋계정 랜덤 딜레이 적용 (${round(rt, 1)}초/${dt}초)`, "warning", true);
      await delay(rt * 1000);
    }
  }

  // log(`벳365 배팅시작`, "info", true);
  let result, checkBet, isChangeOdds, isFirst = true, lakeMoney, fixedBetmax, everBeenFixedBetmax;
  let checkProfit = true, checkType, noChangeOddsAcceptCount = 0, noReturnCount = 0;
  while(1){
    if(checkProfit){
      if(isChangeOdds || isFirst){
        isFirst = false;
        isChangeOdds = false;
        log(`벳365 배팅시작 <span class="text-warning">$${data.bet365.stake}</span>`, "info", true);
      }

      // BOK
      // if(isBenEvent(data.bet365.id+data.bet365.odds)){
      // OBOK
      // if(isBenEvent(data.bet365.eventId+data.bet365.odds)){
      //   log(`제외된 배당입니다.(${data.bet365.eventId+data.bet365.odds})`, "warning", true);
      //   break;
      // }

      if(!checkOddsForBet365(data)){
        benEvent(data, "OBOK", 20000, "벳삼 최소배당 미만", true);
        break;
      }

      if(result){
        checkType = await checkGameType(data, result.info, false);
        if(!checkType){
          //: 벳삼 타입 다름
          log(`벳365 배팅실패: 벳삼 타입다름`, "danger", true);
          benEvent(data, "BK", 0, '', true);
          break;
        }
      }

      if(isBenEvent(data, "OBOK")){
        log(`제외된 배당입니다(odds:${data.bet365.odds})`, "warning", true);
        break;
      }

      let fm;
      if((fm=exceptEventCheckByFomula(data))){
        log(`제외 조건입니다.(${fm})`, "danger", true);
        break;
      }

      // await delay(Math.random()*1000);
      /// test
      let betData = currentGameData.bookmaker.betData;
      // console.error({betData});
      // let stake = round(data.bet365.stake, 2);
      // let rt = round(data.bet365.stake * data.bet365.odds, 2);
      let od;
      if(result && result.info && result.info.od){
        od = result.info.od;
        // betData.data.ns = betData.data.ns.replace(/#o=(\d+\/\d+)/, function(f,m){
        //   return "#o=" + result.info.od;
        // })
      }
      // betData.data.ns = betData.data.ns.replace(/st=(\d+(?:\.\d+)?)/g, "st="+padEnd0(stake));
      // betData.data.ns = betData.data.ns.replace(/tr=(\d+(?:\.\d+)?)/, "tr="+padEnd0(rt));
      let stake = data.bet365.stake;
      if(betOption.useFloorStake == "y"){
        stake = Math.floor(data.bet365.stake);
        log(`소수점 절삭: ${data.bet365.stake} -> ${stake}`, null, true);
      }

      if(stake < 1){
        log("배팅취소: stake가 1보다 작음", "danger", true);
        break;
      }

      // let accountInfo;
      // let res = await api.loadAccountInfo(account.id);
      // if(res.status == "success"){
      //   accountInfo = res.data.account;
      // }

      if(isDirect){
        result = await sendData("placeBetDirect", {stake, odds:data.bet365.odds, betData, od, account:accountInfo}, PN_B365);
      }else{
        result = await sendData("placeBet", {fixedBetmax, data:data.bet365, stake:data.bet365.stake, prevInfo:bet365Info}, PN_B365);
      }

      console.log("result", result);

      fixedBetmax = false;
      if(result && result.info){
        bet365Info = result.info;
      }
      console.log("bet365 betting..", result);
      if(result === undefined || result === null){
        log("벳365 배팅실패: 응답없음.", "danger", true);
        break;
      }

      // 배팅완료한뒤에는 체크하지 말자.
      // checkType = await checkGameType(data, result.info);
      // if(!checkType){
      //   log(`배팅취소: 벳삼 타입 다름`, "danger", true);
      //   benEvent(data, "BK", 0);
      //   if(result.status == "success"){
      //     log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", "danger", true);
      //     log(`벳365 배팅완료 후 타입바뀜!`, "danger", true);
      //     stopMatch(true);
      //   }
      //   break;
      // }
      if(result.status == "notEnoughFunds"){
        log(`벳365 배팅실패: ${result.message}`, "danger", true);
        stopMatch(true);
        break;
      }else if(result.status == "noReturn"){
        // api배팅. 리턴값없을때. 다시시도해보자
        noReturnCount++;
        if(noReturnCount > 3){
          log(`벳365 배팅실패: 배팅응답없음`, "danger", true);
          break;
        }else{
          log(`벳365 배팅응답없음. 다시시도(${noReturnCount})`, "danger", true);
          await delay(200);
        }
      }else if(result.status == "foundBetmax"){
        changeOddsBet365Process(data, result.info.odds);
        data.bet365.stake = result.betmax;
        updatePncStake(data);
        // setBet365RandomStake(data, result.betmax);
        fixedBetmax = true;
        everBeenFixedBetmax = result.betmax;

        // api.limitAccount(account.id);
        if(!accountInfo.limited){
          sendDataToServer("updateAccountState", {id:account.id, state:"limited"});
        }

        //#210508 더이상 리밋계정배팅을 진행하지 않는다. localhost이슈
        // 리밋이 될때가있으므로 일단은 진행은 막지않는다.
        // break;
      }else if(result.status == "acceptChange"){
        // let prevOdds = data.bet365.odds;
        noReturnCount = 0;
        if(result.info){
          isChangeOdds = changeOddsBet365Process(data, result.info.odds);
          if(isChangeOdds){
            if(checkFallOdds(data)){
              benEvent(data, "OBOK", 20000, "떨어진 배당", true);
              break;
            }
            noChangeOddsAcceptCount = 0;
            // updateBet365Stake(data);
            checkProfit = profitAllValidation(data);
          }else{
            noChangeOddsAcceptCount++;
            // console.error("noChangeOddsAcceptCount", noChangeOddsAcceptCount);
            // console.error("result.status", result.status);

            if(noChangeOddsAcceptCount >= 7){
              // 배당이 안바뀐 accept버튼이 3회 이상 출현시 해당 이벤트를 OBOIK벤
              log(`벳365 배팅실패: 배팅 막힘`, "danger", true);
              benEvent(data, "OBOK", 0, "배팅 막힘", true);
              break;
            }else{
              log(`벳365 같은배당 acceptChange. 다시시도(${noChangeOddsAcceptCount})`, "danger", true);
              await delay(3000);
            }
          }
        }else{
          isChangeOdds = true;
        }
      }else if(result.status == "lakeMoney"){
        log(`벳365 잔액부족 stake:$${result.stake}, money:$${result.money}`, "danger", true);
        changeOddsBet365Process(data, result.info.odds);
        data.bet365.stake = result.money;
        updatePncStake(data);
        checkProfit = profitAllValidation(data);
        lakeMoney = true;
      }else if(result.status == "success"){
        if(result.info && result.info.market == ""){
          log(`배팅취소: 배팅카트 사라짐`, "danger", true);
        }else{
          let ogodds = data.bet365.odds;
          if(changeOddsBet365Process(data, result.info.odds)){
            log(`벳365 배팅완료 후 배당바뀜 (originOdds: ${ogodds}, odds:${result.info.odds}, stake:${result.stake})`, "success", true);
          }else{
            log(`벳365 배팅완료! (odds:${result.info.odds}, stake:${result.stake})`, "success", true);
          }
          checkBet = true;
        }
        break;
      }else{
        log(`벳365 배팅실패: ${result.message}`, "danger", true);
        if(result.status == "restriction"){
          // api.dieAccount(account.id);
          sendDataToServer("updateAccountState", {id:account.id, state:"died"});
          sendDataToSite("sound", {name:"closureAccount"});
          stopMatch(true);
        }else if(result.status == "needVerify"){
          stopMatch(true);
        }
        break;
      }
    }else{
      log(`배팅취소`, 'danger', true);
      break;
    }
  }

  if(!accountInfo.limited && everBeenFixedBetmax){
    log(`벳365 계정 짤림 betmax: ${everBeenFixedBetmax}`, "danger", true);
    sendDataToSite("sound", {name:"limitAccount"});
    stopMatch(true);
  }

  activeMain();
  console.log("bet365 bet result", result);

  if(checkBet){
    if(result.money){
      // sendDataToServer("updateMoney", result.money - result.stake);
      // bet365 money load방식이 바뀌면서 배팅하고 남은금액이온다.
      sendDataToServer("updateMoney", result.money);
    }
    sendDataToServer("addBetCount", {id:account.id});
    benEvent(data, "OBOK", 0, `배팅완료`, !data.bet365.isLive);
  }

  // if(noChangeOddsAcceptCount >= 3){
  //   // 배당이 안바뀐 accept버튼이 3회 이상 출현시 해당 이벤트를 OBOIK벤
  //   // log(`벳365 배팅실패: 리밋계정 막힌 이벤트`, "danger", true);
  //   benEvent(data, "OBOIK", 0, "리밋계정 막힌 이벤트");
  // }

  return {checkBet, lakeMoney, result};
}



// 유저 벨류 처리
async function userVlProcess(data){
  let {bet365Info, checkProfit, checkType} = await commonProcess(data, true);
  activeMain();

  if(checkProfit){
    if(!flag.isMatching) return;
    let {checkBet, lakeMoney, result} = await bet365PlacebetProcess(data, bet365Info, false);

    if(checkBet){
      sendDataToSite("sound", {name:"coin1"});
    }

    if(lakeMoney){
      stopMatch(true);
      sendDataToSite("sound", {name:"lakeBet365Money"});
      return;
    }
  }else{
    log(`배팅취소`, 'danger', true);
    return;
  }
}



// 유저 양빵 처리
async function userYbProcess(data){
  let {bet365Info, checkProfit, checkType} = await commonProcess(data);
  activeMain();

  if(checkProfit){
    if(!flag.isMatching) return;
    let {checkBet, lakeMoney, result} = await bet365PlacebetProcess(data, bet365Info, false);

    if(checkBet){
      // 사이트 배팅
      log(`피나클 배팅시작 <span class="text-warning">$${data.pinnacle.stake}</span>`, "info", true);
      // 배팅정보 저장
      let res = await api.bet({
        account: account._id,
        // accountId: account.id,
        event: currentGameData._id,
        betId: currentGameData.betId,
        siteOdds: data.pinnacle.odds,
        siteStake: data.pinnacle.stake,
        bookmakerOdds: data.bet365.odds,
        bookmakerStake: data.bet365.stake,
        bookmaker: result
      })
      if(res.status == "success"){
        log(`피나클 배팅완료!`, "success", true);
        // benEvent(data, "OBOK", 0, "배팅완료");
      }else{
        log(`피나클 배팅실패: ${res.message}`, "danger", true);
        stopMatch(true);
      }
    }

    //
    sendDataToServer("gamefinish", currentGameData.betId);

    if(lakeMoney){
      stopMatch(true);
      sendDataToSite("sound", {name:"lakeBet365Money"});
      return;
    }
  }else{
    log(`배팅취소`, 'danger', true);
    return;
  }
}





function updateBet365Link(data){
  data.bet365.betLink = data.bet365.betLink.replace(/~(\d+\.?\d*)&/, (origin, found)=>{
    return origin.replace(found, data.bet365.odds);
  })
}

function randomRatio(){
  let start = 0.9;
  let end = 0.95;
  // return Math.random()*0.05+0.95;
  // return Math.random()*0.45+0.5;
  return Math.random() * (end-start) + start;
}

function getMaxBetmax(odds, sports){
  if(betOption.useMaxBetmaxByOdds == 'y' && typeof betOption.maxBetmaxByOdds === "object"){
    let obj = betOption.maxBetmaxByOdds;
    // let odds = data.bet365.odds;
    let i=1;
    while(1){
      let a = obj['odds'+i];
      if(a){
        if(odds >= a[0] && odds <= a[1]){
          console.error('조건부 betmax', a, obj['betmax'+i]);
          return obj['betmax'+i];
        }
      }else{
        break;
      }
      i++;
    }
  }

  switch(sports){
    case "Soccer":
      return betOption.maxBetmaxForSoccer || betOption.maxBetmax;

    case "Basketball":
      return betOption.maxBetmaxForBasketball || betOption.maxBetmax;

    default:
      return betOption.maxBetmax;
  }
}

function updateBet365Stake(data){
  //#210508
  data.bet365.stake = round(calc.stakeB(data.pinnacle.odds, data.bet365.odds, data.pinnacle.stake), 2);


  // 유저 양빵단계의 벳삼 배당 변동시에는 벳삼 stake를 다시 계산해주고 판단한다.
  // data.bet365.stake = round(calc.stakeB(data.pinnacle.odds, data.bet365.odds, data.pinnacle.stake), 2);
  // let stakeRatio = getStakeRatio();
  // let maxBetmax = getMaxBetmax(data.bet365.odds, data.bet365.sports);
  //
  // if(data.bet365.stake > maxBetmax * stakeRatio){
  //   data.bet365.stake = round(maxBetmax * stakeRatio * randomRatio(), 2);
  //   updatePncStake(data);
  // }
}

function updatePncStake(data){
  data.pinnacle.stake = round(calc.stakeB(data.bet365.odds, data.pinnacle.odds, data.bet365.stake), 2);
}

function changeOddsBet365Process(data, odds){
  if(data.bet365.odds != odds){
    log(`벳365 배당변동: ${data.bet365.odds} -> ${odds}`, data.bet365.odds < odds ? "info" : "danger", true);
    data.bet365.odds = odds;
    // data.bet365.stake = calcBetmax(odds) * getStakeRatio();
    // if(betOption.useFloorStake == "y"){
    //   data.bet365.stake = Math.floor(data.bet365.stake);
    // }else{
    //   data.bet365.stake = round(data.bet365.stake, 2);
    // }
    // updatePncStake(data);
    reCalcStake(data, odds);
    return true;
    // // 유저 양빵단계의 벳삼 배당 변동시에는 벳삼 stake를 다시 계산해주고 판단한다.
    // data.bet365.stake = calc.stakeB(data.pinnacle.odds, data.bet365.odds, data.pinnacle.stake);
  }
  return false;
}

function profitValidation(data, noLog){
  return validProfit(data.pinnacle.odds, data.bet365.odds, data.pinnacle.stake, noLog);
}

function profitPValidation(data, noLog){
  return validProfitP(data.pinnacle.odds, data.bet365.odds, noLog);
}

function profitAllValidation(data, noLog){
  return validProfitP(data.pinnacle.odds, data.bet365.odds, noLog) && validProfit(data.pinnacle.odds, data.bet365.odds, data.pinnacle.stake, noLog);
}

function checkLakeMoney(data, money){
  if(money < data.bet365.stake){
    log(`배팅취소: 벳365 잔액부족 ($${data.bet365.stake}/$${money})`, 'danger', true);
    stopMatch(true);
    return true;
  }
  return false;
}

async function openBet365AndGetInfo(data, forApi){
  activeBet365();
  let betslipData;
  if(currentGameData){
    betslipData = currentGameData.bookmaker.betslipData;
  }
  let bet365Info = await sendData("setUrl", {data:data.bet365, betOption, betslipData, forApi}, PN_B365);
  activeMain();
  if(!bet365Info){
    log(`벳365 링크열기 실패`, "danger", true);
    return;
  }else if(bet365Info.status == "fail"){
    if(bet365Info.message){
      log(bet365Info.message, "danger", true);
    }
    if(bet365Info.benKey){
      benEvent(data, bet365Info.benKey, bet365Info.benTime, bet365Info.benMsg, bet365Info.toServer);
    }
    if(bet365Info.stopMatch){
      stopMatch(true);
    }
    // if(bet365Info.type == "notFoundSelectedItem"){
    //   benEvent(data, "BK", 0, "선택된 이벤트 없음");
    // }else if(bet365Info.type == "loadingFail"){
    //   benEvent(data, "BK", 0, "벳365 페이지로딩 실패");
    // }
    return;
  }else{
    // log(`벳365 확인: ${data.bet365.odds}`, null, true);
    log(`벳365 확인: ${bet365Info.odds}`, null, true);

    console.log("bet365 info", bet365Info);
    console.log("betburger info", data.bet365);

    // if(bet365Info.money < data.bet365.stake){
    //   log(`배팅취소: 벳365 잔액부족 ($${data.bet365.stake}/$${bet365Info.money})`, 'danger', true);
    //   stopMatch(true);
    //   return;
    // }
  }
  return bet365Info;
}

function printGame(data){
  log(`
    <div>종목: ${data.pinnacle.sports} (${data.pinnacle.betType})</div>
    <div>수익률: ${Math.floor(data.pinnacle.profitP*10000)/100}%</div>
    <div><span class="text-warning">피나클</span>: ${data.pinnacle[data.pinnacle.homeAway]} (<span class="text-info">${data.pinnacle.odds}</span>) <span class="text-warning">${data.pinnacle.type.code}</span> ${data.pinnacle.type.set}</div>
    <div><span class="text-success">벳365</span>: ${data.bet365[data.bet365.homeAway]} (<span class="text-info">${data.bet365.odds}</span>) <span class="text-warning">${data.bet365.type.code}</span> ${data.bet365.type.set}</div>
  `, null, true);
}

async function checkBalance(lv=0){
  let balance = await api.balance();
  if(balance.status == "success"){
    if(betOption.action != "checkBetmax" && balance.data.money < 100){
      log(`피나클 잔액이 100 미만입니다.`, "danger", true);
      sendDataToSite("sound", {name:"lakePncMoney"});
      return false;
    }
    return true;
  }else{
    log(`피나클 잔액확인 실패: ${balance.message}`, "danger", true);
    if(lv <= 3){
      log('재시도..', null, true);
      await delay(2000);
      return await checkBalance(lv+1);
    }else{
      return false;
    }
  }
}

async function reLogin(){
  activeBet365();
  let m = await sendData("reLogin", null, PN_B365);
  activeMain();
  return m;
}

function setBet365RandomStake(data, stake){
  return;

  let ratio = randomRatio();
  let nbm;
  if(betOption.useFloorStake == "y"){
    nbm = Math.floor(stake * ratio);
  }else{
    nbm = round(stake * ratio, 2);
  }
  log(`stake rand: ${stake} -> ${nbm}(${round(ratio*100,2)}%)`, null, true);
  data.bet365.stake = nbm;
  // }
  // changeOddsBet365Process(data, result.info.odds);
  // data.bet365.stake = result.betmax;
  updatePncStake(data);
  updateBet365Stake(data);
}



function calcBet365Handi(info){
  let handicap;
  if(typeof info.handicap === "number"){
    return info.handicap;
  }
  if(info.handicap){
    handicap = info.handicap;
  }else{
    //"Under 3.5"
    let m = info.title.match(/(?:over|under)[ ]*([+-]?\d+(?:\.\d+)?)/i);
    if(m){
      handicap = m[1]||null;
    }
  }
  // if(!handicap) return null;
  if(handicap === null || handicap === undefined) return null;
  return handicap.split(',').reduce((r,v,i,a)=>{
    r += parseFloat(v)/a.length;
    return r;
  },0)
}

function getBet365TeamName(data){
  return data.bet365[data.bet365.homeAway];
}


let replaceAlphabet = {
  'a': /[åä]/g,
  'A': /[ÅÄ]/g,
  'O': /[Ö]/g,
  'o': /[ö]/g,
  'N': /[Ñ]/g,
  'n': /[ñ]/g,
  'u': /[ü]/g
}
//팀이름에서 괄호의 내용 지우는데 사용
function removeGroupText(s){
  return s.replace(/\([^\)]+\)/g, '');
}
function checkBet365TeamName(data, info){
  let teams = info.desc.toLowerCase().split(' vs ');
  if(teams.length==1){
    teams = info.desc.toLowerCase().split(' v ');
  }
  if(teams.length==1){
    teams = info.desc.toLowerCase().split(' @ ');
  }

  let bet365TeamName;
  let teamName = getBet365TeamName(data);
  teamName = removeGroupText(teamName);
  if(data.bet365.homeAway == "home"){
    bet365TeamName = teams[0];
  }else{
    bet365TeamName = teams[1];
  }

  bet365TeamName = removeGroupText(bet365TeamName);

  if(bet365TeamName){
    for(let a in replaceAlphabet){
      bet365TeamName = bet365TeamName.replace(replaceAlphabet[a], a);
    }
  }

  let chk = bet365TeamName && bet365TeamName.replace(/ /g,'').indexOf(teamName.replace(/ /g,'').toLowerCase()) > -1;
  log(`팀이름확인 '${teamName}' in '${bet365TeamName}'`, chk?'':'danger');

  return chk;
}



async function checkGameType(data, bet365Info, logging){
  let comment, checkType;

  // async function saveTest(){
  //   let res = await api.saveTestData({
  //     check: checkType,
  //     data: {
  //       betburger: data,
  //       bet365Info,
  //       betType: data.bet365.betType,
  //       comment
  //     }
  //   })
  //   if(res.status == "success"){
  //     return res.data;
  //   }else{
  //     return null;
  //   }
  // }

  if(data.bet365.betType == "TOTAL_POINTS"){
    //// bet365Info.title
    // 보통 "(0-0) Under2.5" 이렇게온다.
    // "(0-0) Under2.5,3.0" 의 형태가 있다. 이건 2.75
    ///// 이때 bet365Info.handicap에 "2.5", "2.5,3.0" 핸디문자열이 있다.

    let typestr = bet365Info.title.toLowerCase();
    let handi = calcBet365Handi(bet365Info);
    if(typestr.indexOf(data.bet365.side.toLowerCase()) > -1){
      checkType = true;
    }else{
      comment = `OVER/UNDER 다름 '${data.bet365.side.toLowerCase()}' not in '${typestr}'`;
      log(comment, "danger", true);
      checkType = false;
    }

    if(checkType){
      if(handi == null && bet365Info.handicap2 !== undefined){
        handi = bet365Info.handicap2;
      }

      if(handi == data.bet365.handicap){
        checkType = true;
      }else{
        comment = `핸디 달라짐. ${data.bet365.handicap} -> ${handi}`;
        log(comment, "danger", true);
        checkType = false;
      }
    }
  }else if(data.bet365.betType == "MONEYLINE"){
    checkType = true;
  }else if(data.bet365.betType == "SPREAD"){
    let handi = calcBet365Handi(bet365Info);
    // let handi = bet365Info.handicap2;
    if(handi == null){
      handi = bet365Info.handicap2;
    }
    if(handi == data.bet365.handicap || (handi == 0 && data.bet365.handicap == null)){
      checkType = true;
    }else{
      comment = `핸디 달라짐. ${data.bet365.handicap} -> ${handi}`;
      log(comment, "danger", true);
      checkType = false;
    }
  }else{
    log(`예외 타입 ${data.bet365.betType}`, true);
    checkType = true;
  }

  if(logging){
    let cs;
    if(!checkType){
      cs = "danger";
    }else{
      cs = "info";
    }

    log("----- type check test -----");
    log(`bet365Info.market: ${bet365Info.market}`, cs);
    log(`bet365Info.title: ${bet365Info.title}`, cs);
    log(`bet365Info.type: ${bet365Info.type}`, cs);
    log(`betburger.betType: ${data.bet365.betType}`, cs);
    log(`betburger.type: ${data.bet365.type.code} | ${data.bet365.type.set}`, cs);
    log(`betburger.side: ${data.bet365.side}`, cs);
    log(`betburger.team: ${data.bet365.team}`, cs);
    log("----------------------------");

    // if(!checkType){
    //   log(`typelog save ID: ${await saveTest()}`);
    // }
  }

  return checkType;
}

function checkOddsForBet365(data){
  if(betOption.minOddsForBet365 == undefined){
    console.error("벳삼 최소배당정보가 없음.");
    return false;
  }
  let checkOdds = betOption.minOddsForBet365;
  if(data.bet365.odds < betOption.minOddsForBet365){
    log(`벳365 최소배당보다 작습니다. ${data.bet365.odds}/${betOption.minOddsForBet365}`, "danger", true);
    return false;
  }
  return true;
}

function openBet365EveryBrowser(data){
  sendDataToServer("inputGameUrl", {link:data.bet365.betLink, dataChannel:betOption.dataChannel||'1', isLive:data.bet365.isLive});
}

function activeMainEveryBrowser(isLive){
  sendDataToServer("inputGameUrl", {link:null, dataChannel:betOption.dataChannel||'1', isLive});
}

let cancelGetBetmaxFlag;
function cancelGetBetmax(){
  cancelGetBetmaxFlag = true;
  return sendData("cancelGetBetmax", null, PN_B365);
}

function cancelPncPlaceBet(){
  // isGetBetsTimeout = true;
  pncPlaceBetCancelFlag = true;
}

async function getBetmax(data, delayT=0){
  if(delayT){
    await delay(delayT);
  }
  let res = await api.loadAccountInfo(account.id);
  if(res.status == "success"){
    accountInfo = res.data.account;
    if(!accountInfo){
      log(`계정정보 로딩 실패`, "danger", true);
      // stopMatch(true);
      if(cancelGetBetmaxFlag){
        return Promise.reject(0);
      }
    }
  }
  if(cancelGetBetmaxFlag){
    return Promise.reject(0);
  }
  activeBet365();
  log(`betmax 확인시작`, null, true);
  return sendData("getBetmax", {betType:data.bet365.betType, accountInfo}, PN_B365).then(async d=>{
    // betmaxInfo = d;
    activeMain();
    return d;
  })
}

function calcBetmax(betType, odds){
  if(betType == "MONEYLINE"){
    return 20 / odds;
  }else{
    return 20 / odds * 0.6;
  }
}

async function betmaxCheckProcess(betmaxInfo, data){
  console.error("betmaxCheckProcess", {betmaxInfo});
  let checkProfit = true;

  if(betmaxInfo == null){
    log(`배팅취소: 벳365 이벤트 사라짐`, 'danger', true);
    benEvent(data, "BK", 30000, '', true);
    return;
  }

  if(betmaxInfo.status == "logouted"){
    log("배팅취소: 벳365 로그아웃 됨. 재 로그인 시도 중..", "danger", true);
    let m = await reLogin();
    if(m == null){
      log("재 로그인 실패. 브라우져를 다시 켜주세요.", "danger", true);
      stopMatch(true);
    }
    return;
  }

  if(betmaxInfo.status == "placed"){
    log(`배팅취소: ${betmaxInfo.message}`, "danger", true);
    stopMatch(true);
    return;
  }

  if(betmaxInfo.status == "false" || betmaxInfo.status == "fail"){
    log(`배팅취소: ${betmaxInfo.message}`, "danger", true);
    benEvent(data, "BK", 7000, '', true);
    return;
  }

  let checkType = await checkGameType(data, betmaxInfo.info);
  if(!checkType){
    log(`배팅취소: 벳삼 타입 다름`, "danger", true);
    benEvent(data, "BK", 0, '', true);
    return;
  }

  // if(betOption.betmaxRatio !== undefined){
  //   let nbm = round(betmaxInfo.betmax * betOption.betmaxRatio/100, 2);
  //   log(`betmax:${betmaxInfo.betmax} -> ${nbm}(${betOption.betmaxRatio}%)`, null, true);
  //   betmaxInfo.betmax = nbm;
  // }

  // 체크기에서 일부러 큰값을 보낸다. 배팅기에서 벳맥스체크를 다시 하도록 유도.
  // 추후에는.. 체크기와 동일한 시점에 작동하도록 고민...
  // betmaxInfo.betmax = betmaxInfo.betmax * 2;

  // let stakeRatio = 1;
  // if(betOption.stakeRatioP !== undefined){
  //   try{
  //     stakeRatio = betOption.stakeRatioP / 100;
  //   }catch(e){
  //     console.error(e);
  //   }
  // }
  // betmaxInfo.betmax *= stakeRatio;
  // log(`stake 증폭: $${betmaxInfo.betmax}(${round(stakeRatio*100)}%)`, null, true);

  // 벳맥스체크에서는 원래값을 그냥보내고 배팅기에서 절삭처리하도록 변경한다.

  //#210508
  // let maxBetmax = getMaxBetmax(data.bet365.odds, data.bet365.sports);
  // if(betmaxInfo.betmax > maxBetmax){
  //   log(`betmax 제한값 초과. 절삭: $${maxBetmax}`, null, true);
  //   betmaxInfo.betmax = maxBetmax;
  // }



  if(checkFallOdds(data)){
    benEvent(data, "OBOK", 20000, "떨어진 배당", true);
    return;
  }


  if(betmaxInfo.info.odds != data.bet365.odds){
    log(`벳삼배당바뀜: ${data.bet365.odds} -> ${betmaxInfo.info.odds}`, data.bet365.odds < betmaxInfo.info.odds ? "info" : "danger", true);
    data.bet365.odds = betmaxInfo.info.odds;
    if(!checkOddsForBet365(data)){
      log(`배팅취소`, "danger", true);
      benEvent(data, "OBOK", 20000, "벳삼 최소배당 미만", true);
      return;
    }
  }



  //#210508
  betmaxInfo.betmax = round(calcBetmax(data.bet365.betType, betmaxInfo.info.odds), 2);
  log(`betmax: $${betmaxInfo.betmax}, odds: ${betmaxInfo.info.odds}`, null, true);

  data.bet365.stake = betmaxInfo.betmax;
  updatePncStake(data);

  checkProfit = validProfitP(data.bet365.odds, data.pinnacle.odds);

  if(checkProfit){
    checkProfit = validProfit(data.bet365.odds, data.pinnacle.odds, data.bet365.stake);
    // log(`수익: $${profit}`, checkProfit ? "info" : "danger", true);
  }

  return checkProfit;
}

function checkFallOdds(data){
  if(betOption.usePassFallOdds == 'y'){
    if(data.bet365.originOdds - data.bet365.odds >= parseFloat(betOption.passFallOdds)){
      log(`배팅취소: 떨어진배당 ${betOption.passFallOdds} 이상`, "danger", true);
      return true;
    }
  }
}

async function checkBetmaxProcess(data){
  console.log(data);
  // let ids = getEventIds(data);
  printGame(data);

  if(!checkOddsForBet365(data)){
    log(`배팅취소`, "danger", true);
    benEvent(data, "OBOK", 20000, "벳삼 최소배당 미만", true);
    return;
  }



  console.error("wait pnc balance");
  let balance, retryCount = 0;
  while(1){
    balance = await sendData("getBalance", null, PN_BG);
    console.error("balance", balance);
    if(balance.message == "Network Error"){
      if(retryCount < 3){
        log(`피나클 잔액확인 실패: ${balance.message}. 재시도(${++retryCount})`, "danger", true);
        await delay(1000);
        continue;
      }else{
        balance.code = "NETWORK_ERROR";
      }
    }
    break;
  }

  if(balance.code === "INVALID_CREDENTIALS" || balance.code === "NETWORK_ERROR"){
    log(`피나클 잔액확인 실패: ${balance.message}`, "warning", true);
    stopMatch(true);
    return;
  }

  if(balance.availableBalance < 10){
    log(`피나클 충전이 필요합니다. ($${balance.availableBalance})`, "warning", true);
    stopMatch(true);
    sendDataToSite("sound", {name:"lakePncMoney"});
    return;
  }else{
    log(`피나클 잔액: $${balance.availableBalance}`, null, true);
  }
  if(!flag.isMatching) return;
  console.error("wait getLine");
  let line = await sendData("getLine", data.pinnacle, PN_BG);
  let checkLine;
  console.error({line});
  if(line && line.lineData){
    if(line.lineData.status == "SUCCESS"){
      checkLine = true;
      log(`라인확인: ${line.lineData.price}`, null, true);
      if(data.pinnacle.odds != line.lineData.price){
        log(`피나클 배당변동: ${data.pinnacle.odds} -> ${line.lineData.price}`, data.pinnacle.odds < line.lineData.price ? "info" : "danger", true);
        data.pinnacle.odds = line.lineData.price;
      }
    }else{
      console.error(line.lineData.status);
      log(`라인찾기실패: ${line.lineData.status}`, "danger", true);
      benEvent(data, "PK", 0, '', true);
      return;
      // let count = lineFindFailCountUp(ids.peId);
      // if(count >= 2){
      //   benEvent(ids.peId, 0, "2 연속 못찾음");
      // }
    }
  }else{
    log(`이벤트로드 실패`, "danger", true);
    benEvent(data, "PK", 0, '', true);
    return;
  }

  if(!flag.isMatching) return;

  let bet365Info, checkProfit, checkType, isTypeTest = false;
  // #2 벳삼열어서 배당 및 타입체크
  if(checkLine){
    openBet365EveryBrowser(data);

    /// test
    // return;
    ///

    bet365Info = await openBet365AndGetInfo(data);
    if(!bet365Info){
      return;
    }



    if(!checkBet365TeamName(data, bet365Info)){
      log(`배팅취소: 벳삼 팀이름 다름`, "danger", true);
      benEvent(data, "BK", 0, '', true);
      //data.bet365.betburgerEventId, 0);
      return;
    }

    checkType = await checkGameType(data, bet365Info, isTypeTest);

    if(!checkType){
      log(`배팅취소: 벳삼 타입 다름`, "danger", true);
      benEvent(data, "BK", 0, '', true);
      // benEvent(data.bet365.betburgerEventId, 0);
      return;
    }

    if(isTypeTest){
      /////////////// TEST
      benEvent(data, "BK", 0);
      // benEvent(data.bet365.betburgerEventId, 0);
      return;
      /////////////////
    }

    if(checkLakeMoney(data, 1)){
      return;
    }

    if(changeOddsBet365Process(data, bet365Info.odds)){
      updateBet365Link(data);
    }

    if(!checkOddsForBet365(data)){
      log(`배팅취소`, "danger", true);
      benEvent(data, "OBOK", 20000, "벳삼 최소배당 미만", true);
      return;
    }

    //// 현재 이 조합의 벤을 각 배팅브라우져가 하고있으므로 체크기단에서는
    // 검사되지 않을것이다.
    // 추후 벤하는쪽에서 id+odds+event 별로 한도를 정한 서버단의 벤리스트를 만들면
    // 그것을 체크하는것으로 변경하자
    // if(isBenEvent(data.bet365.eventId+data.bet365.odds)){
    if(isBenEvent(data, "OBOK")){
      log(`제외된 배당입니다(odds:${data.bet365.odds})`, "warning", true);
      return;
    }



    // betmax 확인전에는 수익률로만 판단
    checkProfit = profitPValidation(data);

    if(!checkProfit){
      benEvent(data, "EBOK", 10000, '', true);
      // benEvent(data.bet365.betburgerEventId, 10000);
      log(`배팅취소`, 'danger', true);
      return;
    }


  }

  let checkPinnacleBet, betResult, betmaxInfo;
  // #3 피나클 배팅.
  if(checkProfit){
    if(!flag.isMatching) return;

    // cancelGetBetmaxFlag = false;
    // //////////////
    // //let betmaxInfo = await sendData("getBetmax", null, PN_B365);
    // // 피나클 라인바뀜이 2초안에 진행될경우 벳삼을 확인할필요없다.
    // // 불필요 트래픽 방지위해 2초 딜레이
    // let betmaxPromise = getBetmax(data, 2000).then(async d=>{
    //   betmaxInfo = d;
    //   // 피나클 배팅결과가 나오기전에 betmax결과가 나왔다면.
    //   if(!betResult){
    //     let chk = await betmaxCheckProcess(betmaxInfo, data);
    //     if(!chk){
    //     // if(betmaxInfo == null || betmaxInfo.status == "placed" || betmaxInfo.status == "false" || betmaxInfo.status == "fail"){
    //       // log(`betmaxStatus:${betmaxInfo?betmaxInfo.status:betmaxInfo}, cancel pnc placebet..`, 'danger', true);
    //       log(`cancel pnc placebet..`, 'danger', true);
    //       cancelPncPlaceBet();
    //       return Promise.reject(0);
    //     }
    //   }
    // })
    //
    //
    // let pncBetPromise = placeBet(line).then(async d=>{
    //   betResult = d
    //   let cancel;
    //   if(betResult.status == "success"){
    //     // 피나클 배팅완료후, 배팅된 배당으로 다시 수익률을 판단할 필요가 있나 ?
    //     // checkProfit = validProfitP(betResult.data.price, bet365Info.odds);
    //
    //     if(betResult.data.price && betResult.data.price != data.pinnacle.odds){
    //       log(`피나클배팅후 배당바뀜: ${data.pinnacle.odds} -> ${betResult.data.price}`, data.pinnacle.odds < betResult.data.price ? "info" : "danger", true);
    //       data.pinnacle.odds = betResult.data.price;
    //       // checkProfit = validProfitP(data.bet365.odds, data.pinnacle.odds, true) && validProfit(data.bet365.odds, data.pinnacle.odds, data.bet365.stake, true);
    //       checkProfit = profitPValidation(data);
    //       if(!checkProfit){
    //         log(`배팅취소`, 'danger', true);
    //         cancel = true;
    //       }
    //     }
    //     // checkPinnacleBet = true;
    //   }else{
    //     cancel = true;
    //   }
    //
    //   if(cancel){
    //     if(betmaxInfo === undefined){
    //       log("cancel get betmax..", 'danger', true);
    //       await cancelGetBetmax();
    //     }
    //     // log("cancel get betmax complete", 'danger', true);
    //     return Promise.reject(1);
    //   }
    // });
    //
    // let rejectNum;
    // try{
    //   await Promise.all([betmaxPromise, pncBetPromise]);
    // }catch(e){
    //   rejectNum = e;
    // }

    console.error("##", line);

    let betmaxCheck;
    // if(rejectNum === undefined){
    //   // log("start betmaxCheckProcess", "danger", true);
    //   betmaxCheck = await betmaxCheckProcess(betmaxInfo, data);
    //   // log("end betmaxCheckProcess:" + betmaxCheck, "danger", true);
    // }

    betResult = await placeBet(line);

    if(betResult.status == "success"){
      betmaxCheck = true;

      if(betResult.data.price && betResult.data.price != data.pinnacle.odds){
        log(`피나클배팅후 배당바뀜: ${data.pinnacle.odds} -> ${betResult.data.price}`, data.pinnacle.odds < betResult.data.price ? "info" : "danger", true);
        data.pinnacle.odds = betResult.data.price;
        // checkProfit = validProfitP(data.bet365.odds, data.pinnacle.odds, true) && validProfit(data.bet365.odds, data.pinnacle.odds, data.bet365.stake, true);
        checkProfit = profitPValidation(data);
        if(!checkProfit){
          log(`배팅취소`, 'danger', true);
          betmaxCheck = false;
        }
      }
      // checkPinnacleBet = true;
    }

    if(betmaxCheck){
      log(`
        <div class="text-info">------ 데이터 전송 ------</div>
        <div class="text-warning">피나클: $${data.pinnacle.stake} (${data.pinnacle.odds})</div>
        <div class="text-success">벳365: $${data.bet365.stake} (${data.bet365.odds})</div>
      `, null, true);

      let bdata = betResult.data;
      bdata.pncLine = line.lineData;
      bdata.betburger = data;
      bdata._id = betResult.data.uniqueRequestId;
      // bdata.bookmaker = betmaxInfo;
      bdata.bookmaker = bet365Info;
      bdata.dataChannel = betOption.dataChannel||'1';
      sendDataToServer("inputGameData", {data:bdata, betburgerEventId:data.bet365.betburgerEventId, isLive:data.bet365.isLive});
      // benEvent(data, "OBOK", 0, "데이터 수집");
      isWaiting = bdata.betId;
      return true;
    }else{
      log(`배팅취소`, 'danger', true);
      //sendDataToServer("inputGameData", {data:null, betburgerEventId:data.bet365.betburgerEventId, isLive:data.bet365.isLive});
    }

    //////////////
  }
}//end checkBetmaxProcess

async function vlProcess(data){

}

async function startMatch(sync){
  if(!betOption){
    log("bet365 로그인 전입니다.", null, true);
    return;
  }
  log("-------- 매칭켜짐 --------", "info", true);
  flag.isMatching = true;
  updateMatchButtonState();
  if(sync){
    sendDataToSite("receiveMatchFlag", flag.isMatching);
  }
  if(betOption.action != "vl"){
    if(!(await checkBalance())){
      stopMatch(sync);
    }
  }

  return flag.isMatching;
}

function stopMatch(sync){
  log("-------- 매칭꺼짐 --------", "danger", true);
  flag.isMatching = false;
  updateMatchButtonState();
  if(sync){
    sendDataToSite("receiveMatchFlag", flag.isMatching);
  }
}

let taitv;
function tabActiveSchedule(){
  clearTimeout(taitv);
  taitv = setInterval(async ()=>{
    activeBet365();
    await delay(100);
    activeMain();
  }, 1000 * 60 * 60)
}

var resolveList = {};
let urlParams;

function setupF5Lock(){
  window.addEventListener("keydown", e=>{
    if(e.key == "F5"){
      e.preventDefault();
    }
  }, false)
}

function setupMode(mode){
  if(mode == "dev"){
    devMode = true;
    $("body").css("background", "white");
    $(".container").hide();
    $("#matchButton").show();
    $("#optionName").show();
    $(".log-container").show();
    $(".log-container").css("height", "calc(100vh - 63px)");
    $(window).off("resize");
  }else{
    $("body").css("background", "#050505");
    $(".container").show();//.css("transform", "scale(0.5)");
    $("#matchButton").hide();
    $("#optionName").hide();
    $(".log-container").hide();
    $(window).on("resize", e=>{
      let r = window.innerHeight / 400;
      $(".container").css("transform", `scale(${r})`);
    });
    $(window).trigger("resize");

    let styleStr = `
    #matchButton2 {
        width: 219px;
        height: 179px;
        background: url(//www.surebet.vip/extension/main/imgs/startbtn-normal.png);
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 20px 0 0 -110px;
        cursor: pointer;
      }
      #matchButton2:hover {
        background: url(//www.surebet.vip/extension/main/imgs/startbtn-hover.png);
      }

      #matchButton2.active {
        background: url(//www.surebet.vip/extension/main/imgs/stopbtn-normal.png);
      }

      #matchButton2.active:hover {
        background: url(//www.surebet.vip/extension/main/imgs/stopbtn-hover.png);
      }

      .icon {
        width: 250px;
        height: 250px;
        background: url(//www.surebet.vip/extension/main/imgs/off-icon.png);
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -210px 0 0 -125px;
      }

      .icon.active {
        background: url(//www.surebet.vip/extension/main/imgs/on-icon.png);
      }

      .container{
        position: fixed;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        background-color: rgb(5,5,5);
      }
    `;

    if($(".product-style").length == 0){
      $(document.head).append($('<style class="product-style">').html(styleStr));
    }
  }
}

// async function gamedataProcess(data){
//   console.log("receive gamedata", data);
//   // if(!flag.bet365LoginComplete) return;
//   // if(!flag.isMatching) return;
//   if(flag.bet365LoginComplete && flag.isMatching){
//     await findMatch(data);
//   }
//
//   // await delay(3000);
//   // sendDataToServer("pullGameData");
// }

// var isPulling;
// async function startPulling(){
//   // if(flag.bet365LoginComplete && flag.isMatching && !isCheckingMatch){
//   //   sendDataToServer("pullGameData");
//   // }
//
//   if(isPulling) return;
//
//   isPulling = true;
//   // clearInterval(pullItv);
//   // pullItv = setInterval(()=>{
//   while(1){
//     // if(!flag.bet365LoginComplete) return;
//     // if(!flag.isMatching) return;
//     // if(isCheckingMatch) return;
//
//     if(flag.bet365LoginComplete && flag.isMatching && !isCheckingMatch){
//       sendDataToServer("pullGameData");
//     }
//
//     let st = Date.now();
//     await delay(1000 * 3);
//     console.log((Date.now()-st)/1000);
//   }
//   // }, 3000);
// }

let pullTime = performance.now();
let pullGab = 3000;
function animate(){
  if(performance.now() - pullTime > pullGab){
    pullTime = performance.now();
    if(flag.bet365LoginComplete && flag.isMatching && !isCheckingMatch && !isWaiting){
      sendDataToServer("pullGameData", {
        dataType: betOption.dataType,
        livePrematch: betOption.livePrematch
      });
    }
  }
  requestAnimationFrame(animate);
}

async function init(){
  console.error("init");
  // console.log(code.toString());
  let bet365Code = bet365JS.toString().replace(/^function bet365JS\(\)\{/,'').replace(/}$/,'');
  let apiCode = setupAPI.toString();
  let bgCode = bgJS.toString().replace(/^function bgJS\(\)\{/,'').replace(/}$/,'');
  // let params = getParam();
  urlParams = getUrlParams(window.location.href);
  history.replaceState({}, "index", "http://localhost:8080/main.html?v=" + version);

  document.title = "main";

  // axios.get("http://lumtest.com/myip.json").then(res=>{
  //   console.error(res.data);
  // })

  setupF5Lock();

  socket = io();
  setupOnMessage();

  // let _ip = ip();
  // setData("ip", _ip);
  // $("#ip").html(_ip);
  // $("#ip").remove();
  // document.title = _ip;
  // $("h1").remove();

  setupMode("product");

  socket.on("resolve", (data, uuid)=>{
    if(resolveList[uuid]){
      resolveList[uuid](data);
      delete resolveList[uuid];
    }
  })

  socket.on("connect", async ()=>{
    console.log("socket connected");
    let data = {
      bid: urlParams.bid,
      email: urlParams.email,
      countryCode: urlParams.countryCode,
      // ip: _ip,
      needPnc: urlParams.needPnc == "true"
    };
    BID = data.bid;
    EMAIL = data.email;
    ///
    // data.isChecker = true;
    ///
    socket.emit("initMainPage", data);
    // sendSocketData("loadBrowserInfo", data);
    // sendData("loadBrowserInfo", data, PN_BG);
    await sendData("runBgCode", {code:bgCode}, PN_BG);

    await sendData("removeCache", null, PN_BG);

    await sendData("runApiCode", {email:EMAIL, code:apiCode}, PN_BG);
    api = setupAPI(EMAIL);
    await sendData("saveBet365Account", data, PN_BG);
    await sendData("runBet365Code", bet365Code, PN_BG);

    // tabActiveSchedule();
  })

  socket.on("sendData", data=>{
    if(data.to == "main"){
      onMessage(data);
    }else{
      sendData(data.com, data.data, data.to, true);
    }
  })

  socket.on("getState", (data, uuid)=>{
    let r = {
      // ip: getData("ip"),
      isMatching: flag.isMatching
    }
    // console.error("getState", r);
    // console.error("send resolve", uuid);
    socket.emit("resolve", r, uuid);
  })

  socket.on("startMatch", async (data, uuid)=>{
    console.log("startMatch", data, uuid);
    let r = await startMatch();
    if(uuid){
      socket.emit("resolve", r, uuid);
    }
  })

  socket.on("stopMatch", (data, uuid)=>{
    console.log("stopMatch", data, uuid);
    stopMatch();
    if(uuid){
      socket.emit("resolve", false, uuid);
    }
  })

  socket.on("loadMoney", async (data, uuid)=>{
    console.error("loadMoney", data, uuid);
    if(!flag.bet365LoginComplete){
      if(uuid){
        socket.emit("resolve", "로그인 전입니다.", uuid);
      }
      log("벳365 money갱신: 로그인 전입니다", null, true);
      return;
    }
    log("벳365 money갱신중..", null, true);
    activeBet365();
    let money = await sendData("loadMoney", null, PN_B365);
    activeMain();
    console.error("money", money);
    log(`벳365 money갱신: $${money}`, null, true);
    if(uuid){
      socket.emit("resolve", money, uuid);
    }
  })

  socket.on("withdraw", async (data, uuid)=>{
    console.error("withdraw", data, uuid);
    if(!flag.bet365LoginComplete){
      if(uuid){
        socket.emit("resolve", "로그인 전입니다.", uuid);
      }
      log("벳365 출금시도: 로그인 전입니다", null, true);
      return;
    }
    log("벳365 출금시도중..", null, true);
    activeBet365();
    let money = await sendData("withdraw", data, PN_B365);
    activeMain();
    // console.error("money", money);
    if(money == null){
      log(`벳365 출금요청실패`, "danger", true);
    }else{
      log(`벳365 출금요청완료. 잔액: $${money}`, null, true);
    }
    if(uuid){
      socket.emit("resolve", money, uuid);
    }
  })

  // socket.on("setChecker", data=>{
  //
  // })


  // socket.on("3secTick", ()=>{
  //   if(flag.bet365LoginComplete && flag.isMatching && !isCheckingMatch){
  //     sendDataToServer("pullGameData");
  //   }
  // })

  socket.on("gamedata", async (data)=>{
    console.log("receive gamedata", data);
    // if(!flag.bet365LoginComplete) return;
    // if(!flag.isMatching) return;
    if(flag.bet365LoginComplete && flag.isMatching && !isWaiting){
      await findMatch(data);
    }

    // await delay(3000);
    if(data && data.bet365){
      sendDataToServer("unlockEvent", {dataType:betOption.dataType, betburgerEventId:data.bet365.betburgerEventId});
    }
  })

  socket.on("gamedata2", async data=>{
    if(!flag.bet365LoginComplete) return;
    console.log("receive gamedata2");

    // #210402 일단 랜덤 대기시간 없애고 전체 배팅 시도해보자
    // await delay(Math.random() * 5000);

    // setData("gamedata", data);
    if(!flag.isMatching) return;
    // sendData("gamedata", data, "bg");
    // let gd = JSON.parse(data);
    // console.log("gamedata", data);
    //

    if(data){
      if(data.isLive && !betOption.livePrematch.live){
        return;
      }
      if(!data.isLive && !betOption.livePrematch.prematch){
        return;
      }
    }

    findMatch2(data);
  })

  socket.on("gameurl", data=>{
    /// test
    // return;
    ///

    if(!flag.bet365LoginComplete) return;
    if(!flag.isMatching) return;
    if(isCheckingMatch) return;

    console.log("receive gameurl");

    if(data){
      if(data.isLive && !betOption.livePrematch.live){
        return;
      }
      if(!data.isLive && !betOption.livePrematch.prematch){
        return;
      }
    }

    if(!data || !data.link){
      activeMain();
    }else{
      activeBet365();
      sendData("setPreUrl", {betOption, url:data.link}, PN_B365, true);
    }
  })

  socket.on("gamefinish", betId=>{
    if(isWaiting == betId){
      isWaiting = false;
    }
  })
}

init();
