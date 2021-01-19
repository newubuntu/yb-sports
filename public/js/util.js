function reverse(str){
  return str.split('').reverse().join('');
}

function comma(n){
  // if(n === undefined) return "0";
  // n = n.toString();
  if(typeof n === "number"){
    n = n.toString();
  }else if(typeof n === "string"){
    // console.log("@", n);
    n = n.replace(/,/g,'');
    n = Number(n);
    // console.log("@@", n);
    if(isNaN(n)){
      return n = "0";
    }
    n = n.toString();
  }
  if(!n) return "0";



  let a = [], j=0;
  for(let i=n.length-1; i>=0; i--){
    a.unshift(n[i]);
    if(++j%3==0 && i>0){
      a.unshift(',');
    }
  }

  return a.join('');

  // let t = reverse(n).matchAll(/((?:\d\d\d|\d\d|\d))/gm);
  // let v, result=[];
  // while(1){
  //   v = t.next();
  //   if(v.done) break;
  //
  //   if(v.value.length == 1){
  //     result.push(v.value[0]);
  //   }else{
  //     result.push(v.value.slice(1));
  //   }
  // }
  // return reverse(result.join(','));

  // return reverse(expgen("{(###|##|#)}").getAll(reverse(n)).join(','))
}


function setupMoneyInput(input){
  if(!input) return;
  input.style.textAlign = "right";
  input.onkeydown = function(event){
    switch(event.keyCode){
      case 8:// backspace
      case 46:// delete
      case 37:// left
      case 38:// up
      case 39:// right
      case 40:// down
      break;

      default:
        if(
          !(event.keyCode >= 48 && event.keyCode <= 57 ||
          event.keyCode >= 96 && event.keyCode <= 105)
        ){
          event.preventDefault();
        }
    }
  }

  input.oninput = function(event){
    event.target.value = Number(event.target.value);
  }

  input.onfocus = function(event){
    let n = toNumber(event.target.value);
    event.target.value = n == 0 ? '' : n;
  }

  input.onblur = function(event){
    event.target.value = comma(event.target.value);
  }
}

function toNumber(str){
  return Number(str.replace(/[^0-9]/g,''));
}


let $cover = $('<div>').css({
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
  outline: '0px',
  background: 'rgba(0, 0, 0, 0.6)',
  padding: 'calc(50vh - 3rem)',
  'text-align': 'center',
  'z-index': 10000
});
let $spinner = $('<span class="c-loading-button-spinner spinner-border spinner-border-sm">').css({
  width: '6rem',
  height: '6rem'
});
function screenLock(){
  //c-loading-button-spinner spinner-border spinner-border-sm
  $spinner.remove();
  $cover.appendTo(document.body);
}

function screenUnlock(){
  $cover.remove();
}

function startLoading(){
  $cover.append($spinner);
  $cover.appendTo(document.body);
}

function stopLoading(){
  $cover.remove();
}

function delay(n){
  return new Promise(resolve=>setTimeout(resolve, n));
}

function gotoLogin(){
  window.location.href = "/login";
}
