( async ()=>{
  const mongoose = require('mongoose');
  // const autoIncrement = require('mongoose-auto-increment');
  const compression = require('compression');
  const express = require("express");
  const session = require('express-session');
  const connectRedis = require('connect-redis');
  const redis = require('redis');
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  const connect = require("./dbconnect");
  const bodyParser = require("body-parser");
  const cors = require('cors');
  const ios = require('express-socket.io-session');
  const {forceDomain} = require('forcedomain');
  const multer = require('multer');
  const path = require('path');
  // const sharp = require('sharp');
  const fs = require('fs');
  const {v4:uuidv4} = require('uuid');

  // const FileStore = require('session-file-store')(session);
  // const MongoStore = require('connect-mongo')(session);


  //////////// mongoose logger //////////////
  const {MongooseQueryLogger} = require('mongoose-query-logger');

  console.log("NODE_ENV", process.env.NODE_ENV);

  let useForceDomain = true;

  if(process.env.NODE_ENV != "production"){
    const queryLogger = new MongooseQueryLogger();
    mongoose.plugin(queryLogger.getPlugin());
  }
  ///////////////////////////////////////////

  const requestIp = require('request-ip');

  const User = require('./models/User');
  const Program = require('./models/Program');
  const Browser = require('./models/Browser');
  const Log = require('./models/Log');
  const Account = require('./models/Account');
  const Approval = require('./models/Approval');

  const EventMember = require('./models/EventMember');

  const config = require('./config');


  const app = express();
  const port = process.env.PORT || 80;

  const http = require("http").Server(app);
  // const io = require("socket.io")(http);
  const io = require("socket.io")(http, { transports: ['websocket'] });
  const IoRedis = require('socket.io-redis');

  io.adapter(IoRedis({ host: 'localhost', port: 6379 }));


  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);


  await connect.then(()=>{
    console.log("Successfully connected to mongodb");
  })

  // const store = new FileStore();

  const store = new RedisStore({
    // host: 'localhost',
    // port: 6379,
    // prefix: 'session:',
    // db: 0,
    client: redisClient
  });

  let dayTime = 1000 * 60 * 60 * 24;
  let _session = session({
    secret: 'TkqTo!@#$',
    cookie: { maxAge: dayTime * 365 },
    resave: false,
    saveUninitialized: true,
    //store: new MongoStore({mongooseConnection: mongoose.connection})
    store: store
  })
  app.use(_session);

  // console.log("???", process.cwd());



  // 중복로긴 방지 -> user.js login부분으로 옮김
  // app.use((req, res, next) => {
  //   const page = req.path || "";
  //   const uri = page.replace(/\?.*/, "");
  //
  //   // 정적파일 요청의 경우 스킵
  //   if (uri.includes(".")) {
  //     next();
  //     return;
  //   }
  //
  //   // 중복 로그인 체크
  //   if (req.session.user) {
  //     const { user } = req.session;
  //     console.log("@@@@@@@@@SESSION CHECK");
  //     store.all((_, sessions) => {
  //       sessions.forEach( e=> {
  //         // 세션에 사용자 정보가 담겨있고, 담겨있는 사용자의 아이디와 현재 세션의 사용자 아이디가 같지만
  //         // 세션의 ID가 다른 경우 다른 디바이스에서 접속한걸로 간주하고 이전에 등록된 세션을 파괴한다.
  //         if (e.user && e.user.email == user.email && e.id != req.session.id) {
  //           console.log("destroy session", e.user.email);
  //           if(e.socketId){
  //             console.log("SOCKET CLOSE!!!!", e.socketId);
  //             if(io.sockets.sockets[e.socketId]){
  //               io.sockets.sockets[e.socketId].close();
  //             }
  //             // e._socket.close();
  //           }
  //           store.destroy(e.id, error=> {
  //             /* redis 오류로 인한 에러 핸들링 */
  //             if(error){
  //               console.error("session destroy error", error);
  //               return;
  //             }
  //             io.to(user.email).emit("destroyedSession");
  //           });
  //         }
  //       });
  //     });
  //   }
  //   // console.log("!!!! next", i);
  //   next();
  // })

  app.disable('x-powered-by');
  app.use(compression());

  app.use(requestIp.mw());

  app.use(express.static("public"));
  app.use(cors());

  // app.all('*', function(req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, X-HTTP-Method-Override, Accept, Authorization'
  //   );
  //   next();
  // });

  //body-parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));

  // app.use('/api', [
  //     function(req, res, next) {
  //         console.log('step 1');
  //         next();
  //     },
  //     function(req, res) {
  //         console.log('step 2');
  //         res.status(200).send('it worked');
  //     }
  // ]);

  // app.get("/test", (req, res)=>{
  //   console.log('-----------------');
  //   store.all((_, sessions) => {
  //     console.log("sessions", sessions);
  //     // sessions.forEach( e=> {
  //     //   console.log("session", e);
  //     // })
  //   })
  //   console.log('-----------------');
  //   res.send(200);
  // })


  // auth middleware
  app.use("/api", async (req, res, next)=>{
    if(req.headers.authorization == "betburger" && req.url == "/input_data"){
      next();
      return;
    }

    let user;
    let email = req.headers.authorization;

    if(!email && req.session.user){
      email = req.session.user.email;// || req.body.email || req.query.email;
    }
    // console.error("??", req.headers);
    // console.log("?", email);
    if(!email){
      res.status(500).json({
        status: "fail",
        code: "NO_AUTHENTICATION",
        message: "인증이 필요합니다."
      });
      return;
    }

    if(req.session.user){
      // user = req.session.user;
      user = await User.findOne({_id:req.session.user._id});
    }else{
      user = await User.findOne({email:email});
    }

    if(!user){
      res.status(500).json({
        status: "fail",
        message: "존재하지 않는 유저 정보 입니다"
      });
      return;
    }

    // console.log(user);
    req.user = user;
    req.admin = (user && !!user.authority);
    next();
  })

  const apiRouter = require("./routers/api")(io);
  const userRouter = require("./routers/user")(io, store);

  app.use("/api", apiRouter);
  app.use("/user", userRouter);

  // app.use("/api", subdomain('www', apiRouter));
  // app.use("/user", subdomain('www', userRouter));

  //
  // if(useForceDomain && (process.cwd()||'').indexOf("C:") == -1 && process.env.NODE_ENV == "production"){
  //   app.use(forceDomain({
  //     hostname: 'www.surebet.vip'
  //     // excludeRule: {
  //     //   test: function(hostname){
  //     //     ///^api\..*/
  //     //     console.log("hostname", hostname);
  //     //     return true;
  //     //   }
  //     // }
  //     // protocol: 'https'
  //   }));
  // }

  app.set('views', './views');
  app.set('view engine', 'pug');



  io.use(ios(_session, {autoSave:true}));

  // let PID = process.pid;
  // app.get("/pid", (req, res)=>{
  //
  //   res.send(''+process.pid);
  // })

  // app.set('trust proxy', true);
  app.get("/ip", (req, res)=>{
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.send(ip);
  })

  var _pages = [
    {
      link: "/dashboard",
      name: "대시보드"
    },{
      link: "/accountManager",
      name: "계정관리"
    },{
      link: "/proxyManager",
      name: "프록시관리"
    },{
      link: "/betHistory",
      name: "배팅기록"
    },{
      link: "/withdrawHistory",
      name: "출금기록"
    },{
      link: "/admin/accountManager",
      name: "계정관리",
      admin: true
    },{
      link: "/admin/proxyManager",
      name: "프록시관리",
      admin: true
    },{
      link: "/admin/optionManager",
      name: "옵션관리",
      admin: true
    },{
      link: "/admin/accountWithdrawManager",
      name: "출금관리",
      admin: true
    },{
      link: "/admin/depositManager",
      name: "입/출금기록",
      admin: true
    },{
      link: "/admin/betHistory",
      name: "배팅기록",
      admin: true
    },{
      link: "/admin/analysis",
      name: "분석",
      admin: true
    },{
      link: "/admin/eventMemberManager",
      name: "이벤트 회원관리",
      admin: true
    },{
      link: "/admin/dashboard",
      name: "[마스터] 원격 대시보드",
      admin: true,
      master: true
    },{
      link: "/admin/memberManager",
      name: "[마스터] 회원관리",
      admin: true,
      master: true
    },{
      link: "/admin/approvalManager",
      name: "[마스터] 결재관리",
      admin: true,
      master: true
    },{
      link: "/admin/setting",
      name: "[마스터] 설정",
      admin: true,
      master: true
    }
  ]

  app.locals.pages = _pages;

  // session User에 있는 authority를 넘겨주고, 허용된 페이지 목록을 반환한다.
  function getFilteredAdminPages(req, res, next){
    // console.log("!!!", req.session);
    if(!req.session.user || !req.session.admin) {
      res.render('./admin/login');
      return;
    }

    req.adminPages = req.session.pages.filter(page=>page.admin);

    // if(req.adminPages.length == 0){
    //
    // }
    // let pages = _pages.filter(page=>{
    //   return req.session.user.authority[page.code]
    // })
    // if(pages.length){
    //   req.adminPages = pages;
    // }else{
    //   res.render('/admin/login');
    //   return;
    // }

    next();
  }


  async function sessionCheck(req, res, next){
    if(req.session.user && req.url == '/login'){
      let backURL=req.header('Referer') || '/';
      res.redirect(backURL);
      return;
    }
    if(
      !req.session.user && req.url != '/login'
      && req.url != '/admin'
      && req.url.indexOf('/register') == -1
      && req.url.indexOf('/event/member/regist') == -1
    ){
      //console.log(req);
      res.redirect('/login');
      return;
    }

    // if(req.session.user){
    //   let user;
    //   try{
    //     user = await User.findOne({email:req.session.user.email});
    //   }catch(e){
    //
    //   }
    //   if(!user){
    //     // delete req.session.user;
    //     deleteSession(req.session);
    //     await req.session.save();
    //     res.redirect('/login');
    //     return;
    //   }
    // }

    // if(!req.session.user){
    //   deleteSession(req.session);
    //   await req.session.save();
    //   res.redirect('/login');
    //   return;
    // }

    genPageData(req, res);

    next();
  }

  app.use(sessionCheck);

  app.get('/', function (req, res) {
    // console.log(req.session.user);
    res.redirect('/dashboard');
  });

  function genPageData(req, res){
    req.pageData = {
      user:req.session.user,
      pages:req.session.pages,
      link:req.url,
      admin:req.session.admin,
      config
    }
    // next();
  }

  // app.get('/dashboard', async (req, res)=>{
  //   // console.log("SESSION", req.session);
  //   // res.render('dashboard', { user:req.session.user, pages:req.session.pages, link:req.url, admin:req.session.admin });
  //   // req.pageData.pid = process.pid;
  //   res.render('dashboard', req.pageData);
  // })
  //
  // app.get('/accountManager', async (req, res)=>{
  //   res.render('accountManager', req.pageData);
  // })
  //
  // app.get('/betHistory', (req, res)=>{
  //   res.render('betHistory', req.pageData);
  // })
  //
  // app.get('/depositHistory', (req, res)=>{
  //   res.render('depositHistory', req.pageData);
  // })


  app.get('/admin', getFilteredAdminPages, (req, res)=>{
    try{
      res.redirect( req.adminPages[0].link );
    }catch(e){
      res.redirect( req.session.pages[0].link );
    }
  })


  // admin pages router
  _pages
  //.filter(page=>page.admin)
  .forEach(page=>{
    if(page.admin){
      // console.log(">>", page.link);
      app.get(page.link, getFilteredAdminPages, (req, res)=>{
        // req.adminPages
        if(req.session.pages.find(page=>page.link==req.url)){
          res.render( '.'+req.url, req.pageData );
        }else{
          if(req.pages){
            res.redirect(req.pages[0].link);
          }else{
            res.redirect('/');
          }
        }
      })
    }else{
      app.get(page.link, (req, res)=>{
        res.render( '.'+req.url, req.pageData );
      })
    }
  })

  // master pages router
  _pages.filter(page=>page.master).forEach(page=>{
    app.get(page.link, (req, res, next)=>{
      if(!req.session.user.master){
        req.redirect( '/admin/login' );
        return;
      }
      next();
    }, (req, res)=>{
      if(req.session.pages.find(page=>page.link==req.url)){
        res.render( '.'+req.url, req.pageData );
      }else{
        // res.redirect(req.pages[0].link);
        if(req.pages){
          res.redirect(req.pages[0].link);
        }else{
          res.redirect('/');
        }
      }
    })
  })

  // app.get('/admin/dashboard', getFilteredAdminPages, (req, res)=>{
  //   let pages = req.adminPages;
  //   if(pages.find(page=>page.link==req.url)){
  //     res.render( '.'+req.url, { user: req.session.user, pages, link:req.url } );
  //   }else{
  //     res.redirect(pages[0].code);
  //   }
  // })
  //
  // app.get('/admin/accountManager', getFilteredAdminPages, (req, res)=>{
  //   let pages = req.adminPages;
  //   if(pages.find(page=>page.link==req.url)){
  //     res.render( '.'+req.url, { user: req.session.user, pages, link:req.url });
  //   }else{
  //     res.redirect(pages[0].link);
  //   }
  // })
  //
  // app.get('/admin/optionManager', getFilteredAdminPages, (req, res)=>{
  //   let pages = req.adminPages;
  //   if(pages.find(page=>page.link==req.url)){
  //     res.render( '.'+req.url, { user: req.session.user, pages, link:req.url });
  //   }else{
  //     res.redirect(pages[0].link);
  //   }
  // })



  app.get('/login', (req, res)=>{
    res.render('login');
  })

  function deleteSession(session){
    delete session.user;
    delete session.admin;
    delete session.pages;
    // return session.save();
  }

  app.get('/logout', async (req, res) => {
    deleteSession(req.session);

    return req.session.save(()=>{
      return res.redirect('/');
    })
  })

  app.get('/register', (req, res)=>{
    res.render('register', {param:{email:req.query.email}});
  })



  //////////////////////////////////////////////////////////
  //// 업로드
  //////////////////////////////////////////////////////////

  function task(cb){
    return function(req, res){
      try{
        cb(req, res);
      }catch(e){
        console.error(e);
        res.status(500).json({
          status: "fail",
          message: e.message
        });
      }
    }
  }

  // const upload = multer({ dest: 'public/uploads/', limits: { fileSize: 10 * 1024 * 1024 } });
  app.get('/event/member/regist', (req, res)=>{
    res.render('eventMemberRegist');
  })

  app.post('/event/member/regist/check', task(async (req, res) => {
    let member = await EventMember.findOne({email:req.body.email});
    res.json({
      status: "success",
      has: !!member
    })
  }))

  const storage = multer.diskStorage({
    destination: function(req, file, cb){
      const today = new Date();
      const year = today.getFullYear();
      const month = `${today.getMonth() + 1}`.padStart(2, "0");
      const date = `${today.getDate()}`.padStart(2, "0");
      const folder = `public/uploads/${year}/${month}/${date}/`;
      fs.mkdir(folder, { recursive: true }, (err) => {
        if (err) throw err;
        // console.log("make folder");
        cb(null, folder);
      });
    },
    filename: function(req, file, cb){
      // console.log(file);
      cb(null, uuidv4() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  app.post('/event/member/regist/upload', upload.array('photos'), task(async (req, res) => {
    // console.log(req.body);
    // console.log(req.files);
    let data = req.body;
    data.files = req.files;
    data.ip = req.clientIp.replace('::ffff:', '');

    if(data.files){
      // const fileUrl = `${req.protocol}://${req.get(
      //   "host"
      // )}`
      data.files.forEach(file=>{
        file.url = file.destination.replace('public', '') + file.filename;
      })
    }

    let member = await EventMember.findOne({email:data.email});
    if(member){
      res.json({
        status: "fail",
        message: "이미 가입신청됐습니다."
      })
      return;
    }

    if(data.fromEmail){
      let m = await EventMember.findOne({email:data.fromEmail});
      if(m){
        data.recommender = m._id;
        // data.availableRecommender = true;
      }
    }

    await EventMember.create(data);

    res.json({
      status: "success"
    })
  }));

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////



  var server = http.listen(port, '0.0.0.0', () => {
    console.log('server is running on port', server.address().port);
  });
})()
