console.log("bet365 code");
function bet365JS(){
  var version = 1.0;

  if(window['aleadyInit']){
    // console.error("이미 코드 실행됨.");
    throw new Error("이미 코드 실행됨.")
  }

  var MESSAGE = {
    RESTRICTIONS: "Certain restrictions may be applied to your account. If you have an account balance you can request to withdraw these funds now by going to the Withdrawal page in Members"
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

  function removeModal(){
    $(".wcl-ModalManager_DarkWash ").remove();
    $(".lp-UserNotificationsPopup_FrameContainer").remove();
    $(".pm-PushGraphicContainer_DarkWash").remove();
    $(".pm-PushGraphicContainer").remove();
  }

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

  async function getBetslipInfo(opt){
    let money;
    // if(opt && opt.withMoney){
    //   money = await getMoneyInBetslip();
    //   // money = await getMoneyInBetslip();
    // }
    money = await getMoney();

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


    return {
      title: $(".bss-NormalBetItem_Title, .qbs-NormalBetItem_Title").text(),
      handicap,
      market,
      odds: parseFloat($(".bs-OddsLabel>span:first").text()),
      desc: $(".bss-NormalBetItem_FixtureDescription, .qbs-NormalBetItem_FixtureDescription").text(),
      handicap2,
      money
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
    await delay(300);
    return f;
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
      case "test":
        resolveData = "test!!" + data;
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
        delay(2000).then(removeModal);
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
        delay(2000).then(removeModal);
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

      case "dev":
        try{
          console.log(eval(data));
        }catch(e){
          console.error(e);
        }
      break;

      case "setUrl":
        timestamp("setUrl");
        setInitMessage(message);
        console.error("setUrl", data.betLink);
        currentData = data;
        let f = localStorage.getItem("setUrl");
        console.error('f', f);

        if($("body>p").eq(0).text().trim() == "The current page may have been removed, changed or is temporarily unavailable."){
        // if($("#header>h1").text().trim() == "Server Error"){
          resolveData = null;
          break;
        }

        if(!f){
          localStorage.setItem("setUrl", true);
          window.location.href = data.betLink;
          // await pause();
          resolveData = {passResolve:true};
          break;
        }
        localStorage.removeItem("setUrl");



        //   localStorage.setItem("setUrl", true);
        // }else{
        //   localStorage.removeItem("setUrl", true);
        // }

        // await delay(4000);

        // let startTime = Date.now();
        let timeout = 20 * 1000;
        // let overTimeout;

        // console.error("check", ".bss-NormalBetItem_Title");

        // let m = await getMoney(timeout);

        timestamp("QuickBetslip 찾는중");
        // console.error("QuickBetslip 찾는중");
        // let $betslip = await findEl(".bss-DefaultContent", 2000);
        // let $betslip = await findEl(".qbs-QuickBetslip", 2000);
        let $betslip = await findElAll([".bss-DefaultContent:visible", ".qbs-QuickBetslip:visible"], timeout);
        // let $betslip = await findEl(".qbs-QuickBetslip", 2000);
        console.error("$betslip", $betslip);

        // await delay(5000);
        $(".svm-StickyVideoManager_Video").remove();

        // if($betslip){
        if(!$betslip[0] || $betslip[1]){
          timestamp("betslip없음, Highlighted element 찾는 중");
          // await delay(200);
          await until(()=>{
            return $(".sip-MarketGroupButton").length>0
          }, 2000);

          let openGroupItv = setInterval(()=>{
            console.error("open click interval")
            $(".sip-MarketGroupButton:not(.sip-MarketGroup_Open)").click();
            console.error('marketGroupButton', $(".sip-MarketGroupButton:not(.sip-MarketGroup_Open)"));
            // let $market = await findEl(".qbs-NormalBetItem_Market", 1000);
            console.error('market', $(".qbs-NormalBetItem_Market").text())
            if($(".qbs-NormalBetItem_Market").text().indexOf("3-Way") > -1){
              click3Way();
            }
          }, 500)

          // let $market = await findEl(".qbs-NormalBetItem_Market", 1000);
          // if($market){
          //   if($market.text().indexOf("3-Way") > -1){
          //     await click3Way();
          //   }
          // }
          // delay(1000).then(()=>{
          //   $(".sip-MarketGroupButton:not(.sip-MarketGroup_Open)").click();
          // })

          // let openGroupItv = setTimeout(()=>{
          //   $(".sip-MarketGroupButton:not(.sip-MarketGroup_Open)").click();
          // }, 4000);

          let cancelObj = {};
          let found = await until(()=>{
            // if(Date.now() - startTime > timeout){
            //   overTimeout = true;
            //   return true;
            // }
            // return $(".bss-DefaultContent_TitleText").text().length > 0;
            // return $(":regex(class, .*_Highlighted)").length > 0;
            return findHighlighted()
          }, 10000, cancelObj);

          clearTimeout(openGroupItv);

          let $selectEl = findHighlighted();
          // let $selectEl = $(":regex(class, .*_Highlighted)");
          // found = $selectEl.length > 0;

          timestamp("찾기결과");
          console.error("Highlighted element", $selectEl);

          if(!$selectEl){
            console.error("선택된 이벤트가 없음.");
            cancelObj.cancel();
            resolveData = {
              status: "fail",
              type: "notFoundSelectedItem"
            };
            break;
          }

          await delay(100);


          let findNext;


          let $dummyEl;

          await until(()=>{
            return $(".gl-ParticipantOddsOnly:not(.gl-ParticipantOddsOnly_Suspended):not(.gl-ParticipantOddsOnly_Highlighted)").length>0;
          }, 2000);

          $dummyEl = $(".gl-ParticipantOddsOnly:not(.gl-ParticipantOddsOnly_Suspended):not(.gl-ParticipantOddsOnly_Highlighted)").eq(0).click();
          if($dummyEl.length == 0){
            $dummyEl = $(".gl-ParticipantCentered").eq(0).click();
          }

          // if($selectEl.hasClass("gl-ParticipantOddsOnly_Highlighted")){
          //   if($selectEl.next(".gl-ParticipantOddsOnly").length){
          //     findNext = true;
          //     $dummyEl = $selectEl.next(".gl-ParticipantOddsOnly").eq(0).click();
          //   }else if($selectEl.prev(".gl-ParticipantOddsOnly").length){
          //     $dummyEl = $selectEl.prev(".gl-ParticipantOddsOnly").eq(0).click();
          //   }else{
          //     if($selectEl.parent().next().length){
          //       findNext = true;
          //       $dummyEl = $selectEl.parent().next().find(".gl-ParticipantOddsOnly").eq(0).click();
          //     }else{
          //       $dummyEl = $selectEl.parent().prev().find(".gl-ParticipantOddsOnly").eq(0).click();
          //     }
          //   }
          // }else if($selectEl.hasClass("gl-ParticipantCentered_Highlighted")){
          //   if($selectEl.parent().next().length){
          //     findNext = true;
          //     $dummyEl = $selectEl.parent().next().find(".gl-ParticipantCentered").eq(0).click();
          //   }else{
          //     $dummyEl = $selectEl.parent().prev().find(".gl-ParticipantCentered").eq(0).click();
          //   }
          // }else{
          //   if($selectEl.next().length){
          //     findNext = true;
          //     $dummyEl = $selectEl.next().click();
          //   }else{
          //     $dummyEl = $selectEl.prev().click();
          //   }
          // }

          console.error("dummyEl 클릭", $dummyEl[0]);

          // if(findNext){
          //   console.error("우");
          // }else{
          //   console.error("좌");
          // }



          $betSlip = await findEl(".bss-DefaultContent", 2000);

          if($betSlip){
            console.error("betslip 클릭");
            await delay(200);
            $dummyEl.click();
            await delay(200);
            $betSlip.click();

            await delay(200);
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
              return null;
            }

            console.error("betslip standard 상태로 전환 완료.");
          }else{
            console.error("betslip 못찾음");
            return null;
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
        // await delay(500);

        setInitMessage(null);
        removeModal();

        // let betslipMoney = await getMoneyInBetslip();
        // console.log({betslipMoney});

        let findBetslipTitle = await until(()=>{
          return $(".bss-NormalBetItem_Title").text().length > 0;
        }, 5000);

        if(!findBetslipTitle){
          console.error("betslip 못찾음");
          return null;
        }
        // let r = await getBetslipInfo({withMoney:true});
        let r = await getBetslipInfo();
        // r.money = await getMoney(10000);
        // let r = {
        //   title: $(".bss-NormalBetItem_Title").text(),
        //   handicap: $(".bss-NormalBetItem_Handicap").text(),
        //   market: $(".bss-NormalBetItem_Market").text(),
        //   odds: parseFloat($(".bs-OddsLabel>span:first").text())
        // }
        console.error("bet365 bet info", r);
        resolveData = r;
      break;

      case "placeBet":
        // setInitMessage(message);
        await (async ()=>{
          let count = 0, {stake, prevInfo, betOption, fixedBetmax} = data, lakeMoney, status = {};
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
              await setStake(stake);
              await delay(100);

              let info = await getBetslipInfo();
              if(prevInfo.handicap != info.handicap){
                resolveData = {
                  status: "fail",
                  message: `타입 바뀜 ${prevInfo.handicap} -> ${info.handicap}`
                };
                break;
              }

              $placeBetBtn.click();
              await delay(1000);
              message = betslipMessage();
              console.error("placebet message:", message);
              if(compareMessage(message, MESSAGE.RESTRICTIONS)){
                resolveData = {
                  status: "restriction",
                  message: "폐쇄된 계정"
                }
                break;
              }

              if(compareMessage(message, MESSAGE.NOT_ENOUGH_FUNDS)){
                resolveData = {
                  status: "notEnoughFunds",
                  message: "잔액부족"
                }
                break;
              }
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
                resolveData = {
                  status: "foundBetmax",
                  betmax: betmax,
                  info: await getBetslipInfo()
                }
                break;
              }else{
                // stake = betmax;
                await setStake(stake);
                $acceptBtn.click();
              }
              await delay(1000);
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
        // setInitMessage(null);
      break;

      case "getBetmax":
        await (async ()=>{
          let betmax, count = 0, info, balance, status = {};

          while(1){
            // inputWithEvent($input[0], stake);
            await delay(100);
            // let btns = await findAcceptOrPlacebetBtn(5000);
            let btns = await findAcceptOrPlacebetOrPlaced(5000);
            console.log("find btns", btns);
            let $acceptBtn = btns[0];
            let $placeBetBtn = btns[1];
            let $placed = btns[2];

            let message;

            if($placed){
              console.error("체크기가 배팅돼버림");
              resolveData = {
                status: "placed",
                message: "체크기가 배팅돼버림"
              }
              break;
            }else if($placeBetBtn){
              if(status.afterPlaceBet){
                if(status.afterPlaceBetCount == undefined) status.afterPlaceBetCount = 0;
                status.afterPlaceBetCount++;
                console.error("placebet", status.afterPlaceBetCount);
                if(status.afterPlaceBetCount > 5){
                  if($(".lms-StandardLogin_Username").length){
                    console.error("로긴창 발견");
                    resolveData = {
                      status: "logouted"
                    }
                    break;
                  }
                }
                if(status.afterPlaceBetCount > 10){
                  console.error("placebet 많이 반복됨");
                  resolveData = null;
                  break;
                }
              }
              status.afterPlaceBet = true;
              console.log("click placebet");
              await delay(200);
              // await sendData("getBetmax", stake);
              balance = parseMoney($(".bs-Balance_Value").text());
              let stake = Math.min(balance, 500);
              if(isNaN(stake)){
                stake = 500;
              }
              if(await setStake(stake)){
                $placeBetBtn.click();
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
              betmax = await getBetmax(500);
              console.log("betmax", betmax);
              if(betmax == null){
                console.log("click accept");
                $acceptBtn.click();
              }else{
                console.log("complete");
                balance = parseMoney($(".bs-Balance_Value").text());
                info = await getBetslipInfo();
                resolveData = {
                  balance, betmax, info
                }
                break;
              }
            }else{
              console.error("placeBet, acceptBtn 둘다 못찾음", count);
              count++;
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

      break;
    }
    return resolveData;
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

  async function getMoney(timeout=2000){
    await until(()=>{
      return $(".hm-Balance:first").text().replace(/[^0-9]/g, '').length > 0;
    }, timeout)
    return parseMoney($(".hm-Balance:first").text());
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
      // $money = $btn;
      await until(()=>{
        return $btn.text();
      })
      return parseMoney($btn.text());
    }else{
      $btn.click();

      let $username = await findEl(".lms-StandardLogin_Username", 5000);

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
    return new Promise(resolve=>{
      let key = '' + Date.now() + Math.floor(Math.random()*1000000);
      let url = balanceUrl + '&key=' + key;
      $("#balance_frame").prop("src", url);
      // let win = window.open(url);
      window['loadMoneyResolve_'+key] = function(money){
        delete window['loadMoneyResolve_'+key];
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

    // setupScreenLock();
    setupKeyLock();
    setupContextMenuLock();
    setupOnMessage();
    setupMoneyIframe();
    // setupWithdrawIframe();
    setupOnMoneyMessage();

    let id = localStorage.getItem("id");
    if(id){
      document.title = id;
    }

    sendData("readyBet365", null, PN_BG);
  })
}
