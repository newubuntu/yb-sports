console.log("adminAccountWithdrawManager.js");

let Vapp;
(async ()=>{

  startLoading();

  function setupSocket(){

  }

  let _res = await api.getCountryList();
  let countryObj;
  if(_res.status == "success"){
    countryObj = _res.data;
  }else{
    countryObj = {};
  }

  let startPicker, endPicker;
  function setupDatePicker(){
    let datePickerOption = getDatePickerOption();
    startPicker = datepicker('.start-date', datePickerOption);
    endPicker = datepicker('.end-date', datePickerOption)
  }

  Vapp = new Vue({
    el: "#app",
    data: {
      count: 0, //조건에 맞는 계정수
      curPage: 0, //현재 페이지
      startPage: 0, //페이지 버튼에서 시작페이지
      endPage: 0, //페이지 버튼에서 끝페이지
      maxPage: 0, //마지막페이지
      pages: [],
      tab: 0,
      list: [],
      users: [],
      searchId: null,
      email: null,
      check: null,
      checker: null,
      sumWithdraw: 0
    },
    async created(){
      console.log("wait socketReady");
      await socketReady;
      setupSocket();

      let tab, linkPart = window.location.href.split('#')[1];
      tab = parseInt(linkPart);

      setupDatePicker();

      await this.loadList(0, tab||0);

      // switch(tab){
      //   case 0: await this.loadList(0, 0); break;
      //   case 1: await this.loadList(0, 1); break;
      //
      //   default:
      //     await this.loadList();
      // }

      window.addEventListener("keydown", e=>{
        if(e.key == "F5"){
          this.reload();
          api.refreshMoney();
          e.preventDefault();
        }
      })


      this.$nextTick(function() {
        $(this.$el).removeClass("pre-hide");
        // $(".money-input").each((i,el)=>{
        //   setupMoneyInput(el);
        // }).on("input", e=>{
        //   $(e.target).addClass('text-warning');
        // })
        appMountedResolve();
      })
    },

    async mounted(){
    },

    methods: {
      comma(n){
        return comma(Math.floor(n));
      },

      round(n,p=0){
        return Math.round(n * Math.pow(10,p))/Math.pow(10,p);
      },

      printPercent(n){
        return this.round(n*100,2) + '%';
      },

      changeSearchEmail(){
        this.email = $('.search-email').val().trim();
      },

      changeSearchChecker(){
        this.checker = $('.search-checker').val().trim();
      },

      changeSearchCheck(){
        this.check = $('.search-check').val().trim();
      },

      changeSearchId(){
        this.searchId = $('.search-id').val().trim();
      },

      getChekerList(){
        return this.users.filter(u=>u.master||(u.authority&&Object.keys(u.authority).length)).map(u=>u.email);
      },

      setData(data){
        // console.log(data);
        this.list = data.list;
        this.curPage = data.curPage;
        this.startPage = data.startPage;
        this.endPage = data.endPage;
        this.maxPage = data.maxPage;
        this.count = data.count;
        this.users = data.users;
        this.sumWithdraw = data.sumWithdraw;
        let pages = [];
        for(let i=this.startPage; i<=this.endPage; i++){
          pages.push(i);
        }
        this.pages = pages;
      },

      getCurrentOption(){
        return {
          searchId: this.searchId,
          email: this.email,
          checker: this.checker,
          check: this.check
        }
      },

      reload(curPage, tab, newOpt={}){
        let opt = this.getCurrentOption();
        opt = Object.assign(opt, newOpt);
        // console.error("reload", opt);
        return this.loadList(curPage||this.curPage, tab||this.tab, opt);
      },

      resetReload(curPage, tab, opt={}){
        return this.loadList(curPage||this.curPage, tab||this.tab, opt);
      },

      async loadList(curPage=0, tab=0, opt={}){//accountId){
        // accountId = accountId||this.accountId;
        let {searchId, email, check, checker} = opt;
        this.searchId = searchId;
        this.email = email;
        this.checker = checker;
        this.check = check;
        let range = startPicker.getRange();
        range.end = new Date(range.end.getTime() + (1000*60*60*24 - 1000));
        // console.log("loadList page", curPage);
        let query = {curPage, searchId, email, check, range, checker};
        switch(tab){
          case 0: // 전체
          break;
        }

        let res = await api.getWithdraws(query);
        // let res = await api.getApprovals(query);
        this.tab = tab;
        if(res.status == "success"){
          Vmenu.reset(link);
          // console.log(res.data);
          this.setData(res.data);
          // console.error("open option", id, option);
        }else{
          await modal("알림", `리스트 로딩 실패<br>${res.message}`);
          if(res.code == "NO_AUTHENTICATION"){
            gotoLogin();
          }
          return;
        }
      },

      countryName(code){
        // console.error("code", code, countryObj[code]);
        return countryObj[code];
      },

      async doCheckWithdraw(aw){
        let res = await api.checkingWithdraw(aw._id);
        if(res.status == "success"){
          aw.checker = res.aw.checker;
          aw.checkDate = res.aw.checkDate;
          this.$forceUpdate();
        }else{
          modal("알림", `검수처리 실패`);
        }
      }

    }//end methods
  })//end Vapp

  appReadyResolve();
})()
