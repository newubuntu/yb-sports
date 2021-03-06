console.log("bet365 code");
function bet365JS(){
  var version = 1.0;

  if(window['aleadyInit']){
    // console.error("이미 코드 실행됨.");
    throw new Error("이미 코드 실행됨.")
  }

  function interceptData() {
    var xhrOverrideScript = document.createElement('script');
    xhrOverrideScript.type = 'text/javascript';
    xhrOverrideScript.innerHTML = `
    (function() {
      if(!window._xhrcustom){
        var XHR = XMLHttpRequest.prototype;
        window._xhrcustom = true;
        var send = XHR.send;
        var open = XHR.open;
        XHR.open = function(method, url) {
            this.url = url; // the request url
            return open.apply(this, arguments);
        }
        XHR.send = function() {
          if(this.url.includes('/BetsWebAPI/refreshslip')) {
            // console.error('listen!');
            this.addEventListener('load', e=>{
              // console.error("loaded", this.responseText);
              try {
                let o = JSON.parse(this.responseText);
                localStorage.setItem('betGuid', o.bg);
                localStorage.setItem('refreshData', this.responseText);
                console.error('loaded betGuid', o.bg);
              }catch(e){
                localStorage.removeItem('betGuid');
                localStorage.removeItem('refreshData');
                console.error('betGuid parse fail');
              }
            }, {once:true})
          }else if(this.url.includes('/BetsWebAPI/addbet')) {
            this.addEventListener('load', e=>{
              try {
                let o = JSON.parse(this.responseText);
                localStorage.setItem('betGuid', o.bg);
              }catch(e){
                localStorage.removeItem('betGuid');
              }
            }, {once:true})
          }
          /*
          else if(this.url.includes('//localhost')) {
            console.error("@@@ found request to localhost");
            if(sendData){
              console.error("send removeCache signal");
              sendData("removeCache", null, PN_BG);
            }
          }
          */

          return send.apply(this, arguments);
        };
      }
    })();
    `
    document.head.prepend(xhrOverrideScript);
  }
  function checkForDOM() {
    if (document.body && document.head) {
      interceptData();
    } else {
      requestIdleCallback(checkForDOM);
    }
  }
  requestIdleCallback(checkForDOM);


  window['onUicountersapiCancelled'] = function(e){
    console.error("@@ uicountersapiCancelled", e);
  }

  var betOption = {};

  var MESSAGE = {
    RESTRICTIONS: "Certain restrictions may be applied to your account. If you have an account balance you can request to withdraw these funds now by going to the Withdrawal page in Members",
    NEED_VERIFY: "In accordance with licensing conditions we are required to verify your age and identity. Certain restrictions may be applied to your account until we are able to verify your details. Please go to the Know Your Customer page in Members and provide the requested information.",
    MINIMUM_STAKE: "Please note that the minimum unit stake is"
  }

  function compareMessage(str, msg){
    return str.indexOf(msg) > -1;
  }

  jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
  }

  // sendData("setAgent", 'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36', PN_BG, true);
  // var addBet = ns_betslip.BetSlipManager.prototype.addBet;
  //
  // ns_betslip.BetSlipManager.prototype.addBet = function(){
  //   console.error("???", arguments);
  //   return addBet.apply(this, arguments);
  // }

  log.setSendFunc = sendData;
  // 코드를 한번만 실행하게되는 좋은 장치가 됐다 let을 바꾸지 마라
  var prevBalance;
  console.log({version});

  // function removeModal(){
    // $(".wcl-ModalManager_DarkWash").remove();
    // $(".lp-UserNotificationsPopup_FrameContainer").remove();
    // $(".pm-PushGraphicContainer_DarkWash").remove();
    // $(".pm-PushGraphicContainer").remove();


  // }

  async function getMoneyInBetslip(){
    await until(()=>{
      return $(".bs-Balance_Value").text().replace(/[^0-9]/g, '').length > 0;
    }, 2000)
    return parseMoney($(".bs-Balance_Value").text())
  }

  async function findHandicap2(selectors, timeout=2000){
    let startTime = new Date();
    let str;

    if(typeof selectors === "string"){
      selectors = [selectors];
    }

    let s_index;
    await until(()=>{
      // let s = $(totalPointsHandiSelector).text();
      // console.error("?", (Date.now()-startTime)/1000, s);
      // return s.length > 0;
      // return $(totalPointsHandiSelector).text().length > 0;
      console.error("findHandicap2", (Date.now()-startTime)/1000, str);
      for(let i=0; i<selectors.length; i++){
        if($(selectors[i]).text().length > 0){
          s_index = i;
          return true
        }
      }
    }, 1500);

    if(s_index !== undefined){
      str = $(selectors[s_index]).text();
      let handi = parseFloat(str.replace(/[^0-9+-.]/ig,''));
      console.error("findHandicap2 result:", str, handi);
      if(!isNaN(handi)){
        return handi;
      }
    }
    return null;

    // await until(()=>{
    //   str = $(selector).text();
    //   console.error("findHandicap2", (Date.now()-startTime)/1000, str);
    //   return str.length > 0;
    //   // return $(spreadHandiSelector).text().length > 0;
    // }, 2000);
    // let handi = parseFloat(str.replace(/[^0-9+-.]/ig,''));
    // console.error("findHandicap2 result:", str, handi);
    // if(!isNaN(handi)){
    //   return handi;
    // }
    // return null;
  }

  async function click3Way(){
    console.error("click3Way");
    $(".gl-ButtonBar").find(".gl-ButtonBar_ButtonHitArea:not(.gl-ButtonBar_ButtonHitArea-selected)").click();
    // let btnGroups = $(".gl-ButtonBar").each((i,el)=>{
    //   // $(el).children().eq(1).click();
    //   $(el).find(".gl-ButtonBar_ButtonHitArea:not(.gl-ButtonBar_ButtonHitArea-selected)").eq(1).click();
    // })
    await delay(200);
  }

  function odToOdds(od){
    if(od.indexOf('/') > -1){
      let a = od.split('/').map(n=>parseInt(n));
      let o = 1+a[0]/a[1];
      // return Math.floor(o*100)/100;
      return round(o, 3);
    }else if(/\d{4}/.test(od)){
      let m = od.match(/(\d{2})(\d{2})/);
      return parseFloat(m[1]+'.'+m[2]);
    }else{
      return parseFloat(od);
    }
  }

  async function getBetslipInfoForAPI(odds, ln, betslipData){
    // let info = await getBetslipInfo();
    // if(!refreshData){
      refreshData = await refreshslipApi(odds, ln, betslipData);
      // refreshData = localStorage.getItem('refreshData');
    // }

    if(!refreshData) return null;


    // let money;
    // money = await getMoney();
    // if(!refreshData){
    //   refreshData = await refreshslip();
    // }
    //
    // if(refreshData){
    let bt = refreshData.bt[0];
    let pt = bt.pt[0];

    // info.odds = odToOdds(bt.od);
    // info.od = bt.od;
    let handicap;
    let hd = pt.hd || pt.ha;
    if(pt.md !== "Draw No Bet" && pt.md !== "Match Winner" && pt.md !== "Next Game" && pt.md !== "Most Corners"){
      handicap = hd?hd:"";
    }else{
      handicap = hd?hd:"0";
    }

    let m = await readMoney();

    bt.od = odCheck(bt.od, odds);

    return {
      title: pt.bd,
      handicap,
      market: pt.md,
      odds: odToOdds(bt.od),
      od: bt.od,
      desc: bt.fd,
      logged: !isNaN(m)
    }
    // }
    // return info;
    // else{
    //   return null;
    // }
  }

  async function getBetslipInfo(opt){
    let money;
    if(opt && opt.withMoney){
      // money = await getMoneyInBetslip();
      // // money = await getMoneyInBetslip();
      money = await getMoney();
    }


    let handicap = $(".bss-NormalBetItem_Handicap, .qbs-NormalBetItem_Handicap").text();
    let handicap2;
    let market = $(".bss-NormalBetItem_Market, .qbs-NormalBetItem_Market").text();

    async function f(){
      if(!handicap && !handicap2 && currentData.betType == "TOTAL_POINTS"){
        // let totalPointsHandiSelector = ".gl-ParticipantOddsOnly_Highlighted";
        let selectors = [
          ".gl-ParticipantOddsOnly_Highlighted",
          ".sip-MergedHandicapParticipant_Highlighted>.sip-MergedHandicapParticipant_Name"
        ]
        let s_index;
        await until(()=>{
          // let s = $(totalPointsHandiSelector).text();
          // console.error("?", (Date.now()-startTime)/1000, s);
          // return s.length > 0;
          // return $(totalPointsHandiSelector).text().length > 0;
          if($(selectors[0]).text().length > 0){
            s_index = 0;
            return true
          }

          if($(selectors[1]).text().length > 0){
            s_index = 1;
            return true
          }
        }, 1500);

        if(s_index == 0){
          let index = $(selectors[s_index]).eq(0).index();
          handicap2 = parseFloat($(selectors[s_index]).eq(0).parent().next().children().eq(index).text().replace(/[^0-9+-.]/ig,''));
          if(isNaN(handicap2)){
            handicap2 = parseFloat($(selectors[s_index]).eq(0).parent().parent().children().first().children().eq(index).text().replace(/[^0-9+-.]/ig,''));
            if(isNaN(handicap2)){
              handicap2 = null;
            }
          }
        }else if(s_index == 1){
          handicap2 = await findHandicap2(selectors[s_index]);
        }
      }

      if(!handicap && !handicap2 && currentData.betType == "SPREAD"){ // (currentData.betType == "SPREAD" || currentData.betType == "TOTAL_POINTS")){
        // let spreadHandiSelector = ".sip-MergedHandicapParticipant_Highlighted>.sip-MergedHandicapParticipant_Name";
        if(market == "Draw No Bet"){
          handicap = "0";
        }else{
          let selectors = [
            ".sip-MergedHandicapParticipant_Highlighted>.sip-MergedHandicapParticipant_Name",
            ".gl-ParticipantCentered_Highlighted>.gl-ParticipantCentered_Handicap"
          ]
          handicap2 = await findHandicap2(selectors);
        }
      }

      // if(!handicap && !handicap2 && currentData.betType == "SPREAD"){
      //   let spreadHandiSelector = ".gl-ParticipantCentered_Highlighted>.gl-ParticipantCentered_Handicap"
      //   handicap2 = await findHandicap2(spreadHandiSelector);
      // }
    }

    await f();
    if(!handicap && !handicap2){
      if(market.indexOf("3-Way") > -1){
        //3way 다 클릭
        await click3Way();
        // let btnGroups = $(".gl-ButtonBar").each((i,el)=>{
        //   // $(el).children().eq(1).click();
        //   $(el).find(".gl-ButtonBar_ButtonHitArea").eq(1).click();
        // })
        // await delay(200);
        await f();
      }
    }

    let m = await readMoney();

    return {
      title: $(".bss-NormalBetItem_Title, .qbs-NormalBetItem_Title").text(),
      handicap,
      market,
      odds: parseFloat($(".bs-OddsLabel>span:first").text()),
      desc: $(".bss-NormalBetItem_FixtureDescription, .qbs-NormalBetItem_FixtureDescription").text(),
      handicap2,
      money,
      logged: !isNaN(m)
    }
  }

  function findPlaceBetBtn(timeout=0){
    return findEl(".bss-PlaceBetButton:not(.hidden):not(.disabled):visible, .qbs-PlaceBetButton:not(.hidden):not(.disabled):visible", timeout);
  }

  function findAcceptBtn(timeout=0){
    return findEl(".bs-AcceptButton:not(.hidden):not(.disabled):visible, .qbs-AcceptButton:not(.hidden):not(.disabled):visible", timeout);
  }

  function findAcceptOrPlacebetBtn(timeout=0) {
    return findElAll([
      ".bs-AcceptButton:not(.hidden):not(.disabled):visible, .qbs-AcceptButton:not(.hidden):not(.disabled):visible",
      ".bss-PlaceBetButton:not(.hidden):not(.disabled):visible, .qbs-PlaceBetButton:not(.hidden):not(.disabled):visible"
    ], timeout);
  }

  function findAcceptOrPlacebetOrPlaced(timeout=0) {
    return findElAll([
      ".bs-AcceptButton:not(.hidden):not(.disabled):visible, .qbs-AcceptButton:not(.hidden):not(.disabled):visible",
      ".bss-PlaceBetButton:not(.hidden):not(.disabled):visible, .qbs-PlaceBetButton:not(.hidden):not(.disabled):visible",
      ".bss-ReceiptContent:not(.hidden):not(.disabled):visible, .qbs-QuickBetHeader-receipt:not(.hidden):not(.disabled):visible"
    ], timeout);
  }

  function betslipMessage(){
    return $(".bss-Footer_MessageBody, .qbs-QuickBetHeader_MessageBody").text().trim();
  }

  async function getBetmax(timeout=0) {
    await until(()=>{
      return $(".bss-Footer_MessageBody").text().length>0
    }, timeout)
    let a = $(".bss-Footer_MessageBody").text().trim();
    let m = a.match(/Stake\/risk entered.+available maximum of (.\d+\.?\d*)/);
    if(m){
      return parseFloat(m[1].replace(/[^0-9.]/g, ''));
    }else{
      if($(".bs-AcceptButton-maxstake").length){
        await until(()=>{
          return $(".bss-NormalBetItem_MessageBody").text().length>0
        }, timeout)
        let a = $(".bss-NormalBetItem_MessageBody").text().trim().replace(/[^0-9.]/g, '');
        let p = parseFloat(a);
        if(isNaN(p)){
          return null;
        }else{
          return p;
        }
      }else{
        return null;
      }
    }
    // return null;
  }

  function activeBet365(){
    sendData("activeBet365", null, PN_BG, true);
  }

  function activeMain(){
    sendData("activeMain", null, PN_BG, true);
  }

  function timestamp(str){
    console.error('['+new Date().toLocaleTimeString()+']', str||'');
  }

  function findHighlighted(){
    let $f = $([
      ".gl-ParticipantOddsOnly_Highlighted",
      ".sip-MergedHandicapParticipant_Highlighted",
      ".gl-ParticipantCentered_Highlighted",
      ".gl-ParticipantBorderless_Highlighted",
      ".gl-Participant_General_Highlighted",
      ".srb-ParticipantCenteredStackedWithMarketBorders_Highlighted",
      ".srb-ParticipantCenteredBorderless_Highlighted",
      ".srb-ParticipantCenteredStackedMarketRow_Highlighted",
      ".srb-ParticipantStackedBorderless_Highlighted"
    ].join());
    return $f.length > 0 ? $f : null;
  }

  async function setStake(val){
    console.error('setStake', val);

    let selector = '.bss-StakeBox_StakeValueInput';
    let f = await until(()=>$(selector).length>0, 2000);
	  var el = document.querySelector(selector);
  	if(el){
  		var event = new CustomEvent("input");
  		el.value = val;
  		el.dispatchEvent(event);
  	}
    await delay(1000);
    return f;
  }




  async function refreshslip(){
    let $dummyEl;
    localStorage.removeItem('refreshData');
    await until(()=>{
      return $(".gl-ParticipantOddsOnly:not(.gl-ParticipantOddsOnly_Suspended):not(.gl-ParticipantOddsOnly_Highlighted)").length>0;
    }, 2000);

    $dummyEl = $(".gl-ParticipantOddsOnly:not(.gl-ParticipantOddsOnly_Suspended):not(.gl-ParticipantOddsOnly_Highlighted)").eq(0).click();
    if($dummyEl.length == 0){
      $dummyEl = $(".gl-ParticipantCentered").eq(0).click();
    }

    console.error("dummyEl 클릭", $dummyEl[0]);



    $betSlip = await findEl(".bss-DefaultContent", 2000);

    if($betSlip){
      console.error("betslip 클릭");
      await delay(100);
      $dummyEl.click();
      await delay(100);
      $betSlip.click();
      // await delay(200);

      await until(()=>{
        return !!localStorage.getItem('refreshData');
      }, 10000);

      let obj;
      try{
        obj = JSON.parse(localStorage.getItem('refreshData'));
        console.error("refreshData", obj);
      }catch(e){
        console.error("refreshData parse error");
      }
      return obj;
    }
  }

  // let bsdtime = 0;
  function isTimekeyOver(){
    // 4분을 유효주기로 잡자
    // return Date.now() - bsdtime > (1000 * 60 * 4);
    return sendData("isTimekeyOver", null, PN_BG);
  }

  function getBetslipData(){
    return sendData("getBetslipData", null, PN_BG);
  }

  function setBetslipData(data){
    return sendData("setBetslipData", data, PN_BG);
  }

  async function refreshslipApi(newOdds, newLn, betslipData){
    let reqData;
    if(betslipData){
      reqData = betslipData;
    }else{
      // reqData = await sendData("getBetslipData", null, PN_BG);
      reqData = await getBetslipData();
    }
    console.error("betslip req data", reqData);
    if(!reqData) return null;
    let headers = await sendData("getBetHeaders", null, PN_BG);
    console.error("bet headers", headers);

    if(reqData && reqData.data && reqData.data.ns){
      if(newOdds !== undefined){
        reqData.data.ns = reqData.data.ns.replace(/#o=((\d+\/\d+)|(\d+(\.\d+))?)/, function(f,m){
          return "#o=" + newOdds;
        })
      }

      if(newLn !== undefined){
        if(reqData.data.ns.indexOf("#ln=") > -1){
          reqData.data.ns = reqData.data.ns.replace(/#ln=-?((\d+\/\d+)|(\d+(\.\d+))?)/, function(f,m){
            return "#ln=" + newLn;
          })
        }else{
          reqData.data.ns += "#ln=" + newLn;
        }
      }
    }

    const params = new URLSearchParams();
    for(let o in reqData.data){
      params.append(o, reqData.data[o]);
    }
    // localStorage.removeItem('refreshData');

    let data, c=0;
    let retryCount = 0;

    while(1){
      let res = await axios({
        method: "post",
        url: "https://www.bet365.com/BetsWebAPI/refreshslip",
        data: params,
        headers: headers
      })
      console.error("res", res);


      data = res.data;

      if(!data || !data.bt){
        if(retryCount++ < 1){
          await refreshTimekey();
          headers = await sendData("getBetHeaders", null, PN_BG);
          // await delay(1000);
          continue;
        }
      }

      if(!data) break;
      if(!data.bt){
        data = null;
        sendData("resetTimekeyTime", null, PN_BG, true);
        break;
      }

      if(data.bg){
        localStorage.setItem('betGuid', data.bg);
      }

      let bt = data.bt[0];
      let pt = bt.pt[0];
      if(pt.md && pt.md !== "Draw No Bet" && pt.md !== "Match Winner" && pt.md !== "Next Game" && pt.md !== "Most Corners"){
        let h = $(".bss-NormalBetItem_Handicap").text().trim();
        if(pt.hd === undefined && pt.ha === undefined){
          if(h){
            console.error("벳완료창 핸디값 사용", h);
            pt.hd = h;
          }else{
            c++;
            if(c < 4){
              await delay(1000);
              console.error("핸디없음 다시시도.", c);
              log(`벳365정보에 핸디없음. 다시시도(${c})`, "danger", true);
              continue;
            }
          }
        }
      }

      break;
    }


    return data;

    // await until(()=>{
    //   return !!localStorage.getItem('refreshData');
    // }, 10000);

    // let obj;
    // try{
    //   obj = JSON.parse(localStorage.getItem('refreshData'));
    //   console.error("refreshData", obj);
    // }catch(e){
    //   console.error("refreshData parse error");
    // }
    // return obj;
  }

  function padEnd0(n,c=2){
    if(typeof n === "number"){
      n = n.toString();
    }
    return n.replace(/\.(\d+)/, function(f,m){
      return '.' + m.padEnd(c, '0');
    })
  }

  function odCheck(od, odds){
    if(!odds) return od;
    //od가 숫자로만 2자리로 구성되어있으면
    //odds가 2라면 od가 22이런식으로 올때가있다. 확인해주자
    if(/^\d{2}$/.test(od)){
      if(od === ''+odds+odds){
        console.error("od가 잘못옴 보정한다.", od);
        od = ''+odds;
        console.error("od보정:", od);
      }
    }

    return od;
  }

  async function placeBetDirect({betData, stake, odds, od, account}){
    // await refreshslip();
    console.error("placeBetDirect", {betData, stake, odds, od, account});
    let originStake = stake;
    if(betOption.useExchange == 'y'){
      // usd to cny
      stake /= betOption.exchangeRate;
    }
    stake = round(stake, 2);

    let rt = round(stake * odds, 2);
    if(od){
      betData.data.ns = betData.data.ns.replace(/#o=((\d+\/\d+)|(\d+(\.\d+))?)/, function(f,m){
        return "#o=" + od;
      })
    }
    betData.data.ns = betData.data.ns.replace(/st=(\d+(?:\.\d+)?)/g, "st="+padEnd0(stake));
    betData.data.ns = betData.data.ns.replace(/tr=(\d+(?:\.\d+)?)/, "tr="+padEnd0(rt));

    console.error("placeBetDirect update betData", betData);
    let betGuid = localStorage.getItem('betGuid');
    console.error("betGuid", betGuid);
    // let refreshData = localStorage.getItem('refreshData');
    // console.error("refreshData", refreshData);
    if(!betGuid){
      return;
    }

    const params = new URLSearchParams();
    for(let o in betData.data){
      params.append(o, betData.data[o]);
    }
    // var bodyFormData = new FormData();
    // for(let o in data.data){
    //   bodyFormData.append(o, data.data[o]);
    // }
    let headers = await sendData("getBetHeaders", null, PN_BG);
    console.error("bet headers", headers);

    // if(account){
    //   if(account.limited){
    //     let dt = betOption.limitBetDelay || 3;
    //     let rt = Math.random() * dt;
    //     log(`리밋계정 랜덤 딜레이 적용 (${round(rt, 1)}초)`, "warning", true);
    //     await delay(rt * 1000);
    //   }
    // }else{
    //   console.error("계정정보 없음.");
    // }

    // log("배팅!", "warning", true);
    let res = await axios({
      method: "post",
      url: "https://www.bet365.com/BetsWebAPI/placebet?betGuid=" + betGuid,
      data: params,
      headers: headers
    })
    console.error("res", res);

    let info;

    let _od = res.data.bt[0].od;
    console.error("od", _od);

    //od가 숫자로만 2자리로 구성되어있으면
    //odds가 2라면 od가 22이런식으로 올때가있다. 확인해주자
    _od = odCheck(_od, odds);
    // log("인포1", "warning", true);
    if(_od){
      info = await getBetslipInfoForAPI(_od);
      if(!info){
        info = {};
      }
      info.od = _od;
      info.odds = odToOdds(_od);
    }else{
      info = await getBetslipInfoForAPI(odds);
    }
    // log("인포2", "warning", true);

    let _result = {stake:originStake};
    _result.info = info;

    if(res.data.mi == "selections_changed"){
      _result.status = "acceptChange";


    }else{
      // info = await getBetslipInfoForAPI(odds);
      // _result.info = info;
      if(res.data.mi == "stakes_above_max_stake"){
        _result.status = "foundBetmax";
        if(betOption.useExchange == 'y'){
          // cny to usd
          _result.betmax = res.data.bt[0].ms * betOption.exchangeRate;
          //_result.betmax = round(_result.betmax, 2);
        }else{
          _result.betmax = res.data.bt[0].ms;
        }
      }else if(res.data.mi == "allow_login_other"){
        // 폐쇄계정
        _result.status = "restriction";
        _result.message = "폐쇄된 계정";
      // }else if(res.data.br && res.data.ts !== undefined && res.data.bt[0].br && res.data.la[0] && res.data.la[0].ak){
      // }else if(res.data.br && res.data.bt[0].br && res.data.la[0] && res.data.la[0].ak){
      }else if(res.data.mi == "invalid_funds"){
        _result.status = "invalidFunds";
        _result.message = "배팅정보가 잘못됐습니다.";
      }else if(res.data.mi == "unspecified"){
        _result.status = "noReturn";
        console.error("mi == unspecified, 불특정");
      }else{
        // log("완료?"+res.data.br, "warning", true);
        // await delay(50);
        if(res.data.br && res.data.ts !== undefined && res.data.bt[0].br && res.data.la[0] && res.data.la[0].ak){
        // if(res.data.br && res.data.ts !== undefined && res.data.bt[0].br){
          // log("완료1", "warning", true);
          _result.status = "success";
          _result.stake = res.data.ts;
          _result.money = await loadMoney();
          // log("완료2", "warning", true);
        }else{
          _result.status = "noReturn";
        }
      }
    }

    _result.data = res.data;
    return _result;
  }

  function calcBetmax(betType, odds){
    if(betType == "MONEYLINE"){
      return 20 / odds;
    }else{
      return 20 / odds * 0.6;
    }
  }

  function findDummy(){
    let list = ["gl-Participant", "gl-ParticipantOddsOnly", "srb-ParticipantCenteredStackedMarketRow", "gl-ParticipantBorderless", "gl-ParticipantCentered"];
    let n, $el;
    for(let i=0; i<list.length; i++){
      n = list[i];
      $el = $(`.${n}:not(.${n}_Suspended):not(.${n}_Highlighted)`);
      if($el.length > 0){
        $el = $el.eq(0);
        break;
      }
      $el = null;
    }

    return $el;
  }

  function refreshTimekey(){
    console.error("@@refreshTimekey");

    localStorage.removeItem('betGuid');

    var btn = $(".gl-Participant_General:not([class*=_Highlighted]):not([class*=_Suspended])").first()[0];
    btn.click();
    btn.click();

    return until(()=>{
      return !!localStorage.getItem('betGuid');
    }, 5000);
  }

  function sessionActivity(){
    console.log("sessionActivity");
    axios.get("https://www.bet365.com/sessionactivityapi/setlastactiontime");
  }

  var saItv;
  function sessionActivityProcess(){
    clearInterval(saItv);
    saItv = setInterval(()=>{
      sessionActivity();
    }, 1000 * 60 * 3);
  }

  var currentData;
  var placedCompareMessage = "Please check My Bets for confirmation that your bet has been successfully placed.";
  async function onMessage(message){
    if(message.com){
      console.log("onMessage", message);
    }
    let {com, data} = message;
    let resolveData;
    switch(com){

      case "waitTest":
        console.error("wait btn");
        await waitLoading();
        console.error("wait btn complete");
      break;

      // case "betOption":
      //   betOption = data;
      // break;

      case "placebetTest":
        (async ()=>{
          let btns = await findAcceptOrPlacebetOrPlaced(5000);
          await delay(100);
          console.log("find btns", btns);
          let $acceptBtn = btns[0];
          let $placeBetBtn = btns[1];
          let $placed = btns[2];
          if($placeBetBtn){
            console.error("start bet");
            await setStake(1.2);
            $placeBetBtn.click();
            await waitLoading();
            console.error("bet complete");
          }
        })()
      break;

      case "loadMoney":
        let loadedMoney = await loadMoney();
        resolveData = loadedMoney;
      break;

      case "withdrawComplete":
        (()=>{
          let {withdrawKey, money} = data;
          console.error("after withdraw. balance", data);
          if(money != null){
            sendData("updateMoney", money, "server");
          }
          if(window['withdrawResolve_'+withdrawKey]){
            window['withdrawResolve_'+withdrawKey](money);
          }
        })()
      break;

      case "withdraw":
        let withdrawResult = await withdraw(data);
        resolveData = withdrawResult;
      break;

      // case "localhostProcess":
      //   console.error("localhostProcess");
      //   log("localhost발생. 캐시제거", "danger", true);
      //   setInitMessage({com:"reLogin"});
      //   sendData("refreshBet365", null, PN_BG, true);
      // break;

      case "setInitMessage":
        console.log("setInitMessage");
        setInitMessage(data);
      break;

      case "reLogin":
        setInitMessage(message);
        console.log("re login start");
        let itv = setTimeout(()=>{
					console.error("로그인 응답이 20초동안 없음. 강제 새로고침 시도");
					log("로그인 응답이 20초동안 없음. 강제 새로고침 시도", "danger", true);
          sendData("refreshBet365", null, PN_BG, true);
				}, 20 * 1000);
        let money = await login(localStorage.getItem("id"), localStorage.getItem("pw"));
        clearTimeout(itv);
        // delay(2000).then(removeModal);
        // localStorage.setItem("id", data.id);
        // localStorage.setItem("pw", data.pw);
        document.title = localStorage.getItem("id");
        console.log("login. money", money);
        setInitMessage(null);



        resolveData = money;
      break;

      case "login":
        setInitMessage(message);
        console.log("login start");
        let _money = await login(data.id, data.pw);
        // delay(2000).then(removeModal);
        localStorage.setItem("id", data.id);
        localStorage.setItem("pw", data.pw);
        document.title = data.id;
        console.log("login. money", _money);
        setInitMessage(null);
        // let limited = await until(()=>{
        //   let $iframe = $(".lp-UserNotificationsPopup_Frame");
        //   console.error("find iframe");
        //   if($iframe.length == 0){
        //     return false;
        //   }
        //   console.error("found iframe");
        //   let doc = $iframe.get(0).contentDocument;
        //   console.error("?", $(".modal-title", doc).length, $(".modal-title", doc).text());
        //   return $(".modal-title", doc).text().trim() == "Restrictions have been applied to your account";
        // }, 5000);
        // console.log("limited", limited);
        // setData("money", money);
        // resolveData = {money, limited};
        resolveData = _money;
      break;

      case "test":
        console.error("start test");
        let d = await refreshslipApi();
        console.error("test data", d);
      break;

      case "dev":
        try{
          console.log(eval(data));
        }catch(e){
          console.error(e);
        }
      break;

      case "bet365LoginComplete":
        isCheckingMatch = false;
        sessionActivityProcess();
      break;

      case "setBetOption":
        betOption = data.betOption;
      break;

      case "checkPage":
        resolveData = $(".bl-Preloader_Spinner:visible").length>0;
        console.error("@checkPage", resolveData);
      break;

      case "setPreUrl":
        timestamp("setPreUrl");
        // localStorage.setItem("setPreUrl", true);
        localStorage.setItem("setUrl", true);
        // sendData("updatedUrl", null, PN_BG, true);
        betOption = data.betOption;

        console.error("timecheck");
        if(await isTimekeyOver()){
          console.error("set href");
          refreshTimekey();
          // window.location.href = data.url;
        }

        /// test
        // if(betOption.betType == "0414"){
        //   console.error("timecheck");
        //   if(await isTimekeyOver()){
        //     console.error("set href");
        //     refreshTimekey();
        //     // window.location.href = data.url;
        //   }
        //   // else{
        //   //   console.error("mybet click");
        //   //   $(".hm-MainHeaderRHSLoggedInMed_MyBetsLabel").click();
        //   //   await delay(100);
        //   //   $(".myb-MyBetsHeader_Button").last().click();
        //   // }
        // }else{
        //   window.location.href = data.url;
        // }
        ///
      break;

      case "setUrl":
        betOption = data.betOption;
        /// test
        // if(betOption.betType == "0414"){
        //   if(betOption.action !== "checkBetmax"){
        //     console.error("set betslipData", data.betslipData);
        //     if(data.betslipData){
        //       await setBetslipData(data.betslipData);
        //     }
        //   }
        // }
        ///
        if(betOption.action !== "checkBetmax"){
          console.error("set betslipData", data.betslipData);
          if(data.betslipData){
            await setBetslipData(data.betslipData);
          }
        }

        // 작업중0
        timestamp("setUrl");
        // let preUrl = localStorage.getItem("setPreUrl");
        // if(preUrl != data.betLink){
        setInitMessage(message);
        console.error("setUrl", data.data.betLink, "forApi:", data.forApi);
        currentData = data.data;
        // let pf = localStorage.getItem("setPreUrl");
        let f = localStorage.getItem("setUrl");
        console.error('f', f);

        // let isLoading = $(".bl-Preloader:visible").length>0;
        // console.error("isLoading", isLoading);

        if($("body>p").eq(0).text().trim() == "The current page may have been removed, changed or is temporarily unavailable."){
        // if($("#header>h1").text().trim() == "Server Error"){
          resolveData = {
            status: "fail",
            message: "제거된 이벤트",
            benKey: "BK",
            benTime: 0,
            benMsg: "제거된 이벤트",
            toServer: true
          };
          setInitMessage(null);
          window.location.href = "https://www.bet365.com";
          break;
        }

        if(!f){
          console.error("set href");
          localStorage.setItem("setUrl", true);

          /// test
          // if(betOption.betType == "0414"){
          //   if(betOption.action == "checkBetmax"){
          //     window.location.href = data.data.betLink;
          //     resolveData = {passResolve:true};
          //     break;
          //   }else if(await isTimekeyOver()){
          //     await refreshTimekey();
          //     // await delay(1000);
          //   }
          // }else{
          //   window.location.href = data.data.betLink;
          //   resolveData = {passResolve:true};
          //   break;
          // }
          ///
          if(betOption.action == "checkBetmax"){
            window.location.href = data.data.betLink;
            resolveData = {passResolve:true};
            break;
          }else if(await isTimekeyOver()){
            await refreshTimekey();
            // await delay(1000);
          }
        }


        // 0414 &&
        if(betOption.action !== "checkBetmax"){
          let info = await getBetslipInfoForAPI(undefined, data.data.handicap?data.data.handicap:undefined);
          console.error("@@@betslipinfo", info);

          localStorage.removeItem("setUrl");

          if(!info){
            console.error("betslipinfo null, refreshslip이 수신된적이 없는듯");
            resolveData = {
              status: "fail",
              message: "timekey 만료된듯."
            };
          }else if(info.title == "" && info.market == ""){
            console.error("사라진 이벤트1");
            resolveData = {
              status: "fail",
              message: "이벤트 사라짐"
            };
          }else{
            resolveData = info;
          }
          setInitMessage(null);
          break;
        }else{


          let timeout = 2 * 1000;
          let $betslip;

          timestamp("QuickBetslip 찾는중");
          $betslip = await findElAll([
            ".bss-DefaultContent:visible",
            ".qbs-QuickBetslip:visible"
          ], timeout);

          timestamp("QuickBetslip 찾음?");
          console.error("$betslip", $betslip);

          let info = await getBetslipInfoForAPI(undefined, data.data.handicap?data.data.handicap:undefined);
          console.error("@@@betslipinfo", info);

          localStorage.removeItem("setUrl");

          if(!info){
            console.error("betslipinfo null, refreshslip이 수신된적이 없는듯");
            resolveData = {
              status: "fail",
              message: "betslip 못찾음"
            };
            setInitMessage(null);
            break;
          }else if(info.title == "" && info.market == ""){
            console.error("사라진 이벤트1");
            resolveData = {
              status: "fail",
              message: "이벤트 사라짐"
            };
            setInitMessage(null);
            break;
          }else if(info.title != "" && info.market != "" && $(".bl-Preloader_Spinner:visible").length){
            console.error("페이지 로딩바 먹통. 리로드");
            log("로딩중 먹통. 리로드", "danger", true);
            resolveData = {passResolve:true};
            setTimeout(()=>{
              window.location.reload();
            }, 50)
            // resolveData = {
            //   status: "fail",
            //   message: "로딩중 먹통"
            // };
            // setInitMessage(null);
            break;
          }else if(!$betslip[0] && !$betslip[1]){
            timestamp("QuickBetslip 찾는중2");
            $betslip = await findElAll([
              ".bss-DefaultContent:visible",
              ".qbs-QuickBetslip:visible"
            ], timeout);
            timestamp("QuickBetslip 찾음2?");
            console.error("$betslip2", $betslip);
          }


          if(!data.forApi){
            if(!$betslip[0] || $betslip[1]){
              timestamp("betslip없음, Highlighted element 찾는 중");

              let $dummyEl;

              await until(()=>{
                return findDummy();
              }, 5000);

              $dummyEl = findDummy();
              if($dummyEl){

                $dummyEl.click();
                console.error("dummyEl 클릭", $dummyEl[0]);

                $betSlip = await findEl(".bss-DefaultContent", 2000);

                if($betSlip){
                  console.error("betslip 클릭");
                  await delay(100);
                  $dummyEl.click();
                  await delay(100);
                  $betSlip.click();

                  await delay(100);
                  // let $removeItemBtns = await findEl(".bss-NormalBetItem_Remove", 2000);
                  // $removeItemBtns.last().click();
                  console.error("betslip remove 클릭");
                  let removeComplete = await until(()=>{
                    return $(".bss-NormalBetItem_Remove").length == 1;// &&
                    // return $(":regex(class, .*_Highlighted)").length == 1;
                  }, 2000);
                  await delay(200);

                  if(!removeComplete){
                    console.error("Highlighted 클릭처리 실패");
                    setInitMessage(null);
                    return null;
                  }

                  console.error("betslip standard 상태로 전환 완료.");
                }else{
                  // if(info.title != "" && info.market != "" && $(".bl-Preloader_Spinner:visible").length){
                  //   console.error("페이지 로딩바 먹통");
                  //   resolveData = {
                  //     status: "fail",
                  //     message: "로딩중 먹통"
                  //   };
                  //   setInitMessage(null);
                  //   break;
                  // }else{
                    console.error("betslip 못찾음");
                    resolveData = {
                      status: "fail",
                      message: "betslip 못찾음"
                    };
                    setInitMessage(null);
                    break;
                    // return null;
                  // }
                }
              }else{
                console.error("dummyEl 못찾음");
                setInitMessage(null);
                if($(".qbs-QuickBetHeader_MessageBody").text().indexOf("The selection is no longer available") > -1){
                  resolveData = {
                    status: "fail",
                    message: "이벤트 사라짐2"
                  };
                  break;
                }else{
                  return null;
                }
              }
            }else{
              let found = await until(()=>{
                // if(Date.now() - startTime > timeout){
                //   overTimeout = true;
                //   return true;
                // }
                return $(".bss-DefaultContent_TitleText").text().length > 0;
              }, timeout, cancelObj);
            }


            let findBetslipTitle = await until(()=>{
              return $(".bss-NormalBetItem_Title").text().length > 0;
            }, 5000);

            if(!findBetslipTitle){
              console.error("betslip 못찾음");
              setInitMessage(null);
              break;
            }
            // let r = await getBetslipInfo({withMoney:true});
            // r = await getBetslipInfo();
            // r = info;
          }else{
            if(!$betslip[0] && !$betslip[1]){
              console.error("퀵벳슬립이 없다. 이벤트가 사라진듯");
              setInitMessage(null);
              break;
            }
            // timestamp("start load betslip info");
            // r = await getBetslipInfoForAPI();
            // timestamp("end load betslip info");
          }

          // console.error("bet365 bet info", info);


          if(info.title == "" && info.market == ""){
            console.error("사라진 이벤트.");
            resolveData = {
              status: "fail",
              message: "이벤트 사라짐"
            };
          }else{
            resolveData = info;
          }

          setInitMessage(null);
        }
      break;

      case "placeBetDirect":
        // resolveData = await placeBetDirect(data);
        resolveData = await new Promise(resolve=>{
          let complete;
          let itv = setTimeout(()=>{
            if(!complete){
              complete = true;
              log("배팅 타임아웃!", "warning", true);
              resolve(null);
            }
          }, 1000 * 60);
          placeBetDirect(data).then(r=>{
            if(!complete){
              complete = true;
              clearTimeout(itv);
              resolve(r);
            }
          });
        })
      break;

      case "placeBet":
        // setInitMessage(message);
        localStorage.setItem("betting", true);
        await (async ()=>{
          let count = 0, {stake, prevInfo, fixedBetmax} = data, lakeMoney, status = {};
          let exStake = stake;
          if(betOption.useExchange == 'y'){
            // usd to cny
            exStake /= betOption.exchangeRate;
            exStake = round(exStake, 2);
          }
          while(1){
            // inputWithEvent($input[0], stake);
            await delay(100);
            let btns = await findAcceptOrPlacebetOrPlaced(5000);
            await delay(100);
            console.log("find btns", btns);
            let $acceptBtn = btns[0];
            let $placeBetBtn = btns[1];
            let $placed = btns[2];

            // let info = await getBetslipInfo();
            let message;

            if(!$placed && ($placeBetBtn || $acceptBtn)){
              if(status.afterPlaceBet){

              }else if(status.afterAccept){
                // await sendData("afterAccept", info);
                resolveData = {
                  status: "acceptChange",
                  info: await getBetslipInfo()
                }
                break;
              }
            }

            let money = await getMoney();
            console.log("bg money", money);



            lakeMoney = money < stake;
            if(lakeMoney){
              // stake = money;
              resolveData = {
                status: "lakeMoney",
                info: await getBetslipInfo(),
                money,
                stake
              }
              break;
            }



            if($placed){
              console.log("bet complete");
              // await delay(1000);
              // let money = await getMoney();
              let info = await getBetslipInfo();
              if(info.market == ""){
                resolveData = {
                  status: "fail",
                  message: "이벤트 사라짐",
                  info
                };
                break;
              }
              resolveData = {
                status: "success",
                info,
                money,
                stake
              }
              break;
            }else if($placeBetBtn){
              console.log("click placebet");
              status.afterAccept = false;
              if(status.afterPlaceBet){
                if(status.afterPlaceBetCount == undefined) status.afterPlaceBetCount = 0;
                status.afterPlaceBetCount++;
                console.error("placebet", status.afterPlaceBetCount);
                if(status.afterPlaceBetCount > 10){
                  console.error("placebet 반복실패");
                  resolveData = {
                    status: "fail",
                    message: "placebet 반복실패"
                  };
                  break;
                }
              }
              status.afterPlaceBet = true;

              await delay(100);

              // await until(()=>$(".bss-StakeBox_StakeValueInput").length>0);
              // await inputWithEvent(".bss-StakeBox_StakeValueInput", stake);
              // await delay(100);
              await setStake(exStake);
              // await delay(1000);

              let info = await getBetslipInfo();
              if(prevInfo.handicap != info.handicap){
                resolveData = {
                  status: "fail",
                  message: `타입 바뀜 ${prevInfo.handicap} -> ${info.handicap}`
                };
                break;
              }

              $placeBetBtn.click();
              await waitLoading();
              // await delay(1000);
              message = betslipMessage();
              console.error("placebet message:", message);
              if(compareMessage(message, MESSAGE.RESTRICTIONS)){
                resolveData = {
                  status: "restriction",
                  message: "폐쇄된 계정"
                }
                break;
              }

              if(compareMessage(message, MESSAGE.NEED_VERIFY)){
                resolveData = {
                  status: "needVerify",
                  message: "추가인증 필요"
                }
                break;
              }


              // if(compareMessage(message, MESSAGE.NOT_ENOUGH_FUNDS)){
              //   resolveData = {
              //     status: "notEnoughFunds",
              //     message: "잔액부족"
              //   }
              //   break;
              // }
              // if(message.indexOf("sorry, you do have enough funds in your account to place this bet") > -1){
              //   // 잔액부족
              // }
            }else if($acceptBtn){
              betmax = await getBetmax(200);
              status.afterAccept = true;
              status.afterPlaceBet = false;
              status.afterPlaceBetCount = 0;
              console.log("betmax", betmax);
              if(betmax == null){
                console.log("click accept");
                $acceptBtn.click();
              }else if(betmax == 0){
                console.log("betmax is 0");
                resolveData = {
                  status: "fail",
                  message: "betmax 한도없음"
                };
                break;
              }else if(!fixedBetmax){
                console.log("find betmax");
                if(betOption.useExchange == 'y'){
                  // cny to usd
                  betmax *= betOption.exchangeRate;
                  betmax = round(betmax, 2);
                }
                resolveData = {
                  status: "foundBetmax",
                  betmax: betmax,
                  info: await getBetslipInfo()
                }
                break;
              }else{
                // stake = betmax;
                await setStake(exStake);
                $acceptBtn.click();
              }
              await waitLoading();
              // await delay(1000);
              message = betslipMessage();
              console.error("accept message:", message);
            }else{
              let title = $(".bss-NormalBetItem_Title").text();
              if(!title){
                let placedMessage = $(".bs-PlaceBetErrorMessage_Contents").text().trim();
                if(placedMessage == placedCompareMessage){
                  console.log("bet complete");
                  // await delay(1000);
                  // let money = await getMoney();
                  resolveData = {
                    status: "success",
                    info: await getBetslipInfo(),
                    money,
                    stake
                  }
                  break;
                }else{
                  console.error("placeBet, acceptBtn, placed  못찾음", count);
                  count++;
                }
              }else{
                console.error("배팅완료 대기중");
              }
            }

            if(count>=2){
              console.error("너무 많이 못찾음. 문제있다.");
              resolveData = null;
              break;
            }
          }
        })()
        localStorage.removeItem("betting");
        // setInitMessage(null);
      break;

      case "cancelGetBetmax":
        localStorage.setItem("cancelBetmax", true);
        if(!localStorage.getItem("betmaxComplete")){
          await until(()=>{
            return localStorage.getItem("cancelBetmaxComplete");
          })
        }
      break;

      case "getBetmax":
        localStorage.removeItem("cancelBetmax");
        localStorage.removeItem("cancelBetmaxComplete");
        localStorage.setItem("betmaxComplete", false);

        await (async ()=>{
          let betType = data.betType;
          // let accountInfo = data.accountInfo;
          let betmax, count = 0, info, balance, status = {};
          let stake = 0.01;
          // if(accountInfo.limited){
          //   stake = 500;
          // }else{
          //   stake = 0.2;
          // }
          while(1){
            if(localStorage.getItem("cancelBetmax")){
              console.error("cancelGetBetmax!");
              localStorage.removeItem("cancelBetmax");
              localStorage.setItem("cancelBetmaxComplete", true);
              resolveData = null;
              break;
            }
            // inputWithEvent($input[0], stake);
            await delay(100);
            // let btns = await findAcceptOrPlacebetBtn(5000);
            let btns = await findAcceptOrPlacebetOrPlaced(3000);
            console.log("find btns", btns);
            let $acceptBtn = btns[0];
            let $placeBetBtn = btns[1];
            let $placed = btns[2];

            let message;
            message = betslipMessage();
            if(message){
              console.error("getbetmax message:", message);
              if(compareMessage(message, MESSAGE.MINIMUM_STAKE)){
                // let minimumStake = parseFloat(message.replace(/[^0-9.]/g,''));
                // stake = minimumStake;
                // console.error("reset stake:", stake);

                console.log("complete");
                balance = parseMoney($(".bs-Balance_Value").text());
                // info = await getBetslipInfo();
                info = await getBetslipInfoForAPI();
                let betData = await sendData("getBetData", null, PN_BG);
                let betslipData = await sendData("getBetslipData", null, PN_BG);
                betslipData = JSON.parse(JSON.stringify(betslipData));
                let m = betData.data.ns.match(/#o=([^#]+)/);
                if(m && info){
                  let od = m[1];
                  od = odCheck(od, info.odds);
                  info.od = od
                  info.odds = odToOdds(od);

                  betslipData.data.ns = betslipData.data.ns.replace(/#o=([^#]+)/, function(f,m){
                    return "#o=" + od;
                  })

                  console.error("##", {od, odds:info.odds, ns:betslipData.data.ns});
                }

                betmax = calcBetmax(betType, info.odds);
                resolveData = {
                  balance, betmax, info, betData, betslipData
                }
                break;
              }
            }

            if($placed){
              console.error("체크기 배팅돼버림");
              resolveData = {
                status: "placed",
                message: "체크기가 배팅돼버림"
              }

              // if(accountInfo.limited){
              //   console.error("체크기 배팅돼버림");
              //   resolveData = {
              //     status: "placed",
              //     message: "체크기가 배팅돼버림"
              //   }
              // }else{
              //   console.error("체크기 배팅됨");
              //
              //
              //   //#210508
              //   console.log("complete");
              //   balance = parseMoney($(".bs-Balance_Value").text());
              //   // info = await getBetslipInfo();
              //   info = await getBetslipInfoForAPI();
              //   let betData = await sendData("getBetData", null, PN_BG);
              //   let betslipData = await sendData("getBetslipData", null, PN_BG);
              //   betslipData = JSON.parse(JSON.stringify(betslipData));
              //   let m = betData.data.ns.match(/#o=([^#]+)/);
              //   if(m && info){
              //     let od = m[1];
              //     od = odCheck(od, info.odds);
              //     info.od = od
              //     info.odds = odToOdds(od);
              //
              //     betslipData.data.ns = betslipData.data.ns.replace(/#o=([^#]+)/, function(f,m){
              //       return "#o=" + od;
              //     })
              //
              //     console.error("##", {od, odds:info.odds, ns:betslipData.data.ns});
              //   }
              //
              //   betmax = calcBetmax(betType, info.odds);
              //   resolveData = {
              //     balance, betmax, info, betData, betslipData
              //   }
              // }

              break;
            }else if($placeBetBtn){
              if(status.afterPlaceBet){
                if(status.afterPlaceBetCount == undefined) status.afterPlaceBetCount = 0;
                status.afterPlaceBetCount++;
                console.error("placebet", status.afterPlaceBetCount);
                // if(status.afterPlaceBetCount > 5){
                  if($(".lms-StandardLogin_Username:visible").length){
                    console.error("로긴창 발견");
                    resolveData = {
                      status: "logouted"
                    }
                    break;
                  }
                // }
                if(status.afterPlaceBetCount > 3){
                  console.error("placebet 많이 반복됨");
                  resolveData = {
                    status: "fail",
                    message: "placebet 반복실패"
                  }
                  // resolveData = null;
                  break;
                }
              }
              status.afterPlaceBet = true;
              console.log("click placebet");
              await delay(200);

              balance = parseMoney($(".bs-Balance_Value").text());
              // if(accountInfo.limited){
              //   stake = Math.min(Math.floor(balance), 500);
              //   if(isNaN(stake)){
              //     stake = 500;
              //   }
              // }
              // if(await setStake(stake)){
              if(await setStake(stake)){
                $placeBetBtn.click();
                // await waitLoading();

              }else{
                console.error("betslip input 사라짐");
                // info = await getBetslipInfo();
                resolveData = null;
                break;
              }
              // await until(()=>$(".bss-StakeBox_StakeValueInput").length>0, 2000);
              // if($(".bss-StakeBox_StakeValueInput").length){
              //   // inputWithEvent(".bss-StakeBox_StakeValueInput", stake);
              //   // await delay(100);
              //   await setStake(stake);
              //
              //   $placeBetBtn.click();
              // }else{
              //   console.error("betslip input 사라짐");
              //   info = await getBetslipInfo();
              //   resolveData = null;
              //   break;
              // }
            }else if($acceptBtn){
              status.afterPlaceBetCount = 0;

              console.log("click accept");
              $acceptBtn.click();

              // betmax = await getBetmax(500);
              // console.log("betmax", betmax);
              //
              // // if(accountInfo.limited){
              //   if(betmax == null){
              //     console.log("click accept");
              //     $acceptBtn.click();
              //   }else{
              //     console.log("complete");
              //     balance = parseMoney($(".bs-Balance_Value").text());
              //     // info = await getBetslipInfo();
              //     info = await getBetslipInfoForAPI();
              //     let betData = await sendData("getBetData", null, PN_BG);
              //     let betslipData = await sendData("getBetslipData", null, PN_BG);
              //     betslipData = JSON.parse(JSON.stringify(betslipData));
              //     let m = betData.data.ns.match(/#o=([^#]+)/);
              //     if(m && info){
              //       let od = m[1];
              //       od = odCheck(od, info.odds);
              //       info.od = od
              //       info.odds = odToOdds(od);
              //
              //       betslipData.data.ns = betslipData.data.ns.replace(/#o=([^#]+)/, function(f,m){
              //         return "#o=" + od;
              //       })
              //
              //       console.error("##", {od, odds:info.odds, ns:betslipData.data.ns});
              //     }
              //     ///
              //     betmax = calcBetmax(betType, info.odds);
              //     ///
              //     resolveData = {
              //       balance, betmax, info, betData, betslipData
              //     }
              //     break;
              //   }
              // }else{
              //   /// #210508
              //   $acceptBtn.click();
              // }
            }else{
              console.error("placeBet, acceptBtn 둘다 못찾음", count);
              count++;
              if($(".bs-PlaceBetErrorMessage_Contents").length){
                // Please check My Bets for confirmation that your bet has been successfully placed.
                console.error("벳슬립 사라짐");
                resolveData = null;
                break;
              }
            }

            if(count>2){
              console.error("너무 많이 못찾음. 문제있다.");
              resolveData = null;
              break;
            }
          }
          // let betmaxText = (await findEl(".aaa")).text();
          // let betmax = 1;//betmaxText;

          // await pause();
          //여기서 최종 확인된 벳맥스랑, 현재 잔액을 main에 보내자. main에서는 잔액이 이전잔액과 다르면 update요청보내자
        })()
        localStorage.setItem("betmaxComplete", true);

      break;
    }
    return resolveData;
  }

  async function waitLoading(){
    await delay(100);
    return findAcceptOrPlacebetOrPlaced(15000);
    // await until(()=>{
    //   let i = $(".bss-ProcessingButton").length;
    //   console.log("find processing button", i);
    //   return i > 0;
    // });
    // await until(()=>{
    //   let i = $(".bss-ProcessingButton").length;
    //   console.log("wait hide processing button", i);
    //   return i == 0;
    // });
    // await delay(100);
  }

  var messagePromises = window['messagePromises']||{};
  // let messagePromises = {};
  function setupOnMessage(){
    chrome.runtime.onMessage.addListener(async (message,sender,sendResponse)=>{
      // console.log("message", message);
      // let {com, data, to} = message;
      let {com, data, to, from, _code, _rcode} = message;
      let resolveData = await onMessage(message);
      // console.log("resolveData", resolveData);
      // resolveData가 없으면 true
      // resolveData가 있으면 passResolve가 없을때 true
      if(_code && (!resolveData || (resolveData && !resolveData.passResolve))){
        sendResolveData(_code, resolveData, from);
      }else if(_rcode && messagePromises[_rcode]){
        messagePromises[_rcode](data);
      }
    })
  }

  function sendData(com, data, to, noResolve){
    let msg = {com, data, to, from:PN_B365};
    if(noResolve){
      console.log("sendData", msg);
      chrome.runtime.sendMessage(msg);
      return;
    }
    let mid = guid();
    let _code = com+'@'+mid;
    msg._code = _code;

    console.log("sendData", msg);
    chrome.runtime.sendMessage(msg);
    return new Promise(resolve=>{
      messagePromises[_code] = (d)=>{
        delete messagePromises[_code];
        resolve(d);
      }
    })
  }

  function sendResolveData(_code, data, to){
    chrome.runtime.sendMessage({_rcode:_code, data, to, from:PN_B365});
  }

  function round(n,p=0){
    return Math.round(n * Math.pow(10,p))/Math.pow(10,p);
  }

  async function readMoney(timeout=2000){
    await until(()=>{
      return $(".hm-Balance:first").text().replace(/[^0-9]/g, '').length > 0;
    }, timeout);

    // let $pbt = $(".hm-MainHeaderMembersNarrow_MembersWrapper");
    // $pbt.click();
    // await delay(100);
    // $(".um-BalanceRefreshButton").get(0).click();
    // await delay(100);
    // $pbt.click();
    // await until(()=>{
    //   return $(".hm-Balance:first").text().replace(/[^0-9]/g, '').length > 0;
    // }, timeout);
    let money = parseMoney($(".hm-Balance:first").text());
    return money;
  }

  async function getMoney(timeout=2000){
    // await until(()=>{
    //   return $(".hm-Balance:first").text().replace(/[^0-9]/g, '').length > 0;
    // }, timeout);
    //
    // let $pbt = $(".hm-MainHeaderMembersNarrow_MembersWrapper");
    // $pbt.click();
    // await delay(100);
    // $(".um-BalanceRefreshButton").get(0).click();
    // await delay(100);
    // $pbt.click();
    // await until(()=>{
    //   return $(".hm-Balance:first").text().replace(/[^0-9]/g, '').length > 0;
    // }, timeout);
    // let money = parseMoney($(".hm-Balance:first").text());

    let money = await loadMoney();
    // if(betOption.useExchange == 'y'){
    //   if(typeof money === "number"){
    //     // cny to usd
    //     money *= betOption.exchangeRate;
    //     money = round(money, 2);
    //   }
    // }
    return money;
  }

  function parseMoney(str){
    console.error("parseMoney", str);
    return parseFloat(str.replace(/[^0-9.]/g,''));
  }

  async function login(id, pw){

    let $btn = await findEl([
      ".hm-MainHeaderRHSLoggedOutWide_Login",
      ".hm-MainHeaderRHSLoggedOutNarrow_Login",
      ".hm-MainHeaderRHSLoggedOutMed_Login",
      ".hm-Balance"
    ], 15000);

    if(!$btn){
      console.error("로긴버튼이나 잔액을 찾을 수 없음. 새로고침");
      window.location.reload();
      await pause();
      // return null;
    }


    let $money;
    if($btn.hasClass("hm-Balance")){
      // await until(()=>{
      //   return $btn.text();
      // })
      // return parseMoney($btn.text());

      return await loadMoney();
    }else{
      $btn.click();

      let $username = await findEl(".lms-StandardLogin_Username", 10000);

      if(!$username){
        console.error("아이디 입력창을 찾을 수 없음.");
        return null;
      }



      // $(".lms-StandardLogin_Username").val(id);
      inputWithEvent(".lms-StandardLogin_Username", id);
      await delay(200);
      // $(".lms-StandardLogin_Password").val(pw);
      inputWithEvent(".lms-StandardLogin_Password", pw);
      await delay(200);
      $(".lms-StandardLogin_LoginButtonText").click();
      // 여기서 새로고침된다.

      await delay(15000);
      log("로그인 클릭 후 잔액을 확인 할 수 없음. 비번틀렸을 가능성 있음. 수동로긴 대기중");
      await pause();
    }
    //
    // console.log($money);
    // $money = null;
    // if(!$money){
    //   // $money = await findEl(".hm-Balance", 5000);
    //   await delay(5000);
    // }
    //
    // // console.error("$money", $money);
    //
    // if($money){
    //   await until(()=>{
    //     return $money.text();
    //   })
    //   return parseMoney($money.text());
    // }else{
    //   // console.error("로그인 클릭 후 잔액을 확인 할 수 없음. 비번틀렸을 가능성 있음. 수동로긴 대기중");
    //   log("로그인 클릭 후 잔액을 확인 할 수 없음. 비번틀렸을 가능성 있음. 수동로긴 대기중");
    //   $money = await findEl(".hm-Balance");
    //   return parseMoney($money.text());
    //   // return null;
    // }

  }

  function setInitMessage(message){
    sendData("setBet365InitMessage", message, PN_BG, true);
  }

  function setupScreenLock(){
    let msgItv;
    let $msg = $("<span>").css({
      "font-size": "1.5em",
      color: "yellow"
    });
    let $bg = $("<div>").css({
      position: "fixed",
      left: "0px",
      right: "0px",
      top: "0px",
      bottom: "0px",
      "z-index": 999999,
      transition: "all 1s",
      "background-color": "rgba(0, 0, 0, 0)"
    }).on("click", ()=>{
      $bg.css("background-color", "rgba(0, 0, 0, 0.61)");
      $msg.html("조작이 막혀있습니다. '새 탭으로 열기'를 사용하세요");
      clearTimeout(msgItv);
      msgItv = setTimeout(()=>{
        $bg.css("background-color", "rgba(0, 0, 0, 0)");
        $msg.html("");
      }, 3000)
    }).append($msg)
    .appendTo(document.body)
  }

  function addStyleTag(style){
    let s = document.createElement('style');
    s.innerHTML = style;
    document.body.appendChild(s);
  }

  function setupVideoDisable(){
    let css = `.svm-StickyVideoManager_Video{
      display: none !important;
    }`;
    addStyleTag(css);
  }

  function setupModalDisable(){
    let css = `.wcl-ModalManager_DarkWash, .lp-UserNotificationsPopup_FrameContainer, .pm-PushGraphicContainer_DarkWash, .pm-PushGraphicContainer {
      display: none !important;
    }`;
    addStyleTag(css);
  }

  function setupKeyLock(){
    window.addEventListener("keydown", e=>{
      e.preventDefault();
    }, false)
  }

  function setupContextMenuLock(){
    window.addEventListener('contextmenu', e => {
      e.preventDefault();
    }, false);
  }

  window['aleadyInit'] = true;


  function setupMoneyIframe(){
    $('<iframe id="balance_frame" width="1" height="1">').appendTo(document.body);
  }

  function setupWithdrawIframe(){
    $('<iframe id="withdraw_frame" width="1" height="1">').appendTo(document.body);
  }

  // var balanceUrl = "https://members.bet365.com/he/Authenticated/Bank/Balances/?hostedBy=MEMBERS_HOST&mh=1";
  var balanceUrl = "https://members.bet365.com/Members/Services/Bank/Bank/Balance?displaymode=Desktop";
  function loadMoney(){
    // return axios.get("https://www.bet365.com/balancedataapi/pullbalance").then(res=>{
    //   if(res.data){
    //     let m = parseFloat(res.data.split('$')[1]);
    //     if(!isNaN(m)){
    //       if(betOption.useExchange == 'y' && betOption.exchangeRate){
    //           // to usd
    //         m *= betOption.exchangeRate;
    //         m = round(m, 2);
    //       }
    //       return m;
    //     }else{
    //       return null
    //     }
    //   }
    //   return null;
    // })

    return new Promise(resolve=>{
      let key = '' + Date.now() + Math.floor(Math.random()*1000000);
      let url = balanceUrl + '&key=' + key;
      $("#balance_frame").prop("src", url);
      // let win = window.open(url);
      window['loadMoneyResolve_'+key] = function(money){
        delete window['loadMoneyResolve_'+key];
        console.error("betOption", betOption);
        if(betOption.useExchange == 'y' && betOption.exchangeRate){
          if(typeof money === "number"){
            // cny to usd
            money *= betOption.exchangeRate;
            money = round(money, 2);
          }
        }
        resolve(money);
        // win.close();
      };
    })
  }

  var withdrawUrl = "https://members.bet365.com/he/Authenticated/Bank/Withdrawal/?hostedBy=MEMBERS_HOST";
  function withdraw(money){
    return new Promise(resolve=>{
      let data = localStorage.getItem("pw") + ':' + money;
      data = data.split('').reverse().join('');
      data = encodeURIComponent(data);
      let key = '' + Date.now() + Math.floor(Math.random()*1000000);
      let url = withdrawUrl + '&key=' + key + '&data=' + data;
      // $("#withdraw_frame").prop("src", url);
      let win = window.open(url, '_blank');
      window['withdrawResolve_'+key] = function(money){
        delete window['withdrawResolve_'+key];
        resolve(money);
      };
    })
  }

  function setupOnMoneyMessage(){
    window.addEventListener("message", event=>{
      let {key, withdrawKey, money} = event.data;
      if(key){
        console.error("on money message", event);
        console.error('loadMoneyResolve_'+key, window['loadMoneyResolve_'+key]);
        if(window['loadMoneyResolve_'+key]){
          window['loadMoneyResolve_'+key](money);
        }else{
          console.error("존재하지않는 key", key);
        }
      }
      // else if(withdrawKey){
      //   console.error("after withdraw. balance");
      //   sendData("updateMoney", money, "server");
      //   if(window['withdrawResolve_'+withdrawKey]){
      //     window['withdrawResolve_'+withdrawKey]();
      //   }
      // }
    })
  }

  $(document).ready(async ()=>{
    setupScreenLock();
    setupKeyLock();
    setupContextMenuLock();
    setupOnMessage();
    setupMoneyIframe();

    setupOnMoneyMessage();
    setupVideoDisable();
    setupModalDisable();

    let id = localStorage.getItem("id");
    if(id){
      document.title = id;
    }

    // sendData("readyBet365", null, PN_BG);

    // 배팅중에 새로고침 된거라면..
    let f = localStorage.getItem("betting");
    if(f){
      localStorage.removeItem("betting");
      sendData("bettingFail", null, PN_MAIN, true);
    }else{
      sendData("readyBet365", null, PN_BG, true);
    }

  })
}
