const redis = require('redis');
const redisClient = redis.createClient();
const mongoose = require('mongoose');

let socketMap = {
  domain: function(root, key, value){
    if(!key) return root;
    let s,o,p = key.split('.');
    key = p.pop();
    o = root;
    while(1){
      s=p.shift();
      if(!s) break;
      if(!o[s]) o[s] = {};
      o = o[s];
    }
    if(value !== undefined){
      // console.error("!!", root, o, key, value);
      o[key] = value;
    }
    return o[key];
  },
  _del: function(root, key){
    let s,o,p = key.split('.');
    key = p.pop();
    o = root;
    while(1){
      s=p.shift();
      if(!s) break;
      if(!o[s]) o[s] = {};
      o = o[s];
    }
    delete o[key];
  },
  getStore: function(){
    return new Promise(resolve=>{
      redisClient.get("smap", (err, store)=>{
        if(store){
          resolve(JSON.parse(store));
        }else{
          resolve({});
        }
      })
    })
  },
  setStore: function(store){
    redisClient.set("smap", JSON.stringify(store));
  },
  set: async function(key, value){
    let store = await this.getStore();
    this.domain(store, key, value);
    this.setStore(store);
  },
  get: async function(key){
    let store = await this.getStore();
    // console.log("get", key, store);
    return this.domain(store, key);
  },
  del: async function(key){
    // let store = redisClient.get("smap") || {};
    let store = await this.getStore();
    this._del(store, key);
    this.setStore(store);
  },
  join: function(room, socket, reset){
    if(room instanceof mongoose.Types.ObjectId){
      room = room.toString();
    }
    if(reset){
      await this.del(room);
    }
    // console.error("@@join", room, socket.id);
    return this.set(`${room}.${socket.id}`, 1);
  },
  leave: function(room, socket){
    if(room instanceof mongoose.Types.ObjectId){
      room = room.toString();
    }
    return this.del([room, socket?socket.id:''].filter(a=>!!a).join('.'));
  },
  list: async function(room){
    if(room instanceof mongoose.Types.ObjectId){
      room = room.toString();
    }
    if(room){
      let a = await this.get(room);
      if(a){
        return Object.keys(a);
      }else{
        return [];
      }
    }else{
      return this.get();
    }
  },
  emit: function(room, ...rest){
    console.error("@@@@emit")
    this.list(room).then(id=>{
      let ctx = io.to(id);
      console.error("####emit", room, rest);
      ctx.emit.apply(ctx, rest);
    })
  },
  reset: function(){
    this.setStore({});
  }
}



async function test(){
  let s1 = {id:"s1"};
  let s2 = {id:"s2"};
  let s3 = {id:"s3"};

  await socketMap.join("checker", s1);
  await socketMap.join("checker", s2);
  // socketMap.join("checker", s2);
  // socketMap.join("drumtj@gmail.com", s1);
  // socketMap.join("program", s1);
  // socketMap.join("program", s2);
  // socketMap.join("program", s3);

  console.error("##checker", await socketMap.list("checker"));
  // console.error("program", await socketMap.list("program"));
  console.error("##all", await socketMap.list());
}

test();
