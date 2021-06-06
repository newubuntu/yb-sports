module.exports = MD=>{
  let {
    getEventKeyNames,
    getEventKeys,
    getEventKey,
    isLockEvent,
    lockEvent,
    unlockEvent,
    setGameData,
    pullGameData,
    util,
    setRedis,
    getRedis,
    room_checker,
    room_bettor,
    argv,
    redisClient,
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
    BetData,
    Event,
    Log,
    BenEvent,
    Proxy,
    Withdraw,
    AccountWithdraw,
    Account,
    Option,
    Approval,
    Setting,
    DepositLog,
    Data,
    BackupHistory,
    EventMember,
    authAdmin,
    authMaster,
    task,
    deposit,
    approvalTask,
    refreshTab,
    refreshMoney,
    refreshBet365Money,
    refreshBet365TotalMoney,
    updateBet365Money,
    updateBet365TotalMoney,
    getSetting,
    calc,
    MoneyManager,
    uuidv4,
    nodemailer
  } = MD;

  let transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: 'gmail',
    // host를 gmail로 설정
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      // user: "no-reply@skillbit.org",
      // pass: "Asas1234@"

      user: "statzer1983slovakian@gmail.com",
      pass: "Tasgs4441!#"
    },
  });

  async function sendEmail(email, title, body){
    let info = await transporter.sendMail({
      // 보내는 곳의 이름과, 메일 주소를 입력
      from: `"Skillbit Team" <no-reply@skillbit.org>`,
      // 받는 곳의 메일 주소를 입력
      to: email,
      // 보내는 메일의 제목을 입력
      subject: title,
      // 보내는 메일의 내용을 입력
      // text: 일반 text로 작성된 내용
      // html: html로 작성된 내용
      // text: body,
      html: body
    });

    return info
  }

  // for master
  router.post("/get_event_users", authAdmin, task(async (req, res)=>{
    // if(!req.user.master){
    //   res.json({
    //     status: "fail",
    //     message: "권한이 없는 요청입니다."
    //   })
    //   return;
    // }

    // console.log(req.body);
    let {ids, offset, limit, curPage, fromEmail, email, approved, paid, removed} = req.body;

    let users;
    let query;

    // for(let o in query){
    //   if(query[o] === undefined){
    //     delete query[o];
    //   }
    // }

    let $and = [];

    if(email !== undefined){
      $and.push({email});
    }
    if(approved !== undefined){
      $and.push({approved});
    }
    if(removed !== undefined){
      $and.push({removed});
    }

    if(ids){
      // query._id = ids;
      $and.push({_id:{$in:ids}});
    }

    if(paid !== undefined){
      if(paid){
        // $and.push({$and:[
        //   {paid:true},
        //   {$cond:[
        //     {recommender:null},
        //     true,
        //     "$recommenderPaid"
        //   ]}
        // ]})
        $and.push({$and:[
          {paid:true},
          {$or:[
            {$and:[
              {recommender:{$ne:null}},
              {recommenderPaid:true}
            ]},
            {$and:[
              {recommender:null},
              {recommenderPaid:false}
            ]},
          ]}
        ]})
      }else{
        $and.push({$or:[
          {paid:false},
          {recommenderPaid:false}
        ]})
      }
    }

    if(fromEmail){
      let m = await EventMember.findOne({email:fromEmail}).select("_id");
      if(m){
        // query.recommender = m._id;
        $and.push({recommender:m._id});
      }
    }

    query = {$and};
    // if(email){
    //   query.email = email;
    // }
    //
    // if(allowed !== undefined){
    //   query.allowed = allowed
    // }

    if(curPage !== undefined){
      // 페이지가 설정되었으면, 그에 맞춰서 limit, offset 계산
      limit = 20;
      offset = curPage * limit;
    }else{
      // 페이지가 설정안되었다면. 전달된 limit, offset 사용
      // 전달된 limit, offset이 없으면 기본값사용
      if(limit === undefined){
        limit = 20;
      }
      if(offset === undefined){
        offset = 0;
      }

      curPage = offset / limit;
    }



    // 전체숫자는 limit되지 않은숫자여야하므로 이 count방법을 유지한다.
    let count = await EventMember.countDocuments(query);
    let pageLength = Math.ceil(count / limit);// 0 ~
    let maxPage = pageLength - 1;
    // console.log("account count", count);
    let startPage = Math.floor(curPage / config.PAGE_COUNT) * config.PAGE_COUNT;
    let endPage = Math.min(startPage + config.PAGE_COUNT-1, maxPage);

    console.log("query", query);

    users = await EventMember.find(query)
    // .select(["-password"])
    .sort({createdAt:-1})
    .limit(limit)
    .skip(offset)
    .populate("recommender")
    .lean();

    for(let i=0; i<users.length; i++){
      users[i].rCount = await EventMember.countDocuments({recommender:users[i]._id});
    }
    // console.log("clientIp", req.clientIp);
    //console.log("???", req.header('x-forwarded-for') || req.connection.remoteAddress);

    // 보유계정 카운트
    let result = users;
    // if(accountCounting){
    //   result = await Promise.all(users.map(async user=>{
    //     let count;
    //     try{
    //       count = await Account.countDocuments({user:user._id})
    //     }catch(e){
    //       console.error(e);
    //       count = 0;
    //     }
    //     // let _user = Object.assign({}, user._doc);
    //     // _user.accountCount = count;
    //     user.accountCount = count;
    //     // console.log(count);
    //     // return _user;
    //     return user;
    //   }));
    // }

    //// 관리할때는 전체 가진 수량을 표시해야하므로 주석처리.
    // 현재 설정된 program count, browser count 로 잘라 내보냄
    // result.forEach(user=>{
    //   user.programs = user.programs.slice(0, user.programCount);
    //   user.programs.forEach(program=>{
    //     program.browsers = program.browsers.slice(0, user.browserCount);
    //   })
    // })

    res.json({
      status: "success",
      data: {users:result, curPage, startPage, endPage, maxPage, count, pageCount:config.PAGE_COUNT}
    });
  }))

  router.post("/update_event_user/:id", authAdmin, task(async (req, res)=>{
    // console.error(req.body)
    // if(!req.user.master){
    //   res.json({
    //     status: "fail",
    //     message: "권한이 없는 요청입니다."
    //   })
    //   return;
    // }

    // console.error(req.body);
    let id = req.params.id;
    let user = req.body;
    delete user._id;

    await EventMember.updateOne({_id:id}, user);
    res.json({
      status: "success"
    })
  }))

  router.get("/remove_event_user/:id", authAdmin, task(async (req, res)=>{
    // console.error(req.body)
    // if(!req.user.master){
    //   res.json({
    //     status: "fail",
    //     message: "권한이 없는 요청입니다."
    //   })
    //   return;
    // }

    let id = req.params.id;
    // await EventMember.deleteOne({_id:id});
    await EventMember.updateOne({_id:id}, {removed:true});

    res.json({
      status: "success"
    })
  }))

  router.get("/pay_event_user/:id/:code", authAdmin, task(async (req, res)=>{

    let id = req.params.id;
    let code = req.params.code;

    let member = await EventMember.findOne({_id:id});
    if(!member){
      res.json({
        status: "fail",
        message: "가입정보를 찾을 수 없습니다."
      })
      return;
    }

    if(!member.approved){
      res.json({
        status: "fail",
        message: "먼저 승인처리가 돼야 지급할 수 있습니다."
      })
      return;
    }
    //#1 전달받은 쿠폰번호로 이메일 전송
    let info = await sendEmail(member.email, "문상코드", code);
    console.log(info);
    //#2 지급완료 처리
    await EventMember.updateOne({_id:id}, {paid:true, payCode:code, paidAt:new Date()});

    res.json({
      status: "success"
    })
  }))

  router.get("/pay_event_recomender/:id/:code", authAdmin, task(async (req, res)=>{

    let id = req.params.id;
    let code = req.params.code;

    let member = await EventMember.findOne({_id:id}).populate("recommender");
    if(!member){
      res.json({
        status: "fail",
        message: "가입정보를 찾을 수 없습니다."
      })
      return;
    }

    if(!member.approved){
      res.json({
        status: "fail",
        message: "먼저 승인처리가 돼야 지급할 수 있습니다."
      })
      return;
    }

    if(!member.recommender){
      res.json({
        status: "fail",
        message: "추천인 가입정보를 찾을 수 없습니다."
      })
      return;
    }

    if(!member.recommender.approved){
      res.json({
        status: "fail",
        message: "추천인이 승인처리가 안된 상태입니다."
      })
      return;
    }
    //#1 전달받은 쿠폰번호로 이메일 전송
    let info = await sendEmail(member.recommender.email, "문상코드", code);
    console.log(info);
    //#2 지급완료 처리
    await EventMember.updateOne({_id:id}, {recommenderPaid:true, recommenderPayCode:code, recommenderPaidAt:new Date()});

    res.json({
      status: "success"
    })
  }))

  router.get("/approve_event_user/:id", authAdmin, task(async (req, res)=>{

    let id = req.params.id;

    await EventMember.updateOne({_id:id}, {approved:true, approvedAt:new Date()});

    res.json({
      status: "success"
    })
  }))

  router.post("/request_approve_event_user/:id", authAdmin, task(async (req, res)=>{

    let id = req.params.id;
    let link = decodeURIComponent(req.body.link);
    // console.log(link);
    let member = await EventMember.findOne({_id:id});
    if(!member){
      res.json({
        status: "fail",
        message: "가입정보를 찾을 수 없습니다."
      })
      return;
    }

    let html = `
    <p><a href="${link}" target="_blank">&lt; 본인 확인 &gt;</a> 클릭 모바일에서 신원을 확인합니다.</p>
    <p>본 링크는 몇 분 후에 처리됩니다.</p>
    <p>본 이메일의 발신자 주소는 발신 전용으로 문의 할 경우 회신되지 않습니다.</p>
    <p/>
    <p>© ${new Date().getFullYear()} Jumio Corp. 판권 소유.</p>
    <p>개인 정보 보호 정책</p>`

    //#1 인증요청 이메일 전송
    let info = await sendEmail(member.email, "SKILL BIT 본인 확인 링크", html);
    console.log(info);

    res.json({
      status: "success"
    })
  }))

}
