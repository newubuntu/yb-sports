console.log("socket.js");
var socket;
// var setSocket;
// async function socketReady(){
//   if(socket) return socket;
//   return new Promise(resolve=>{
//     setSocket = resolve;
//   })
// }
var socketReadyResolve;
var socketReady = new Promise(resolve=>{
  socketReadyResolve = resolve;
})

var appReadyResolve;
var appReady = new Promise(resolve=>{
  appReadyResolve = resolve;
});

var appMountedResolve;
var appMounted = new Promise(resolve=>{
  appMountedResolve = resolve;
});

var socketResolveList = {};
function emitPromise(com, data){
  let id = uuid.v4();
  socket.emit(com, data, id);
  return new Promise(resolve=>{
    socketResolveList[id] = resolve;
  })
}

window.addEventListener('load', async ()=>{

  console.log("wait appReady");
  await appReady;
  console.log("set socket");
  console.log(link, user);
  // var socket = io('/'+user.email);
  // var socket = io('ws://localhost:4500', { transports: ['websocket'] });
  // var socket = io('/'+user.email, { transports: ['websocket'] });
  // var socket = io('/'+pageCode, { transports: ['websocket'] });
  try{
    socket = io('/', { transports: ['websocket'] });
  }catch(e){
    console.error(e);
    window.location.reload();
    return;
  }

  socket.on("resolve", (data, uuid)=>{
    if(socketResolveList[uuid]){
      socketResolveList[uuid](data);
      delete socketResolveList[uuid];
    }
  })

  // var socket = io('ws://localhost:4500', { transports: ['websocket'] });
  // var socket = io('ws://localhost:4500');
  socket.on("connect", async ()=>{
    console.log("socket connected");
    socketReadyResolve();
    await appMounted;
    socket.emit("init", {link:link});
  })

  if(user.master){
    if(link !== '/admin/memberManager'){
      socket.on("requestUserRegist", ()=>{
        console.error("requestUserRegist");
        Vmenu.setNew('/admin/memberManager');
      })
    }
  }

  socket.on("menuBadge", data=>{
    console.log("menuBadge", data);
    if(Array.isArray(data)){
      data.forEach(d=>{
        Vmenu.setBadge(d.link, d.text);
      })
    }else{
      Vmenu.setBadge(data.link, data.text);
    }
  })

  function refreshTab(links){
    links = Array.isArray(links) ? links : [links];
    if(links.indexOf(link) > -1 && Vapp.loadList){
      Vapp.loadList(Vapp.curPage, Vapp.tab);
    }
  }

  socket.on("refreshTab", data=>{
    console.log("refreshTab", data)
    refreshTab(data.link);
    // let links = Array.isArray(data.link) ? data.link : [data.link];
    // if(links.indexOf(link) > -1 && Vapp.loadList){
    //   Vapp.loadList(Vapp.curPage, Vapp.tab);
    // }
  })

  // tab을 갱신하고, account.money를 갱신
  socket.on("updateEachBet365Money", data=>{
    console.log("updateEachBet365Money", data);
    refreshTab(data.updateTarget);
    let accounts = Vapp.accounts;

    // console.error("app accounts", accounts);

    if(Array.isArray(accounts)){
      let account = accounts.find(ac=>ac._id==data.account._id);
      if(account){
        // console.error("bet365 money refresh", data.account.money);
        account.money = data.account.money;
      }
      Vapp.$forceUpdate();
    }
  })

  socket.on("modal", data=>{
    modal(data.title, data.body, data.option);
  })

  // socket.on("join", data=>{
  //   console.log('join room:', data);
  // })

  socket.on("updateMoney", money=>{
    console.log("updateMoney:", money);
    if(money.money !== undefined){
      Vmoney.money.site = money.money;
    }
    if(money.wallet !== undefined){
      Vmoney.money.wallet = money.wallet;
    }
    if(money.bet365Money !== undefined){
      Vmoney.money.bet365 = money.bet365Money;
    }
    // Vmoney.money = {
    //   site: money.money,
    //   wallet: money.wallet,
    //   bet365: money.bet365Money
    // }
  })


  // function setupSocket(){
    ///// socket handler /////
    // socket.on("setBrowserTitle", (data, pid, bid)=>{
    //   let browser = Vapp.getBrowserObj(pid, bid);
    //   if(browser){
    //     browser.ip = data;
    //   }
    // })
    //
    // socket.on("log", (data, pid, bid)=>{
    //   console.log("log", data);
    //   Vapp.updateLog(pid, bid, data);
    // })
    //
    // socket.on("connectedProgram", pid=>{
    //   console.log("connected program", pid);
    //   let program = Vapp.getProgramObj(pid);
    //   if(program){
    //     program.connected = true;
    //     Vapp.$forceUpdate();
    //   }
    // })
    //
    // socket.on("disconnectProgram", pid=>{
    //   console.log("disconnectProgram");
    //   let program = Vapp.getProgramObj(pid);
    //   if(program){
    //     program.connected = false;
    //     Vapp.$forceUpdate();
    //   }
    // })
    //
    // socket.on("addProgram", program=>{
    //   console.log("receive addProgram", program);
    //   Vapp.addProgram(program);
    // })
    //
    //
    // socket.on("removeProgram", pid=>{
    //   console.log("receive removeProgram", pid);
    //   Vapp.removeProgram(pid);
    // })
    //
    // socket.on("addBrowser", (pid, browser)=>{
    //   console.log("receive addBrowser", pid, browser);
    //   Vapp.addBrowser(pid, browser);
    // })
    //
    // socket.on("removeBrowser", (pid, _bid)=>{
    //   console.log("receive removeBrowser", pid, _bid);
    //   Vapp.removeBrowser(pid, _bid);
    // })
    //
    // socket.on("closedBrowser", (data, pid, bid)=>{
    //   console.log("receive closedBrowser", pid, bid);
    //   Vapp.setBrowserState(pid, bid, false);
    // })
    //
    // socket.on("openedBrowser", (data, pid, bid)=>{
    //   console.log("receive openedBrowser", pid, bid);
    //   Vapp.setBrowserState(pid, bid, true);
    // })
    //
    // socket.on("receiveIP", (data, pid, bid)=>{
    //   console.log("receiveIP", data, pid, bid);
    //   Vapp.setBrowserIP(pid, bid, data);
    // })
    //
    // socket.on("receiveLivingBrowsers", data=>{
    //   console.error("receiveLivingBrowsers", data);
    //   let program = Vapp.programs.find(program=>program._id == data.pid);
    //   // console.log(Vapp.programs.length, program);
    //   if(program){
    //     program.connected = !data.exit;
    //     // console.log("program", program);
    //     program.browsers.forEach(browser=>{
    //       // console.log("browser", browser);
    //       if(data.bids.indexOf(browser._id) > -1){
    //         browser.isOn = true;
    //       }else{
    //         browser.isOn = false;
    //         browser.ip = "";
    //       }
    //     })
    //     Vapp.$forceUpdate();
    //   }
    // })
  // }

  // switch(link){
  //   case "/dashboard":
  //   break;
  // }


})

