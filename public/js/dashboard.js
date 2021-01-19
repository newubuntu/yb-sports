console.log("dashboard.js")

let Vapp;
(async ()=>{

  function setupSocket(){
    // socket.on("setBrowserTitle", (data, pid, bid)=>{
    //   console.log("setBrowserTitle", data, pid, bid);
    //   Vapp.setBrowserIP(pid, bid, data);
    //   // let browser = Vapp.getBrowserObj(pid, bid);
    //   // if(browser){
    //   //   browser.ip = data;
    //   // }
    // })

    // socket.on("receiveIP", (data, pid, bid)=>{
    //   console.log("receiveIP", data, pid, bid);
    //   Vapp.setBrowserIP(pid, bid, data);
    // })

    //from main tab
    socket.on("receiveMatchFlag", (data, pid, bid)=>{
      console.log("receiveMatchFlag", data, pid, bid);
      let browser = Vapp.getBrowserObj(pid, bid);
      if(browser){
        browser.isMatching = data.isMatching;
        Vapp.$forceUpdate();
      }
    })

    //from main tab
    socket.on("receiveState", (data, pid, bid)=>{
      console.log("receiveState", data, pid, bid);
      let browser = Vapp.getBrowserObj(pid, bid);
      if(browser){
        browser.isOn = true;
        browser.ip = data.ip;
        browser.isMatching = data.isMatching;
        Vapp.$forceUpdate();
      }
    })

    socket.on("log", (data, pid, bid)=>{
      console.log("log", data);
      Vapp.updateLog(pid, bid, data);
    })

    socket.on("connectedProgram", pid=>{
      console.log("connected program", pid);
      let program = Vapp.getProgramObj(pid);
      if(program){
        program.connected = true;
        Vapp.$forceUpdate();
      }
    })

    socket.on("disconnectProgram", pid=>{
      console.log("disconnectProgram");
      let program = Vapp.getProgramObj(pid);
      if(program){
        program.connected = false;
        Vapp.$forceUpdate();
      }
    })

    socket.on("addProgram", program=>{
      console.log("receive addProgram", program);
      Vapp.addProgram(program);
    })


    socket.on("removeProgram", pid=>{
      console.log("receive removeProgram", pid);
      Vapp.removeProgram(pid);
    })

    socket.on("addBrowser", (pid, browser)=>{
      console.log("receive addBrowser", pid, browser);
      Vapp.addBrowser(pid, browser);
    })

    socket.on("removeBrowser", (pid, _bid)=>{
      console.log("receive removeBrowser", pid, _bid);
      Vapp.removeBrowser(pid, _bid);
    })

    socket.on("closedBrowser", (data, pid, bid)=>{
      console.log("receive closedBrowser", pid, bid);
      Vapp.setBrowserState(pid, bid, false);
    })

    socket.on("openedBrowser", (data, pid, bid)=>{
      console.log("receive openedBrowser", pid, bid);
      Vapp.setBrowserState(pid, bid, true);
    })



    socket.on("receiveLivingBrowsers", data=>{
      console.log("receiveLivingBrowsers", data);
      let program = Vapp.programs.find(program=>program._id == data.pid);
      // console.log(Vapp.programs.length, program);
      if(program){
        program.connected = !data.exit;
        if(data.browsers){
          program.browsers.forEach(browser=>{
            // console.log("browser", browser);
            let b = data.browsers[browser._id];
            if(data.browsers[browser._id]){
              browser.isOn = true;
              browser.ip = b.ip;
              browser.isMatching = b.isMatching;
            }else{
              browser.isOn = false;
              browser.ip = "";
              browser.isMatching = false;
            }
          })
        }
        // console.log("program", program);
        // program.browsers.forEach(browser=>{
        //   // console.log("browser", browser);
        //   if(data.bids.indexOf(browser._id) > -1){
        //     browser.isOn = true;
        //   }else{
        //     browser.isOn = false;
        //     browser.ip = "";
        //   }
        // })
        Vapp.$forceUpdate();
      }
    })
  }

  Vapp = new Vue({
    el: "#app",
    data: {
      user: user,
      programs: [],
      //money갱신시 쓰임.
      accounts: [],
    },
    async mounted(){
      $(this.$el).removeClass("pre-hide");
      console.log("wait socketReady");
      await socketReady;
      setupSocket();

      console.log("update ip");
      let res = await api.getUser();
      if(res.status == "success"){
        res.data.programs.forEach(program=>{
          program.browsers.forEach(browser=>{
            // console.error("???", program._id, browser._id, "getIP")
            // sendDataToBg(program._id, browser._id, "getIP");
            delay(100).then(()=>{
              // sendDataToBg(program._id, browser._id, "getIP");
              sendDataToBg(program._id, browser._id, "getState");
            })
            this.updateLogScroll(browser._id);
            this.accounts.push(browser.account);
          })
        })

        this.programs = res.data.programs;
      }

      this.$nextTick(()=>{
        appMountedResolve();
      })
    },
    methods: {
      logToHtml(log){
        let d = new Date(log.createdAt);
        let ds = (d.getMonth()+1)+'/'+d.getDate() + ' ' + d.toTimeString().split(' ')[0];
        let dateStr = '<span class="text-white-50">['+ds+']</span>';
        return dateStr + ' ' + '<span>' + log.data.msg + '</span>';
      },
      getProgramObj(pid){
        return this.programs.find(v=>v._id==pid);
      },
      getBrowserObj(pid, _bid){
        let program = this.getProgramObj(pid);
        if(program){
          return program.browsers.find(browser=>browser._id == _bid);
        }
      },
      async startMatch(program, browser){
        // sendDataToMain(program._id, browser._id, "startMatch");
        let data = await sendDataToMainPromise(program._id, browser._id, "startMatch");
        browser.isMatching = data;
        this.$forceUpdate();
      },
      async stopMatch(program, browser){
        // sendDataToMain(program._id, browser._id, "stopMatch");
        let data = await sendDataToMainPromise(program._id, browser._id, "stopMatch");
        browser.isMatching = data;
        this.$forceUpdate();
      },
      sk_addProgram(){
        // console.log("socket", socket);
        socket.emit("addProgram");
      },
      addProgram(program){
        this.programs.push(program);
      },
      async sk_removeProgram(pid){
        if(await modal("알림", `프로그램 ${pid} 를 목록에서 제거하시겠습니까?`, {buttons:['취소', '확인']})){
          socket.emit("removeProgram", pid);
        }
      },
      removeProgram(pid){
        this.programs.find((v,i,a)=>{
          if(v._id == pid){
            a.splice(i, 1);
            return true;
          }else{
            return false;
          }
        })
      },
      //pid 맞다
      async sk_addBrowser(pid){
        socket.emit("addBrowser", pid);
      },
      addBrowser(pid, browser){
        // let program = this.programs.find(v=>v._id==pid);
        let program = this.getProgramObj(pid);
        if(program){
          program.browsers.push(browser);
        }
      },
      async sk_removeBrowser(pid, _bid){
        if(await modal("알림", `프로그램 ${pid}의 브라우져(${_bid})를 목록에서 제거하시겠습니까?`, {buttons:['취소', '확인']})){
          socket.emit("removeBrowser", pid, _bid);
        }
      },
      removeBrowser(pid, _bid){
        // let program = this.programs.find(v=>v._id==pid);
        let program = this.getProgramObj(pid);
        program.browsers.find((v,i,a)=>{
          if(v._id == _bid){
            a.splice(i, 1);
            return true;
          }else{
            return false;
          }
        })
      },
      async sk_openBrowser(pid, _bid){//, isChecker){
        let browser = this.getBrowserObj(pid, _bid);
        if(browser){
          // console.log(browser)
          if(!browser.account){
            modal("알림", `계정연결이 필요한 브라우져입니다.`);
          }else if(!browser.option){
            modal("알림", `옵션연결이 필요한 브라우져입니다.`);
          }else{
            // if(isChecker){
            //   let r = await modal("확인", "다른곳에서 체크기가 켜져있다면 꺼집니다. 계속합니까?", {buttons:["취소", "체크기 켜기"]});
            //   if(!r){
            //     return;
            //   }
            // }
            socket.emit("openBrowser", pid, _bid);//, isChecker);
          }
        }else{
          modal("알림", `브라우져(${_bid})를 찾을 수 없습니다`);
        }
      },
      sk_closeBrowser(pid, _bid){
        socket.emit("closeBrowser", pid, _bid);
      },
      setBrowserState(pid, _bid, opened){
        let browser = this.getBrowserObj(pid, _bid);
        if(browser){
          browser.isOn = opened;
          if(!opened){
            browser.ip = "";
            browser.isMatching = false;
          }
          this.$forceUpdate();
        }
      },
      setBrowserIP(pid, _bid, ip){
        let browser = this.getBrowserObj(pid, _bid);
        if(browser){
          browser.ip = ip;
          this.$forceUpdate();
        }
      },
      updateLog(pid, _bid, data){
        let browser = this.getBrowserObj(pid, _bid);
        if(browser){
          if(browser.logs.length < MAX_LOG_LENGTH){
            browser.logs.push({data, createdAt:new Date()});
          }else{
            browser.logs = browser.logs.slice(-(MAX_LOG_LENGTH-1)).concat({data, createdAt:new Date()});
          }
          this.updateLogScroll(_bid);
        }
      },
      updateLogScroll(_bid){
        setTimeout(()=>{
          let $el = $(`.${_bid}>.browser-logger`);
          $el.scrollTop($el.prop('scrollHeight'));
        },50);
      },
      async openAccountModal(pid, _bid){
        let accounts;
        let res = await api.getLinkedAccounts();
        if(res.status == "success"){
          accounts = res.data.filter(account=>!account.browser);
        }else{
          modal("오류", res.message);
          return;
        }
        // console.log({accounts});
        let browser = this.getBrowserObj(pid, _bid);
        if(accounts.length){
          let selectedAccount;
          let accountElList = accounts.map(account=>{
            return $(`<button class="btn btn-square btn-success btn-account" type="button">[${account.number}] ${account.id}</button>`).on("click", e=>{
              selectedAccount = account;
              modalHide();
            })
          })
          let r = await modal("계정연결", accountElList, {
            buttons: ["닫기", "계정연결 끊기"]
          });
          if(r){
            res = await api.updateBrowser(_bid, {account: null});
            if(res.status == "success"){
              browser.account = null;
              this.$forceUpdate();
            }else{
              modal("알림", `브라우져 업데이트 실패<br>${res.message}`);
            }
            return;
          }
          // console.log(selectedAccount);
          if(selectedAccount){
            if(browser){
              res = await api.updateBrowser(_bid, {account: selectedAccount._id});
              if(res.status == "success"){
                browser.account = selectedAccount;
                this.$forceUpdate();
              }else{
                modal("알림", `브라우져 업데이트 실패<br>${res.message}`);
              }
              // res = await api.updateAccount()
              // console.error(selectedOption);
            }else{
              console.error("bid로 browser객체를 찾을 수 없습니다.");
              modal("알림", "bid로 browser객체를 찾을 수 없습니다.")
              return;
            }
          }
        }else{
          if(browser.account){
            let r = await modal("알림", "연결 가능한 계정이 없습니다.", {
              buttons: ["닫기", "계정연결 끊기"]
            });
            if(r){
              res = await api.updateBrowser(_bid, {account: null});
              if(res.status == "success"){
                browser.account = null;
                this.$forceUpdate();
              }else{
                modal("알림", `브라우져 업데이트 실패<br>${res.message}`);
              }
            }
          }else{
            modal("알림", "연결 가능한 계정이 없습니다.");
          }
        }
      },

      async openOptionModal(pid, _bid){
        let options;
        let res = await api.getOptionList();
        if(res.status == "success"){
          options = res.data;
        }else{
          modal("오류", res.message);
          return;
        }

        if(options.length){
          let selectedOption;
          let optionElList = options.map(option=>{
            return $(`<button class="btn btn-square btn-success ${option.permission=="admin"?"btn-info":"btn-warning"}" type="button">${option.name}</button>`).on("click", e=>{
              selectedOption = option;
              modalHide();
            })
          })
          await modal("옵션선택", optionElList);

          if(selectedOption){
            let browser = this.getBrowserObj(pid, _bid);
            if(browser){
              res = await api.updateBrowser(_bid, {option: selectedOption._id});
              if(res.status == "success"){
                browser.option = selectedOption;
                this.$forceUpdate();
              }else{
                modal("알림", `브라우져 업데이트 실패<br>${res.message}`);
              }
              // console.error(selectedOption);
            }else{
              console.error("bid로 browser객체를 찾을 수 없습니다.");
              modal("알림", "bid로 browser객체를 찾을 수 없습니다.")
              return;
            }
          }
          // console.log(selectedOption);
        }else{
          modal("알림", "등록된 옵션이 없습니다.");
        }
      },

      copyPid(pid){
        var tempElem = document.createElement('textarea');
        tempElem.value = pid;
        document.body.appendChild(tempElem);

        tempElem.select();
        document.execCommand("copy");
        document.body.removeChild(tempElem);

        modal("알림", "PC코드가 클립보드에 복사되었습니다.")
      },
      changeInputMode(pid){
        // console.error("pid", pid);
        let program = this.getProgramObj(pid);
        if(program){
          // console.error($(".pc-name").text());
          program._name = program.name;
          program.name = "";
          this.$forceUpdate();
          setTimeout(()=>{
            $('.'+pid).find(".pc-name-input").focus();
          }, 10)
        }
      },
      onChangeName(e){
        let pid = e.target.dataset.pid;
        let program = this.getProgramObj(pid);

        if(program){
          program.name = e.target.value;
          this.$forceUpdate();
        }

        sendDataToServer("setProgramName", {
          pid, name: program.name
        })
      }
    }
  })//end Vapp

  appReadyResolve();
})()

//
// function _sendData(com, data, pid, to, noResolve){
//   let msg = {com, data, to, from:PN_B365};
//   if(noResolve){
//     console.log("sendData", msg);
//     chrome.runtime.sendMessage(msg);
//     return;
//   }
//   let mid = guid();
//   let _code = com+'@'+mid;
//   msg._code = _code;
//
//   console.log("sendData", msg);
//   chrome.runtime.sendMessage(msg);
//   return new Promise(resolve=>{
//     messagePromises[_code] = (d)=>{
//       delete messagePromises[_code];
//       resolve(d);
//     }
//   })
// }
