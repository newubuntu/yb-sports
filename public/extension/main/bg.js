console.log("bg code");
function bgJS(){
  // var require_body_version = 1.0;
  function checkBodyVersion(){
    return window.body_version && window.body_version && window.body_version >= 1.0;
  }
  window.code_version = 1.0;
  console.log({version:window.code_version});

  // if(!window.addedAgentChanger){
  //   window.addedAgentChanger = true;
  //   chrome.webRequest.onBeforeSendHeaders.addListener(
  //     function (details) {
  //       for (var i = 0; i < details.requestHeaders.length; ++i) {
  //         if (details.requestHeaders[i].name === 'User-Agent') {
  //           // details.requestHeaders[i].value = details.requestHeaders[i].value + ' OurUAToken/1.0';
  //           details.requestHeaders[i].value = 'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36';
  //           break;
  //         }
  //       }
  //       return { requestHeaders: details.requestHeaders };
  //     },
  //     { urls: ['https://*.bet365.com/*'] },
  //     ['blocking', 'requestHeaders']
  //   );
  // }

  let betData = {};
  let betHeaders = {};
  let betslipData = {};

  window._onBgMessage = async function _onBgMessage(message){
    let {com, data, from} = message;
    let resolveData;

    switch(com){
      case "withdrawComplete":
        chrome.tabs.query({ active: true }, function(tabs) {
          chrome.tabs.remove(tabs[0].id, ()=>{
            sendData("withdrawComplete", data, PN_B365, true);
          });
        });
        // chrome.tabs.query({url:data.url}, function(tabs){
        //   chrome.tabs.remove(tabs[0].id);
        // });
      break;

  		case "getBalance":
  			resolveData = await papi.getBalance();
  		break;

  		case "getLine":
  			if(!pinnacleSportsMap[data.sports]){
  				console.error("can not find sports object in pinnacleSportsMap", data.sports);
  				break;
  			}

  			let sportId = pinnacleSportsMap[data.sports].id;

  			let eventId = data.eventId;
  			if(data.isLive && data.sports == "Soccer"){
  				console.error("라이브 축구 이벤트ID 다시찾기", data.eventId);
  				try{
  					// 이벤트 id 찾기
  					let teamName = data[data.homeAway];
  					let events = (await papi.getEvents({sportId:sportId, isLive:1})).league;
  					for(let o=0; o<events.length; o++){
  				    let event = events[o].events.find(e=>e[data.homeAway] == teamName);
  				    if(event){
  							eventId = event.id;
  			        console.error("결과", event.id, event);
  			        break;
  			    	}
  					}
  				}catch(e){
  					console.error(e);
  				}
  			}

  			let line = await papi.scGetLine({
  				eventId: eventId,
  				sportId: sportId,
  				isLive: data.isLive,
  				betType: data.betType,
  				team: data.team,
  				side: data.side,
  				periodNumber: data.periodNumber,
  				handicap: data.handicap
  			})

  			resolveData = line;
  		break;

  		case "placeBet":
  			resolveData = await papi.scMinPlaceBet(data);
  		break;

  		case "getBets":
  			resolveData = await papi.getBets({uniqueRequestIds:data});
  		break;

  		case "setBet365InitMessage":
  			// DATA.setBet365InitMessage = data;
  			setData("setBet365InitMessage", data);
  		break;

      case "getBetData":
        // resolveData = betData[tabInfos.bet365.id];
        try{
          resolveData = JSON.parse(JSON.stringify(betData[tabInfos.bet365.id]));
        }catch(e){
          resolveData = undefined
        }
      break;

      case "getBetHeaders":
        resolveData = betHeaders[tabInfos.bet365.id];
      break;

      case "getBetslipData":
        try{
          resolveData = JSON.parse(JSON.stringify(betslipData[tabInfos.bet365.id]));
        }catch(e){
          resolveData = undefined
        }
      break;

  		case "readyBet365":
  			// data.bid, data.email

        /// test
        // break;

        if(!checkBodyVersion()){
          let msg = "업그레이드가 필요한 버전입니다. " + window.body_version;
          log(msg, "danger", true);
          // alert(msg);
          break;
          // throw new Error(msg);
        }

  			try{

  				if(getData("setBet365InitMessage")){
  					let initMessage = getData("setBet365InitMessage");
  					_sendData(initMessage);
  					removeData("setBet365InitMessage");
  					break;
  				}

  				let browser = localStorage.getItem('browser');
  				if(!browser){
  					// sendDataToSite("receiveIP", getData("ip"));

  					let res = await api.loadBrowser(BID);
  					console.log("load browser info", res);
  					if(res.status == "success"){
  						browser = res.data;
  						localStorage.setItem('browser', browser);

  						let account = browser.account;
  						// setProxy(setting['proxyZone-'+account.country], setting['proxyPw-'+account.country]);
  						// test
  						// account = {
  						// 	id: "banu8995",
  						// 	pw: "Asas1234@"
  						// };
  						console.log('login', account);
  						log('벳365 로그인 중.');
  						activeBet365();
  						let itv = setTimeout(()=>{
  							console.error("로그인 응답이 20초동안 없음. 강제 새로고침 시도");
  							log("로그인 응답이 20초동안 없음. 강제 새로고침 시도");
  							refreshBet365();
  						}, 20 * 1000);
  						let money = await sendData("login", account, PN_B365);
  						clearTimeout(itv);
  						activeMain();
  						if(money == null){
  							log('로그인 실패');
  						}else{
  							// log(`벳365 (${account.id}) 로그인 완료. 잔액: ${money}`);
  							// sendDataToServer("updateMoney", money);
  							sendDataToMain("bet365LoginComplete",{
  								account,
                  money,
  								// pinnacleId: getData("pinnacleId"),
  								betOption: browser.option.data,
  								optionName: browser.option.name
  							});
                sendData("setBetOption", {
                  betOption: browser.option.data,
                  optionName: browser.option.name
                }, PN_B365, true);
                // 벳삼은 자주 새로고침된다. 처음에주는건 의미가 없으니 주석. 항상 받아서 사용하자.
                // sendData("betOption", browser.option.data, PN_B365, true);
  							// sendDataToServer("bet365InitData", {
  							// 	money,
  							// 	limited
  							// })
  						}
  					}else{
  						alert(res.message);
  					}
  				}
  			}catch(e){
  				console.error(e);
  			}
  		break;

  		case "getIP":
  			sendDataToSite("receiveIP", getData("ip"));
  			// sendData("receiveIP", getData("ip"), 'site');
  		break;

  		case "getState":
  			sendDataToSite("receiveState", {
  				ip: getData("ip"),
  				isMatching: await sendData("isMatching", null, PN_MAIN)
  			});
  			// sendData("receiveIP", getData("ip"), 'site');
  		break;

      // case "setAgent":
      //   var protocolVersion = '1.0';
      //   chrome.debugger.attach({
      //     tabId: tabInfos.bet365.id
      //   }, protocolVersion, function() {
      //     if (chrome.runtime.lastError) {
      //         console.error(chrome.runtime.lastError.message);
      //         return;
      //     }
      //     // 2. Debugger attached, now prepare for modifying the UA
      //     chrome.debugger.sendCommand({
      //         tabId: tabInfos.bet365.id
      //     }, "Network.enable", {}, function(response) {
      //         // Possible response: response.id / response.error
      //         // 3. Change the User Agent string!
      //         chrome.debugger.sendCommand({
      //             tabId: tabInfos.bet365.id
      //         }, "Network.setUserAgentOverride", {
      //             userAgent: data
      //         }, function(response) {
      //             // Possible response: response.id / response.error
      //             // 4. Now detach the debugger (this restores the UA string).
      //             chrome.debugger.detach({tabId: tabInfos.bet365.id});
      //         });
      //     });
      //   });
      // break;
  	}

    return resolveData;
  }


  function buf2str(buf){
    return decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(buf)));
  }

  chrome.webRequest.onBeforeRequest.addListener(function (details) {
		// console.error("onBeforeRequest", details);
    // let str = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
    if(details.requestBody.raw){
      let str = buf2str(details.requestBody.raw[0].bytes);
      let data = str.split('&').reduce((r,kv)=>{
        if(kv){
          let arr = kv.split('=');
          r[arr.shift()] = arr.join('=');
        }
        return r;
      },{});
      betData[details.tabId] = {
        data
      };
      console.error("betData", betData);
    }
    // return {
    //   requestHeaders: details.requestHeaders
    // };
	}, {
		"urls": ["https://www.bet365.com/BetsWebAPI/placebet*"],
		"types": ["xmlhttprequest"]
	}, ["extraHeaders", "requestBody"]);



  chrome.webRequest.onBeforeRequest.addListener(function (details) {
		// console.error("onBeforeRequest", details);
    // let str = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
    if(details.requestBody.raw){
      let str = buf2str(details.requestBody.raw[0].bytes);
      let data = str.split('&').reduce((r,kv)=>{
        if(kv){
          let arr = kv.split('=');
          r[arr.shift()] = arr.join('=');
        }
        return r;
      },{});

      betslipData[details.tabId] = {
        data
      };
      try{
        console.error("betslipData", JSON.parse(JSON.stringify(betslipData)));
      }catch(e){}
    }
    // return {
    //   requestHeaders: details.requestHeaders
    // };
	}, {
		"urls": ["https://www.bet365.com/BetsWebAPI/refreshslip"],
		"types": ["xmlhttprequest"]
	}, ["extraHeaders", "requestBody"]);


  chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
    console.error("onBeforeSendHeaders", details);
    // betData.url = details.url;
    let xnst = details.requestHeaders.find(h=>h.name=="X-Net-Sync-Term");
    // let ctype = details.requestHeaders.find(h=>h.name=="Content-type");
    betHeaders[details.tabId] = {
      "X-Net-Sync-Term": xnst.value,
      'Content-Type': 'application/x-www-form-urlencoded'
      // "Content-type": ctype.value
    }
    console.error("betHeaders", betHeaders);
  }, {
    "urls": [
      "https://www.bet365.com/BetsWebAPI/refreshslip",
      "https://www.bet365.com/BetsWebAPI/placebet*",
      "https://www.bet365.com/BetsWebAPI/addbet",
      "https://www.bet365.com/BetsWebAPI/removebet"
    ],
		"types": ["xmlhttprequest"]
  }, ["requestHeaders"]);
  //"requestHeaders"
  //https://members.bet365.com/he/Authenticated/Bank/Balances/?hostedBy=MEMBERS_HOST&mh=1
}
