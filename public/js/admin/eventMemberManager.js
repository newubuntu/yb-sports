console.log("adminEventMemberManager.js");

let Vapp;
(async ()=>{

  function setupSocket(){
    // socket.on("requestUserRegist", async ()=>{
    //   console.error("requestUserRegist2");
    //   await Vapp.loadList();
    //   Vmenu.setNew(link);
    // })
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
      users: [],
      email: "",
      fromEmail: "",
      filename: [
        "신분증(앞)",
        "신분증(뒤)",
        "들찍"
      ],
      $previewCon: null,
      previewImage: null,
      $payForm: null,
      payCode: "",
      payPrice: 0,
      $authForm: null,
      authLink: ""
    },
    async created(){
      console.log("wait socketReady");
      await socketReady;
      setupSocket();

      let tab, linkPart = window.location.href.split('#')[1];

      tab = parseInt(linkPart);
      await this.loadList(0, tab||0);

      // window.addEventListener("keydown", e=>{
      //   if(e.key == "F5"){
      //     this.reload();
      //     api.refreshMoney();
      //     e.preventDefault();
      //   }
      // })

      this.$previewCon = $(`
      <div class="card border-info preview-con hide">
        <div class="card-header">
          <span class="preview-title"></span>
        </div>
        <div class="card-body">
          <img class="preview-image" width="100%"/>
        </div>
      </div>
      `).appendTo(document.body);

      this.previewImage = $(".preview-image").get(0);
      // console.log(this.previewImage);
      this.$payForm = $(".pay-form").remove();

      this.$authForm = $(".auth-form").remove();

      this.$nextTick(function() {
        $(this.$el).removeClass("pre-hide");
        appMountedResolve();
      })
    },

    mounted(){
    },

    updated(){
    },

    methods: {
      comma(n){
        return comma(Math.floor(n));
      },

      reload(){
        this.loadList(this.curPage, this.tab);
      },

      // openAuthModal(user){
      //   this.authModalUser = user;
      //   modal(`권한설정 (${user.email})`, this.$authTable, {
      //     buttons: ["닫기"],
      //     lock: true
      //   })
      // },


      onUpdatePayPrice(event){
        this.payPrice = event.target.value;
      },

      onUpdatePayCode(event){
        this.payCode = event.target.value;
      },

      onUpdateAuthLink(event){
        this.authLink = event.target.value;
      },

      openPayModal(){
        this.payPrice = "";
        this.payCode = "";
        delay(500).then(()=>{
          this.$payForm.find("input").eq(0).focus();
        })
        return modal(`문상지급`, this.$payForm, {
          buttons: ["취소", "지급"],
          lock: true
        })
      },

      openAuthLinkModal(){
        this.authLink = "";
        delay(500).then(()=>{
          this.$authForm.find("input").focus();
        })
        return modal(`인증링크전송`, this.$authForm, {
          buttons: ["취소", "전송"],
          lock: true
        })
      },

      showImage(event, title, url){
        this.previewImage.src = url;
        this.$previewCon.removeClass("hide");
        this.$previewCon.find(".preview-title").html(title);
      },

      hideImage(event){
        this.previewImage.src = "";
        this.$previewCon.addClass("hide");
      },

      changeSearchEmail(){
        this.email = $('.search-email').val().trim();
      },

      changeSearchFromEmail(){
        this.fromEmail = $('.search-from-email').val().trim();
      },

      setData(data){
        // console.log(data);
        this.users = data.users;
        this.curPage = data.curPage;
        this.startPage = data.startPage;
        this.endPage = data.endPage;
        this.maxPage = data.maxPage;
        this.count = data.count;
        let pages = [];
        for(let i=this.startPage; i<=this.endPage; i++){
          pages.push(i);
        }
        this.pages = pages;
      },

      getCurrentSearchInfo(){
        return {
          fromEmail:this.fromEmail,
          email:this.email
        }
      },

      reload(curPage, tab, opt={}){
        opt = Object.assign(this.getCurrentSearchInfo(), opt);
        return this.loadList(or(curPage,this.curPage), or(tab,this.tab), opt);
      },

      resetReload(curPage, tab){
        this.loadList(or(curPage,this.curPage), or(tab,this.tab));
      },

      async loadList(curPage=0, tab=0, opt={}){
        // console.log("loadList page", curPage);
        let {fromEmail, email} = opt;
        this.fromEmail = fromEmail;
        this.email = email;
        let query = {curPage, fromEmail, email};

        switch(tab){
          case 0: // 전체
            query.removed = false;
          break;

          case 1: // 승인전
            query.approved = false;
            query.paid = false;
            query.removed = false;
          break;

          case 2: // 지급전
            query.approved = true;
            query.paid = false;
            query.removed = false;
          break;

          case 3: // 지급완
            query.approved = true;
            query.paid = true;
            query.removed = false;
          break;

          case 4: // 휴지통
            query.removed = true;
          break;
        }

        let res = await api.getEventUsers(query);
        this.tab = tab;
        if(res.status == "success"){
          // Vmenu.reset(link);
          // console.log(res.data);
          this.setData(res.data);
          // console.error("open option", id, option);
        }else{
          await modal("알림", `멤버 로딩 실패<br>${res.message}`);
          if(res.code == "NO_AUTHENTICATION"){
            gotoLogin();
          }
          return;
        }
      },

      getUserObj(id){
        return this.users.find(opt=>opt._id==id);
      },

      pullUserObj(idOrObj){
        let id;
        if(typeof idOrObj === "object"){
          id = idOrObj._id;
        }else if(typeof idOrObj === "string"){
          id = idOrObj;
        }

        if(id){
          let index;
          let user = this.users.find((opt,i)=>{
            if(opt._id==id){
              index = i;
              return true;
            }
          });
          this.users.splice(index, 1);
          return user;
        }
      },

      async requestApproveUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let r = await this.openAuthLinkModal();
        if(r){
          if(!this.authLink){
            modal("오류", "링크가 입력되지 않았습니다.");
            return;
          }
          let res = await api.requestApproveEventUser(id, encodeURIComponent(this.authLink));
          if(res.status == "success"){
            // await this.loadList(this.curPage, this.tab);
            modal("알림", `${user.name}(${user.email})에게 인증요청 이메일 발송완료`);
          }else{
            modal("오류", "인증요청처리 실패<br>" + res.message);
          }
        }
      },

      async approveUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let res = await api.approveEventUser(id);
        if(res.status == "success"){
          await this.loadList(this.curPage, this.tab);
          // modal("알림", `멤버 ${user.email} 승인 완료`);
        }else{
          modal("오류", "승인처리 실패<br>" + res.message);
        }
      },

      async cancelApproveUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let res = await api.updateEventUser(id, {approved:false});
        if(res.status == "success"){
          await this.loadList(this.curPage, this.tab);
          // modal("알림", `멤버 ${user.email} 승인 완료`);
        }else{
          modal("오류", "승인취소 처리 실패<br>" + res.message);
        }
      },



      async payUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let r = await this.openPayModal();
        if(r){
          if(!this.payPrice){
            modal("오류", "금액이 입력되지 않았습니다.");
            return;
          }
          if(!this.payCode){
            modal("오류", "코드가 입력되지 않았습니다.");
            return;
          }
          // console.log(this.payCode);
          // return;
          let res = await api.payEventUser(id, comma(this.payPrice), this.payCode);
          if(res.status == "success"){
            await this.loadList(this.curPage, this.tab);
            // modal("알림", `멤버 ${user.email} 가입승인 완료`);
          }else{
            modal("오류", "지급처리 실패<br>" + res.message);
          }
        }
      },

      async payRecommender(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let r = await this.openPayModal();
        if(r){
          if(!this.payPrice){
            modal("오류", "금액이 입력되지 않았습니다.");
            return;
          }
          if(!this.payCode){
            modal("오류", "코드가 입력되지 않았습니다.");
            return;
          }
          let res = await api.payEventRecommender(id, comma(this.payPrice), this.payCode);
          if(res.status == "success"){
            await this.loadList(this.curPage, this.tab);
            // modal("알림", `멤버 ${user.email} 가입승인 완료`);
          }else{
            modal("오류", "추천인 지급처리 실패<br>" + res.message);
          }
        }
      },

      async cancelPayUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let res = await api.updateEventUser(id, {paid:false});
        if(res.status == "success"){
          await this.loadList(this.curPage, this.tab);
          // modal("알림", `멤버 ${user.email} 승인 완료`);
        }else{
          modal("오류", "지급취소 처리 실패<br>" + res.message);
        }
      },

      async cancelPayRecommender(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("오류", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        let res = await api.updateEventUser(id, {recommenderPaid:false});
        if(res.status == "success"){
          await this.loadList(this.curPage, this.tab);
          // modal("알림", `멤버 ${user.email} 승인 완료`);
        }else{
          modal("오류", "추천인 지급취소 처리 실패<br>" + res.message);
        }
      },

      async removeUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("알림", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        if(!(await modal("멤버제거", `멤버 '${user.email}'을 제거하시겠습니까?`, {buttons:["취소", "제거"]}))) return;

        let res = await api.removeEventUser(id);
        if(res.status == "success"){
          // this.pullUserObj(id);
          await this.loadList(this.curPage, this.tab);
          modal("알림", `멤버 '${user.email}' 을 제거했습니다`);
        }else{
          modal("알림", `멤버제거 실패.<br>${res.message}`);
        }
      },

      async restoreUser(id){
        let user = this.getUserObj(id);
        if(!user){
          modal("알림", `${id} 멤버를 찾을 수 없습니다.`);
          return;
        }
        if(!(await modal("멤버 복구", `멤버 '${user.email}'를 복구하시겠습니까?`, {buttons:["취소", "복구"]}))) return;

        let res = await api.updateEventUser(id, {
          removed: false
        });
        if(res.status == "success"){
          // this.pullUserObj(id);
          await this.loadList(this.curPage, this.tab);
          modal("알림", `멤버 '${user.email}' 를 복구했습니다`);
        }else{
          modal("알림", `멤버복구 실패.<br>${res.message}`);
        }
      }
    }
  })//end Vapp

  appReadyResolve();
})()
