const {v4:uuidv4} = require('uuid');

module.exports = MD=>{
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
    Log,
    Account,
    Option,
    Approval,
    BetData,
    Event,
    authAdmin,
    authMaster,
    task,
    deposit,
    approvalTask,
    refreshMoney,
    updateBet365Money,
    updateBet365TotalMoney
  } = MD;

  let chekerSocket;
  let chekerBid;
  io.on('connection', socket=>{
    console.log("socket connected", socket.id);
    console.log("socket clients", io.sockets.sockets.keys());
    console.log("socket clients count", io.engine.clientsCount);


    // console.log(io);
    // console.log("socket session", socket.handshake.session);




    socket.on("init", async data=>{
      console.log("init", data);
      let session = socket.handshake.session;
      let email;
      if(!session.user && data.link !== "__program__"){
        console.error("no have session. disconnect socket");
        socket.disconnect(true);
        return;
      }

      if(session.user){
        email = session.user.email;
      }else{
        let user = await User.findOne({programs:{$in:[data.pid]}});
        if(!user){
          console.error("프로그램 연결중 pid를 가진 user를 찾지못함.");
          socket.emit("email", null);
          return;
        }
        email = user.email;
        // email = data.email;
        // let user = await User.findOne({email:email});//.select(["email", "allowed", "authority", "master"]);
        session = {
          user: user,
          admin: !!user.authority || user.master
        }
      }



      if(email){
        socket._email = email;
        socket.join(email);
        socket.join(session.user._id);
        // console.error("socket session", session);
        if(session.admin && data.link !== "__program__"){
          // console.log("@@ join socket admin group");
          socket.join('admin');
        }else if(data.link == "__program__"){
          socket.join("__program__");
          socket.emit("email", email);
        }
        // socket.join([email, data.pageCode]);
      }

      function emitToDashboard(...args){
        let context = io.to(email + "/dashboard");
        context.emit.apply(context, args);
      }

      function emitToDashboardPromise(...args){
        let context = io.to(email + "/dashboard");
        let uuid = uuidv4();
        args.push(uuid);
        context.emit.apply(context, args);
        return new Promise(resolve=>{
          socketResolveList[uuid] = resolve;
        })
      }

      function emitToPrograms(...args){
        let context = io.to(email + "__program__");
        context.emit.apply(context, args);
      }

      function emitToAllPrograms(...args){
        let context = io.to("__program__");
        context.emit.apply(context, args);
      }

      function emitPromise(com, data){
        let uuid = uuidv4();
        socket.emit(com, data, uuid);
        return new Promise(resolve=>{
          socketResolveList[uuid] = resolve;
        })
      }

      socket.join(email+data.link);


      if(session.admin){
        // console.error("@@ listen adminDelivery")
        socket.on("adminDelivery", obj=>{
          console.log("adminDelivery", obj);
          // let {com, data} = obj;
          // console.log(`delivery`, data);
          // io.to(pid).emit(data.com, data.data);
          emitToAdmin(obj.com, obj.data);
        })
      }

      socket.on("resolve", (data, uuid)=>{
        if(socketResolveList[uuid]){
          socketResolveList[uuid](data);
          delete socketResolveList[uuid];
        }
      })

      socket.on("memberDelivery", obj=>{
        console.log("memberDelivery", obj);
        emitToMember(obj.email, obj.com, obj.data);
      })


      if(data.link == "__program__"){
        console.log("program socket init");
        socket._pid = data.pid;
        // programSockets[data.pid] = socket;
        socket.join(data.pid);

        emitToDashboard("connectedProgram", data.pid);

        socket.on("joinChecker", (bid)=>{
          // console.log("@@@has chekerSocket", !!chekerSocket)
          console.log("##joinChecker");
          if(chekerSocket == socket){
            if(chekerBid !== bid){
              chekerSocket.emit("closeBrowser", chekerBid);
              console.log("prev cheker close");
            }
            chekerBid = bid;
          }else{
            if(chekerSocket){
              chekerSocket.leave("__checker__");
              chekerSocket.emit("closeBrowser", chekerBid);
              console.log("prev cheker close");
            }
            socket.join("__checker__");
            chekerSocket = socket;
            chekerBid = bid;
          }
        })

        socket.on("joinDataReceiver", bid=>{
          console.error("####joinDataReceiver");
          socket.join("__data_receiver__");
          // socket.leave("__data_receiver2__");
        })

        socket.on("joinDataReceiver2", bid=>{
          console.error("####joinDataReceiver2");
          socket.join("__data_receiver2__");
          // socket.leave("__data_receiver__");
        })

        socket.on("leaveDataReceiver", bid=>{
          console.error("####leaveDataReceiver");
          socket.leave("__data_receiver__");
        })

        socket.on("leaveDataReceiver2", bid=>{
          console.error("####leaveDataReceiver2");
          socket.leave("__data_receiver2__");
        })

        socket.on("log", async (data, bid)=>{
          emitToDashboard("log", data, socket._pid, bid);
          // io.to(email + "/dashboard").emit("log", data, socket._pid, bid);

          let browser = await Browser.findOne({_id:bid}).populate({
            path: "account",
            model: Account,
            options: {
              select: "id"
            }
          });
          if(!browser){
            console.error("log기록중, browser를 못찾음", bid);
            return;
          }
          let c_log = await Log.create({
            browser: bid,
            bet365Id: browser.account?browser.account.id:"unknown",
            data: data
          });

          // if(browser.logs.length >= config.MAX_LOG_LENGTH){
          //   // browser.logs.shift();
          //   let arr = browser.logs.slice(0, config.MAX_LOG_LENGTH);
          //   arr.forEach(a=>{
          //     browser.logs.pull({_id:a._id});
          //   })
          // }
          // browser.logs.push(c_log._id);
          // await browser.save();

          // 각 브라우져의 log를 모두 가지고 있는일은 위험하다. max log수만큼만
          // 유지하고 나머지는 지우자
          // console.log("Delete log", "$lte", c_log.number-config.MAX_LOG_LENGTH);
          Log.deleteMany({number:{$lte:c_log.number-config.MAX_LOG_LENGTH}});
        })

        socket.on("delivery", async (obj, bid, uuid)=>{
          // let {com, data, bid} = obj;
          let {com, data} = obj;
          // console.log(`delivery ${event}`, data);
          // io.to(email + ":dashboard").emit(com, data, socket._pid, bid);
          if(uuid){
            let r = await emitToDashboardPromise(com, data, socket._pid, bid);
            socket.emit("resolve", r, uuid);
          }else{
            emitToDashboard(com, data, socket._pid, bid);
          }
        })

        // 유저가 배팅한 게임정보를 기록해야 한다.
        // socket.on("betData", obj=>{
        //   obj.user = session.user._id;
        //   // console.log("receive betData", obj);
        //   BetData.create(obj);
        // })

        //정재된 매칭 게임데이터
        socket.on("inputGameData", obj=>{
          console.log("inputGameData", obj);
          io.to("__data_receiver2__").emit("gamedata2", obj);
          // emitToAllPrograms("gamedata2", obj);

          Event.create({
            data: obj
          });
        })

        socket.on("disconnect", ()=>{
          console.log("disconnect program socket", socket._pid);

          if(chekerSocket === socket){
            chekerSocket.leave("__checker__");
            chekerSocket = null;
            chekerBid = null;
          }
          // io.to(email+':dashboard').emit("receiveLivingBrowsers", {pid:socket._pid, bids:[]});
          emitToDashboard("receiveLivingBrowsers", {
            pid:socket._pid,
            exit: true,
            browsers: null
          });
        })



        // from extension bg
        let updateMoneyCallTimes = {};
        socket.on("updateMoney", async (money, bid)=>{
          // extension으로 부터 호출되기 때문에.
          // 잘못된 코드로 반복호출되는 상황을 고려하여 안전장치를 둠.
          // 각 브라우져별로 1초 이내에 재호출된 머니갱신 신호는 무시함.
          // (벳삼머니가 갱신되는것은 한 경기를 깐뒤일거니까, 1초도 짦게설정한거다.)
          if(updateMoneyCallTimes[bid] === undefined){
            updateMoneyCallTimes[bid] = 0;
          }
          let t = Date.now();
          if(t - updateMoneyCallTimes[bid] < 1000){
            return;
          }
          updateMoneyCallTimes[bid] = t;
          // let account = await Account.findOne({browser:bid, trash:false, removed:false})
          // console.log("updateMoney", money, bid);
          let browser = await Browser.findOne({_id:bid, account:{$ne:null}})
          .populate({
            path: "account",
            model: Account
          });

          if(browser){
            // browser.account.money = money;
            // await browser.account.save();

            await updateBet365Money(browser.account, money, true);
            await updateBet365TotalMoney(browser.user, true);
          }
        })
      }else{
        /////////////////////////////////////////////////////////////
        //////////////////////// site socket events /////////////////
        /////////////////////////////////////////////////////////////

        // socket.on("bet365InitData", data=>{
        //   let {money, limited} = data;
        //   console.log("bet365InitData", data);
        // })



        socket.on("setProgramName", ({pid, name})=>{
          Program.findOne({_id:pid}).then(program=>{
            // console.error("!", program);
            program.name = name;
            program.save();
          }).catch(e=>{
            console.error("e", e);
          })
        })

        socket.on("delivery", async (obj, uuid)=>{
          let {data, pid} = obj;
          // console.log(`delivery`, data);
          // io.to(pid).emit(data.com, data.data);
          if(!uuid){
            emitToProgram(pid, data.com, data.data);
          }else{
            // console.log(`delivery promise`, obj, uuid);
            let r = await emitToProgramPromise(pid, data.com, data.data);
            socket.emit("resolve", r, uuid);
          }
        })

        socket.on("addProgram", async ()=>{
          try{
            console.log('receive addProgram', email);
            let user = await User.findOne({email:email});
            if(user.programs.length < user.programCount){
              // console.log('found user', user);
              let program = await user.addProgram();
              // console.log('added program', program);
              socket.emit("addProgram", program);
            }else{
              socket.emit("modal", {
                title: "알림",
                body: `프로그램 생성 수량 ${user.programCount}을(를) 초과합니다. 제한 수량을 늘리려면 관리자에게 문의해주세요`
              });
            }
          }catch(e){
            console.error(e);
          }
        })

        socket.on("removeProgram", async pid=>{
          let user;
          try{
            console.log('receive removeProgram', email, pid);
            user = await User.findOne({email:email});
            await user.removeProgram(pid);
            // io.to(pid).emit("exit");
            emitToProgram(pid, "exit");
            socket.emit("removeProgram", pid);
          }catch(e){
            console.error(e);
          }
        })

        socket.on("addBrowser", async (pid)=>{
          try{
            console.log('receive addBrowser', email, pid);
            let user = await User.findOne({email:email}).select("email browserCount");
            // .populate([
            //   {
            //     path: 'programs',
            //     model: Program,
            //     match: {
            //       _id: pid
            //     }
            //   }
            // ]);
            //console.error("??", user);
            let program = await Program.findOne({_id:pid});
            // let program = user.programs[0];
            // console.log("program", program);
            if(program){
              if(program.browsers.length < user.browserCount){
                let browser = await program.addBrowser();
                if(browser){
                  socket.emit("addBrowser", pid, browser);
                }
              }else{
                socket.emit("modal", {
                  title: "알림",
                  body: `브라우져 생성 수량 ${user.browserCount}을(를) 초과합니다. 제한 수량을 늘리려면 관리자에게 문의해주세요`
                });
              }
            }
          }catch(e){
            console.error(e);
          }
        })

        socket.on("removeBrowser", async (pid, _bid)=>{
          let program;
          try{
            console.log('receive removeBrowser', email, pid, _bid);
            program = await Program.findOne({_id:pid});
            await program.removeBrowser(_bid);
            // io.to(pid).emit("closeBrowser", _bid);
            // emitToProgram(pid, "closeBrowser", _bid);
            closeBrowser(pid, _bid);
            socket.emit("removeBrowser", pid, _bid);
          }catch(e){
            console.error(e);
          }
        })

        function closeBrowser(pid, bid){
          if(chekerSocket === socket){
            socket.leave("__checker__");
            chekerSocket = null;
            chekerBid = null;
          }
          emitToProgram(pid, "closeBrowser", bid);
        }

        socket.on("openBrowser", async (pid, _bid)=>{//, isChecker)=>{
          let browser = await Browser.findOne({_id:_bid, account:{$ne:null}, option:{$ne:null}}).populate([
            {
              path: "option",
              model: Option
            },
            {
              path: "account",
              model: Account,
              options: {
                select: "id pw limited died country money"
              }
            }
          ]);
          // let exists = await Browser.exists({_id:_bid, account:{$ne:null}, option:{$ne:null}});
          if(!browser){
            socket.emit("modal", {
              title: "알림",
              body: `브라우져의 계정연결, 옵션연결을 확인해주세요`
            });
          }else{
            // console.error(session);
            // emitToProgram(pid, "openBrowser", _bid, isChecker&&session.admin);
            emitToProgram(pid, "openBrowser", _bid, browser);
          }
        })

        socket.on("closeBrowser", (pid, _bid)=>{
          // io.to(pid).emit("closeBrowser", _bid);
          // emitToProgram(pid, "closeBrowser", _bid);
          closeBrowser(pid, _bid);
        })
      }

      switch(data.link){
        case "/dashboard":

          // emitToPrograms("getLivingBrowsers");

        break;

        case "__program__":



          // socket.on("receiveLivingBrowsers", data=>{
          //   // data.pid
          //   // data.bids
          //   console.log("receiveLivingBrowsers", socket.id, data);
          //   // 열린 브라우져 목록을 받을 때 마다, 사이트에 갱신을 요구하자.
          //   io.to(email + ":dashboard").emit("receiveLivingBrowsers", data);
          // })


          // socket.on("closedBrowser", (pid, bid)=>{
          //   console.log("closedBrowser", pid, bid);
          //   io.to(email + ":dashboard").emit("closedBrowser", pid, bid);
          // })
          //
          // socket.on("openedBrowser", (pid, bid)=>{
          //   console.log("openedBrowser", pid, bid);
          //   io.to(email + ":dashboard").emit("openedBrowser", pid, bid);
          // })
        break;
          // let testData = [
          //   {
          //     id: "SDFSEG#$%",
          //     browsers: [
          //       {
          //         bet365Id: "b3 accout",
          //         logs: [
          //           '11111',
          //           '22222'
          //         ]
          //       }
          //     ]
          //   }
          // ]
          // socket.emit("receiveProgramList", testData);
      }
    })
    //   socket.join(data.email);
    //   // console.log(socket.adapter.rooms);
    //   socket._email = data.email;
    //   io.to(data.email).emit("join", socket.id);
    //   // io.to(data.email).emit("money", 1111);
    // })

    socket.on("disconnect", ()=>{
      console.log("user is disconnect", socket.id, socket._email);
      socket.leave(socket._email);
    })
  })
}