function openBrowser(pid, bid){
  socket.emit("openBrowser", pid, bid);
}

function closeBrowser(pid, bid){
  socket.emit("closeBrowser", pid, bid);
}

function sendDataToAdmin(com, data){
  socket.emit("adminDelivery", {com, data});
}
// socket.emit("closeBrowser", pid, _bid);
function sendDataToMember(email, com, data){
  socket.emit("memberDelivery", {com, data, email});
}

//to program socekts
function sendDataToServer(com, data){
  socket.emit(com, data)
}

function sendDataToProgram(pid, com, data){
  socket.emit("delivery", {pid, data:{com, data}})
}

function sendDataToMain(pid, bid, com, data){
  socket.emit("delivery", {
    pid,
    data:{
      com:"toMain",
      data: {com, data, bid, from:"dashboard"}
    }
  })
}

function sendDataToMainPromise(pid, bid, com, data){
  return emitPromise("delivery", {
    pid,
    data:{
      com:"toMain",
      data: {com, data, bid, from:"dashboard"}
    }
  })
}

function sendDataToBg(pid, bid, com, data){
  socket.emit("delivery", {
    pid,
    data:{
      com:"toBg",
      data: {com, data, bid, from:"dashboard"}
    }
  })
}

function sendDataToBet365(pid, bid, com, data){
  socket.emit("delivery", {
    pid,
    data:{
      com:"toBet365",
      data: {com, data, bid, from:"dashboard"}
    }
  })
}
