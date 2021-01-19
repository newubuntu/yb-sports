console.log("adminOptionManager.js");

let Vapp;
(async ()=>{
  let optionDataFormat = [
    {
      name: "사용권한",
      key: "permission",
      value: "all",
      list: [
        {
          name: "전체",
          value: "all"
        },
        {
          name: "관리자",
          value: "admin"
        }
      ],
      type: "select"
    },
    {
      name: "데이터 타입",
      key: "dataType",
      value: "betmax",
      list: [
        {
          name: "벳맥스",
          value: "betmax"
        },
        {
          name: "벳버거",
          value: "betburger"
        }
      ],
      type: "select"
    },
    {
      name: "동작",
      key: "action",
      value: "yb",
      list: [
        {
          name: "벳맥스 체크 (데이터 수집기)",
          value: "checkBetmax"
        },
        {
          name: "양빵",
          value: "yb"
        },
        {
          name: "벨류",
          value: "vl"
        }
      ],
      type: "select"
    },
    {
      type: "hr"
    },
    {
      name: "벨류 고정 betmax",
      key: "customBetmax",
      value: 20,
      type: "number",
      prepend: "$"
    },
    {
      name: "양빵 betmax 제한",
      key: "maxBetmax",
      value: 20,
      type: "number",
      help: "체크기 옵션",
      prepend: "$"
    },
    {
      name: "최소 수익률",
      key: "profitP",
      value: 1,
      type: "number",
      append: "%"
    },
    {
      name: "최소 수익달러",
      key: "profit",
      value: 1,
      type: "number",
      prepend: "$"
    },
    // {
    //   name: "최소 수익달러",
    //   key: "profit",
    //   value: 1,
    //   type: "number",
    //   prepend: "$"
    // }
    // {
    //   name: "테스트1",
    //   key: "test1",
    //   value: "t1",
    //   placeholder: "테스트1 입력하세요",
    //   help: "help text",
    //   type: "text"
    // },
    // {
    //   name: "테스트2",
    //   key: "test2",
    //   value: "t1",
    //   list: [
    //     {
    //       name: "티1",
    //       value: "t1"
    //     },{
    //       name: "티2",
    //       value: "t2"
    //     },{
    //       name: "티3",
    //       value: "t3"
    //     }
    //   ],
    //   type: "select"
    // },
    // {
    //   name: "테스트3",
    //   key: "test3",
    //   list: ["t1", "t2", "t3"],
    //   value: {
    //     "t1": false,
    //     "t2": false,
    //     "t3": false
    //   },
    //   type: "checkbox"
    // },
    // {
    //   name: "테스트4",
    //   key: "test4",
    //   list: ["t1", "t2", "t3"],
    //   value: "t1",
    //   type: "radio"
    // }
  ]

  // list가 문자열로 된 것들을 오브젝트형태로 통일하자.
  optionDataFormat.forEach(obj=>{
    if(Array.isArray(obj.list)){
      obj.list.forEach((item, i, arr)=>{
        if(typeof item !== "object"){
          arr[i] = {
            name: item,
            value: item
          }
        }
      })
    }
  })

  let defaultOption = {
    _id: "",
    name: "",
    data: optionDataFormat.reduce((r, form)=>{
      r[form.key] = form.value;
      return r;
    }, {})
  }

  // console.log("defaultOption", defaultOption);

  Vapp = new Vue({
    el: "#app",
    data: {
      optionId: "",
      optionName: "",
      options: [],
      forms: []
    },
    async created(){
      console.log("wait socketReady");
      await socketReady;

      let options;

      let res = await api.getOptionList();
      if(res.status == "success"){
        options = res.data;
      }else{
        modal("오류", res.message)
        return;
      }

      // console.log("load option list", options);

      if(options){
        this.options = options;
      }

      this.forms = JSON.parse(JSON.stringify(optionDataFormat));
      this.formsMap = this.forms.reduce((r,form)=>{
        if(form.key){
          r[form.key] = form;
        }
        return r;
      }, {});

      $(this.$el).removeClass("pre-hide");

      this.$nextTick(function() {
        this.$form = $(".option-form").remove();
        appMountedResolve();
      })
    },
    async mounted(){
    },
    methods: {
      // async getOptionFormat(){
      //   return optionDataFormat;
      // },

      optionNameValidationReset(){
        $("#optionName").removeClass('is-invalid');
        $("#optionNameValidMessage").hide();
      },

      optionNameValidation(){
        if(!this.optionName){
          $("#optionName").addClass('is-invalid');
          $("#optionNameValidMessage").show();
          return false;
        }else{
          this.optionNameValidationReset();
          return true;
        }
      },

      getOptionForm(){
        this.optionNameValidationReset();
        return this.$form;
      },

      async openOptionRegistModal(){
        this.setOptionData(defaultOption);
        let result = await modal("옵션등록", this.getOptionForm(), {
          buttons:['취소', '등록'],
          lock:true,
          size:'lg',
          validation: this.optionNameValidation
        })

        if(result){
          let option = this.getOptionData();
          // console.error("regist option", JSON.parse(JSON.stringify(option)));
          let res = await api.registOption(option);
          if(res.status == "success"){
            // modal("알림", `옵션 ${option.name} 등록 성공`);
            option._id = res.data;
            this.options.push(option);
          }else{
            modal("알림", res.message);
          }
        }
      },

      update(event){
        let key = event.target.id.split('_');
        let value = event.target.value;

        // console.error(key, value, this.formsMap[key[0]]);
        if(key[0] == "optionName"){
          this.optionName = value;
          this.optionNameValidation();
        }else{
          let form = this.formsMap[key[0]];
          if(form){
            if(form.type == 'checkbox'){
              // console.log(event.target.checked);
              form.value[key[1]] = event.target.checked;
            }else if(form.type == 'radio'){
              if(event.target.checked){
                form.value = key[1];
              }
            }else{
              form.value = value;
            }
          }
        }
        // console.log(key, value, this.formsMap, this.forms);
      },

      getOptionData(){
        let opt = {};
        for(let key in this.formsMap){
          opt[key] = this.formsMap[key].value;
        }
        return {
          _id: this.optionId,
          name: this.optionName,
          permission: opt.permission,
          data: JSON.parse(JSON.stringify(opt))
        }
      },

      setOptionData(option){
        option = JSON.parse(JSON.stringify(option));
        this.optionName = option.name;
        this.optionId = option._id;
        // console.log(option);
        for(let key in this.formsMap){
          // console.log(key, this.formsMap[key], option.data[key]);
          if(this.formsMap[key]){
            this.formsMap[key].value = option.data[key] || "";
          }
        }
        // this.$forceUpdate();
      },
      // async registOption(option){
      //   // 옵션 데이터 추출
      //   // 서버전달
      //   // 응답 처리
      //   // let option = getOptionData();
      //   let res = await api.registOption(option);
      //   if(res.status == "success"){
      //     this.options.push(option);
      //     modal("알림", `옵션 [${option.name}] 등록 완료`);
      //   }else{
      //     modal("옵션등록 실패", res.message);
      //   }
      // },

      async removeOption(id){
        let index;
        let option = this.options.find((opt,i)=>{
          let f = opt._id==id;
          if(f){
            index = i;
          }
          return f;
        });
        if(!option){
          modal("알림", `${id} 옵션을 찾을 수 없습니다.`);
          return;
        }
        if(!(await modal("옵션제거", `옵션 '${option.name}'을 제거하시겠습니까?`, {buttons:["취소", "제거"]}))) return;

        let res = await api.removeOption(id);
        if(res.status == "success"){
          this.options.splice(index, 1);
          modal("알림", `옵션 '${option.name}' 을 제거했습니다`);
        }else{
          modal("알림", `옵션제거 실패.<br>${res.message}`);
        }
      },

      async openOptionModal(id){
        let res = await api.getOptions([id]);
        let option;
        // console.error(res);
        if(res.status == "success"){
          option = res.data[0];
          // console.error("open option", id, option);
        }else{
          modal("알림", `옵션(${id}) 로딩 실패<br>${res.message}`);
          return;
        }
        this.setOptionData(option);
        let result = await modal("옵션수정", this.getOptionForm(), {
          buttons:['취소', '저장'],
          lock:true,
          size:'lg',
          validation: this.optionNameValidation
        });

        if(result){
          option = this.getOptionData();
          res = await api.updateOption(option._id, option);
          if(res.status == "success"){
            let originOption = this.options.find(opt=>opt._id==option._id);
            if(originOption){
              originOption.name = option.name;
              modal("알림", `옵션 '${option.name}'이 저장됐습니다.`)
            }else{
              modal("알림", `옵션저장 실패<br>${option._id} 옵션을 찾을 수 없습니다. `);
            }
          }else{
            modal("알림", `옵션저장 실패<br>${res.message}`);
          }
        }
      }
    }
  })//end Vapp

  appReadyResolve();
})()
