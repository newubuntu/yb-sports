console.log("addminAnalysis.js");

let Vapp;
(async () => {



  startLoading();

  function setupSocket() {

  }

  ////// sample
  // [
  //   {
  //     value: 0,
  //     text: '축구'
  //   }, {
  //     value: 1,
  //     text: '테니스'
  //   }, {
  //     value: 2,
  //     text: '하키'
  //   }, {
  //     value: 3,
  //     text: '농구'
  //   }
  //   , {
  //     label: '야구',
  //     options: [{
  //       value: 4,
  //       text: 'enhancement2'
  //     }, {
  //       value: 5,
  //       text: 'bug2'
  //     }]
  //   }
  // ]

  function optionParser(options){
    // console.error("optionParser", options);
    if(Array.isArray(options)){
      return options.map(v=>{
        if(Array.isArray(v)){
          return {
            value: v[0],
            text: v[1]
          }
        }else if(typeof v === "object"){
          if(v.label){
            v.options = optionParser(v.options);
          }
          return v;
        }else{
          return {
            value: v,
            text: v
          };
        }
      })
      // console.error(options);
    }
    return options;
  }

  function setupMultiSelect(selector, options){
    let el = $(selector)[0];
    if(!el){
      console.error("not found element: ", selector);
      return;
    }
    options = optionParser(options);
    return new coreui.MultiSelect(el, {
      multiple: true,
      selectionType: 'tags',
      search: true,
      searchPlaceholder: "전체",
      options: options
    });
  }

  let charts = {
    mainChart: null,
    sportsChart: null,
    betTypeChart: null,
    // oddsChart: null,
    // stakeChart: null
  };

  function updateChartAll(data){
    // console.error("!", data);
    for(let o in data.result){
      // console.error("o", o);
      updateChart(o, data.result[o], data.period);
    }
  }

  function updateChart(name, data, period){
    // console.error("??", name, data, period);


    if(!charts[name]) return;
    if(data.length){
      let check = {};
      let labels = data.map(d=>{
        if(check[d._id.label]) return null;
        if(period == "week"){
          check[d._id.label] = 1;
          let dt = getDateOfWeek(d._id.label);
          return getDateString(dt) + '~'
        }else{
          check[d._id.label] = 1;
          return d._id.label;
        }
      }).filter(a=>!!a)

      let datasets;
      let max = -9999999, min = 9999999;
      if(name == "mainChart"){
        let datas = [[],[]];
        data.forEach(d=>{
          datas[0].push(round(d.siteProfit,2));
          datas[1].push(round(d.bookmakerProfit,2));
          max = Math.max(max, Math.max(d.siteProfit, d.bookmakerProfit));
          min = Math.min(min, Math.min(d.siteProfit, d.bookmakerProfit));
        })

        datasets = [{
          label: '피나클',
          backgroundColor: getRgba("primary", 10),
          borderColor: getColor("primary"),
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          // lineTension: 0.5,
          data: datas[0]
        },{
          label: '벳365',
          backgroundColor: getRgba("success", 10),
          borderColor: getColor("success"),
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          // lineTension: 0.5,
          data: datas[1]
        }]
      }else{
        let datas = {};
        let list = [];
        data.forEach(d=>{
          if(!datas[d._id.key]){
            datas[d._id.key] = [];
            list.push({data:datas[d._id.key], label:d._id.key});
          }
          datas[d._id.key].push(round(d.bookmakerProfit,2));
          max = Math.max(max, d.bookmakerProfit);
          min = Math.min(min, d.bookmakerProfit);
        })

        datasets = list.map(data=>{
          let color = randomColor();
          // console.error("??", color);
          return {
            label: data.label,
            backgroundColor: hexToRgbA(color, 0.1),
            borderColor: color,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            // lineTension: 0.5,
            data: data.data
          }
        })
      }


      charts[name].options.scales.y = {
        suggestedMin: min,
        suggestedMax: max
      }

      charts[name].data.labels = labels;
      charts[name].data.datasets = datasets;
      charts[name].update();
    }
  }

  function updateChartOptions(name, options, doUpdate=true){
    if(!charts[name]) return;

    if(options){
      for(let o in options){
        charts[name].options[o] = options[o];
      }
      if(doUpdate){
        charts[name].update();
      }
    }
  }
  // function getRgba(type, alphaP=100){
  //   return coreui.Utils.hexToRgba(coreui.Utils.getStyle('--'+type, document.getElementsByClassName('c-app')[0]), alphaP);
  // }
  //
  // function getColor(type){
  //   return coreui.Utils.getStyle('--'+type, document.getElementsByClassName('c-app')[0])
  // }

  function setupMainChart() {
    for(let name in charts){
      let el = document.getElementById(name);
      if(!el){
        console.error("not found chart element", name);
        continue;
      }
      let cfg = {
        type: 'line',
        // data: {
        //   labels: [],
        //   datasets: []
        // },
        // data: {
        //   labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
        //   datasets: [{
        //     label: 'My First dataset',
        //     backgroundColor: getRgba("info", 10),
        //     borderColor: getColor("info"),
        //     pointHoverBackgroundColor: '#fff',
        //     borderWidth: 2,
        //     data: [165, 180, 70, 69, 77, 57, 125, 165, 172, 91, 173, 138, 155, 89, 50, 161, 65, 163, 160, 103, 114, 185, 125, 196, 183, 64, 137, 95, 112, 175]
        //   }, {
        //     label: 'My Second dataset',
        //     backgroundColor: 'transparent',
        //     borderColor: coreui.Utils.getStyle('--success', document.getElementsByClassName('c-app')[0]),
        //     pointHoverBackgroundColor: '#fff',
        //     borderWidth: 2,
        //     data: [92, 97, 80, 100, 86, 97, 83, 98, 87, 98, 93, 83, 87, 98, 96, 84, 91, 97, 88, 86, 94, 86, 95, 91, 98, 91, 92, 80, 83, 82]
        //   }, {
        //     label: 'My Third dataset',
        //     backgroundColor: 'transparent',
        //     borderColor: coreui.Utils.getStyle('--danger', document.getElementsByClassName('c-app')[0]),
        //     pointHoverBackgroundColor: '#fff',
        //     borderWidth: 1,
        //     borderDash: [8, 5],
        //     data: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65]
        //   }]
        // },




        options: {
          maintainAspectRatio: false,
          legend: {
            display: true
          },
          scales: {
            y:{
              suggestedMin: -5000,
              suggestedMax: 10000
            },
            xAxes: [{
              gridLines: {
                drawOnChartArea: true
              }
            }]
            // ,
            // yAxes: [{
            //   ticks: {
            //     beginAtZero: true,
            //     maxTicksLimit: 5,
            //     stepSize: Math.ceil(250 / 5),
            //     max: 250
            //   }
            // }]
          },
          elements: {
            point: {
              radius: 2,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3
            }
          }
        }
      }
      charts[name] = new Chart(el, cfg);
    }
  }

  let startPicker, endPicker;

  function setupDatePicker() {
    let today = new Date();
    // let sd = new Date(today.getFullYear(), today.getMonth(), 1);
    let sd = new Date(today.getTime() - 1000*60*60*24*7);
    startPicker = datepicker('.start-date', getDatePickerOption({dateSelected:sd}));
    endPicker = datepicker('.end-date', getDatePickerOption());
  }



  let res = await api.getEmailList();
  let users = res.data||[];



  let ms_sports, ms_bettype, ms_profit_main, ms_user;

  Vapp = new Vue({
    el: "#app",
    data: {
      // count: 0, //조건에 맞는 계정수
      // curPage: 0, //현재 페이지
      // startPage: 0, //페이지 버튼에서 시작페이지
      // endPage: 0, //페이지 버튼에서 끝페이지
      // maxPage: 0, //마지막페이지
      // pages: [],
      // tab: 0,
      // list: [],
      // accountId: null,
      // email: null,
      // status: null,
      // betId: null,
      // eventName: null,
      // betType: null,
      odds1: null,
      oddsCon1: null,
      odds2: null,
      oddsCon2: null,
      period: "day",
      result: {}
      // users: [],
      // user: user
      // statusClassMap:{
      //   open: "badge-primary",
      //   approval: "badge-success",
      //   reject: "badge-danger"
      // }
    },
    async created() {
      console.log("wait socketReady");
      await socketReady;
      setupSocket();

      // let tab, linkPart = window.location.href.split('#')[1];
      // tab = parseInt(linkPart);

      setupDatePicker();
      ms_sports = setupMultiSelect("#select-sports", ["Soccer", "Tennis", "Baseball", "Basketball", "Hockey", "Football"]);
      ms_bettype = setupMultiSelect("#select-bettype", ["MONEYLINE", "SPREAD", "TOTAL_POINTS"]);
      // ms_profit_main = setupMultiSelect("#select-profit-main", [
      //   ["yb", "양빵"],
      //   ["vl-bet365", "벨류-벳365"],
      //   ["vl-pnc", "벨류-피나클"]
      // ]);
      ms_user = setupMultiSelect("#select-user", users.map(u=>u.email));

      // console.error(s);

      setupMainChart();

      await this.loadList();


      window.addEventListener("keydown", e => {
        if (e.key == "F5") {
          this.reload();
          api.refreshMoney();
          e.preventDefault();
        }
      })


      this.$nextTick(function() {
        $(this.$el).removeClass("pre-hide");
        appMountedResolve();
      })
    },

    async mounted() {},

    methods: {
      comma(n) {
        return comma(Math.floor(n));
      },

      round(n, p = 0) {
        if (typeof n === "number") {
          return Math.round(n * Math.pow(10, p)) / Math.pow(10, p);
        } else {
          return 0;
        }
      },

      // printPercent(n) {
      //   return this.round(n * 100, 2) + '%';
      // },

      // printProfit(item) {
      //   return '$' + this.round(calc.profit(item.siteOdds, item.bookmakerOdds, item.siteStake, item.bookmakerStake), 2);
      // },
      //
      // printProfitP(item) {
      //   return this.printPercent(calc.profitP(item.siteOdds, item.bookmakerOdds));
      // },

      changeSearchOdds1() {
        this.odds1 = parseFloat($('.search-odds1').val().trim());
      },

      changeSearchOddsCon1() {
        this.oddsCon1 = $('.search-oddscon1').val().trim();
      },

      changeSearchOdds2() {
        this.odds2 = parseFloat($('.search-odds2').val().trim());
      },

      changeSearchOddsCon2() {
        this.oddsCon2 = $('.search-oddscon2').val().trim();
      },

      setData(data) {
        // console.log(data);
        // this.list = data.list;
        // this.list.forEach(item => {
        //   this.calcPncResult(item);
        //   this.calcBet365Result(item);
        // })
        // this.curPage = data.curPage;
        // this.startPage = data.startPage;
        // this.endPage = data.endPage;
        // this.maxPage = data.maxPage;

        // this.result = data.result || {};

        // updateChartOptions(newOptions, false);
        // console.error("?");
        updateChartAll(data);

        // if(data.result){
        //   this.betSum = data.result.betSum;
        //   this.returnSum = data.result.returnSum;
        //   this.resultSum = data.result.resultSum;
        // }
        // let pages = [];
        // for (let i = this.startPage; i <= this.endPage; i++) {
        //   pages.push(i);
        // }
        // this.pages = pages;
      },

      getCurrentSearchInfo() {
        return {
          // accountId: this.accountId,
          // betId: this.betId,
          // eventName: this.eventName,

          // email: this.email,
          // status: this.status,
          // betType: this.betType,

          sports: ms_sports._selection.map(a=>a.value),
          betTypes: ms_bettype._selection.map(a=>a.value),
          users: ms_user._selection.map(a=>a.value),
          // profitMains: ms_profit_main._selection.map(a=>a.value),
          emails: ms_user._selection.map(a=>a.value),

          period: this.period,
          odds1: this.odds1,
          oddsCon1: this.oddsCon1,
          odds2: this.odds2,
          oddsCon2: this.oddsCon2
        }
      },

      reload(opt = {}) {
        opt = Object.assign(this.getCurrentSearchInfo(), opt);
        return this.loadList(opt);
      },

      resetReload() {
        this.loadList();
      },

      async loadList(opt = {}) { //accountId){
        // accountId = accountId||this.accountId;
        // console.error(opt);
        let {
          sports,
          betTypes,
          users,
          // profitMains,
          emails,
          period,
          odds1,
          oddsCon1,
          odds2,
          oddsCon2
        } = opt;

        // console.error({period});

        if(period){
          this.period = period;
        }else{
          period = this.period;
        }
        this.odds1 = odds1;
        this.oddsCon1 = oddsCon1;
        this.odds2 = odds2;
        this.oddsCon2 = oddsCon2;
        let range = startPicker.getRange();
        range.end = new Date(range.end.getTime() + (1000 * 60 * 60 * 24 - 1000));
        // console.log("date range", range);
        // console.log("loadList page", curPage);
        let query = {
          sports,
          betTypes,
          users,
          emails,
          range,
          period,
          odds1,
          oddsCon1,
          odds2,
          oddsCon2
        };

        // query.admin = true;
        let res = await api.getAnalysis(query);

        if (res.status == "success") {
          Vmenu.reset(link);
          // console.log(res.data);
          this.setData(res.data);
          // console.error("open option", id, option);
        } else {
          await modal("알림", `로딩 실패<br>${res.message}`);
          if (res.code == "NO_AUTHENTICATION") {
            gotoLogin();
          }
          return;
        }
      }


    } //end methods
  }) //end Vapp

  appReadyResolve();
})()
