console.log("modal.js");

let $centerModal = $("#centerModal")
.on("shown.coreui.modal", e=>{
  // console.error("??", e);
  $centerModal.data("pressOk", null);
})
// .on("hidden.coreui.modal", e=>{
//   console.error(e);
// })
//

$centerModal.on("click", ".close, .btn-secondary, .btn-primary", e=>{
  // console.log("!!", $(e.target).hasClass("btn-primary"));
  $centerModal.data("pressOk", $(e.target).hasClass("btn-primary"));
  modalHide();
})

$centerModal.on("keydown", e=>{
  if(e.keyCode == 13){
    if($centerModal.data("buttonCount") == 2){
      $centerModal.data("pressOk", true);
    }
    $centerModal.modal("hide");
  }
})

function modalHide(){
  $centerModal.modal("hide");
}

function modalTitle(str){
  if(str){
    $centerModal.find(".modal-title").text(str||"");
  }else{
    return $centerModal.find(".modal-title").text();
  }
}

// modal(title, body, option)
// modal(title, body)
function modal(title, body, option){//buttons=['확인']){
  return new Promise(resolve=>{
    let opt = Object.assign({
      buttons: ['확인'],
      lock: false,
      size: undefined,//sm, lg, xl
      validation: undefined,//function
      init: undefined//function
    }, option);

    $centerModal.data("buttonCount", opt.buttons.length);
    if(opt.buttons.length==1){
      $centerModal.find(".btn-secondary").html(opt.buttons[0]);
      $centerModal.find(".btn-primary").html(opt.buttons[1]).hide();
    }else{
      $centerModal.find(".btn-secondary").html(opt.buttons[0]);
      $centerModal.find(".btn-primary").html(opt.buttons[1]).show();
    }

    $centerModal.find(".modal-title").text(title||"");
    if(typeof body === "string"){
      $centerModal.find(".modal-body").html(body||"");
    }else if(body){
      $centerModal.find(".modal-body").html("").append(body);
    }

    if(typeof opt.validation === "function"){
      $centerModal.on("hide.coreui.modal", e=>{
        if(!$centerModal.data("pressOk")){
          return true;
        }

        return opt.validation();
      })
    }
    $centerModal.one("hidden.coreui.modal", e=>{
      $centerModal.off("hide.coreui.modal");
      resolve($centerModal.data("pressOk"))
    });
    let modalOpt = {show:true};
    if(opt.lock){
      modalOpt.backdrop = 'static';
    }
    let $dialog = $centerModal.find(".modal-dialog").removeClass('modal-sm modal-lg modal-xl');
    if(opt.size){
      $dialog.addClass('modal-'+opt.size);
    }
    $centerModal.modal(modalOpt);
    if(typeof opt.init === "function"){
      delay(0).then(()=>{
        opt.init();
      })
    }
  })
}

// let centerModal = new coreui.Modal($('#centerModal'));
// centerModal._element.addEventListener("shown.coreui.modal", e=>{
//   console.log("show", e.releatedTarget);
// })
//
// function modalSet(modal, title, body){
//   $(".modal-title", modal._element).textContent = title||"";
//   $(".modal-body", modal._element).innerHTML = body||"";
//   return modal;
// }
//
// function modal(title, body){
//   modalSet(centerModal, title, body).show();
// }
