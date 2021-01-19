( async ()=>{
  const mongoose = require('mongoose');
  // const autoIncrement = require('mongoose-auto-increment');
  const express = require("express");
  const session = require('express-session');
  const connect = require("./dbconnect");
  const bodyParser = require("body-parser");
  const cors = require('cors');
  const ios = require('express-socket.io-session');
  const FileStore = require('session-file-store')(session);
  // const MongoStore = require('connect-mongo')(session);

  const {MongooseQueryLogger} = require('mongoose-query-logger');
  const queryLogger = new MongooseQueryLogger();
  mongoose.plugin(queryLogger.getPlugin());

  const requestIp = require('request-ip');

  const User = require('./models/User');
  const Program = require('./models/Program');
  const Browser = require('./models/Browser');
  const Log = require('./models/Log');
  const Account = require('./models/Account');
  const Approval = require('./models/Approval');

  const config = require('./config');


  const app = express();
  const port = process.env.PORT || 80;

  const http = require("http").Server(app);
  // const io = require("socket.io")(http);
  const io = require("socket.io")(http);


  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);


  await connect.then(()=>{
    console.log("Successfully connected to mongodb");
  })

  let dayTime = 1000 * 60 * 60 * 24;
  let _session = session({
    secret :'TkqTo!@#$',
    cookie: { maxAge: dayTime },
    resave:false,
    saveUninitialized:true,
    //store: new MongoStore({mongooseConnection: mongoose.connection})
    store: new FileStore()
  })
  app.use(_session);

  app.use(requestIp.mw());

  app.use(express.static("public"));
  app.use(cors());

  //body-parser
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());

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
      if(!user){
        res.status(500).json({
          status: "fail",
          message: "존재하지 않는 유저 정보 입니다"
        });
        return;
      }
    }

    // console.log(user);
    req.user = user;
    req.admin = !!user.authority;
    next();
  })

  app.use("/api", require("./routers/api")(io));
  app.use("/user", require("./routers/user")(io));
  app.set('views', './views');
  app.set('view engine', 'pug');


  io.use(ios(_session, {autoSave:true}));

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
      link: "/betHistory",
      name: "배팅기록"
    },{
      link: "/depositHistory",
      name: "입/출금기록"
    },{
      link: "/admin/dashboard",
      name: "[관리자] 대시보드",
      admin: true
    },{
      link: "/admin/accountManager",
      name: "[관리자] 계정관리",
      admin: true
    },{
      link: "/admin/optionManager",
      name: "[관리자] 옵션관리",
      admin: true
    },{
      link: "/admin/depositManager",
      name: "[관리자] 입/출금관리",
      admin: true
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
    if(!req.session.user && req.url != '/login' && req.url != '/admin' && req.url.indexOf('/register') == -1){
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

  app.get('/dashboard', async (req, res)=>{
    // console.log("SESSION", req.session);
    // res.render('dashboard', { user:req.session.user, pages:req.session.pages, link:req.url, admin:req.session.admin });
    res.render('dashboard', req.pageData);
  })

  app.get('/accountManager', async (req, res)=>{
    // let accounts;
    // try{
    //   accounts = await Account.find({user:req.session.user._id});
    // }catch(e){
    //   console.error(e);
    // }
    res.render('accountManager', req.pageData);
  })

  // app.get('/optionManager', (req, res)=>{
  //   res.render('optionManager', { user: req.session.user, pageIndex:3 });
  // })

  app.get('/betHistory', (req, res)=>{
    res.render('betHistory', req.pageData);
  })

  app.get('/depositHistory', (req, res)=>{
    res.render('depositHistory', req.pageData);
  })


  app.get('/admin', getFilteredAdminPages, (req, res)=>{
    try{
      res.redirect( req.adminPages[0].link );
    }catch(e){
      res.redirect( req.session.pages[0].link );
    }
  })


  // admin pages router
  _pages.filter(page=>page.admin).forEach(page=>{
    // console.log(">>", page.link);
    app.get(page.link, getFilteredAdminPages, (req, res)=>{
      // req.adminPages
      if(req.session.pages.find(page=>page.link==req.url)){
        res.render( '.'+req.url, req.pageData );
      }else{
        res.redirect(req.pages[0].code);
      }
    })
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
        res.redirect(req.pages[0].code);
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








  var server = http.listen(port, () => {
    console.log('server is running on port', server.address().port);
  });
})()
