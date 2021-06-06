console.log('event member regist.js');
(()=>{
  let $name = $("#form-name");
  let $date = $("#form-date");
  let $phone = $("#form-phone");
  let $email = $("#form-email");
  let $fromEmail = $("#form-from-email");
  let $picture1 = $("#form-picture1");
  let $picture2 = $("#form-picture2");
  let $picture3 = $("#form-picture3");
  let $check = $("#form-allow-check");
  // let $files = $("#form-album");
  // let $capture = $("#form-camera");
  let $password = $("#form-pw");
  let $password2 = $("#form-pw2");
  let spinner = Ladda.create($("#btn-register").get(0));

  let $imageContainer = $("#image-container");

  window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  async function init(){
    // console.log("??????")
    // console.log("wait socketReady");
    // await socketReady;
    // setupSocket();

    // onchange = evt => {
    // const [file] = imgInp.files
    // if (file) {
    //   blah.src = URL.createObjectURL(file)
    // }

    // if(!mobileAndTabletCheck()){
    //   $(".capture").hide();
    // }

    function onFileSelect(e){
      // console.error(e.target.files);
      $imageContainer.html('');
      // let files = e.target.files;
      let files = getFiles();

      for(let i=0; i<files.length; i++){
        let src = URL.createObjectURL(files[i]);
        let img = new Image();
        img.src = src;
        $imageContainer.append(img);
      }
    }

    $picture1.on("change", onFileSelect);
    $picture2.on("change", onFileSelect);
    $picture3.on("change", onFileSelect);
    // $capture.on("change", onFileSelect);

    // $password2.on("input", e=>{
    //   let password = $password.val();
    //   let password2 = $password2.val();
    //
    //   if(!password || password !== password2){
    //     $password2.removeClass("border-success").addClass("border-danger");
    //   }else{
    //     $password2.toggleClass("border-danger").addClass("border-success");
    //   }
    // })

    $name.focus();

    // if($email.val()){
    //   $password.focus();
    // }else{
    //   $email.focus();
    // }

    $phone.on("keypress", onKeypressPhoneNumber);
    $phone.on("input", onInputPhoneNumber);

    // $password2.on("keydown", e=>{
    //   if(e.keyCode == 13){
    //     register();
    //   }
    // })

    $("#btn-register").on("click", e=>{
      register();
    })
  }

  function onKeypressPhoneNumber(event){
    if(event.key === '-' || event.key >= 0 && event.key <= 9) {
      return true;
    }

    return false;
  }

  // let expPhone = expgen("#(#(#(-(#(#(#(#(-(#(#(#(#)?)?)?)?)?)?)?)?)?)?)?)?");
  let expPhone = expgen("(0(1(0(-(#(#(#(#(-(#(#(#(#)?)?)?)?)?)?)?)?)?)?)?)?)?");
  let expNum = expgen("#");
  function onInputPhoneNumber(event){
    // console.log("prev", this.dataset.temp);
    // console.log(this.value);
    // console.log(expPhone.test(this.value));
    let c = event.originalEvent.data;
    let f = expPhone.test(this.value);

    if(this.dataset.temp !== undefined && expPhone.test(this.dataset.temp+'-') && expNum.test(c)){
      this.value = this.dataset.temp + '-' + c;
    }else{
      if(!f){
        this.value = this.dataset.temp||'';
      }
    }
    this.dataset.temp = this.value;
  }

  function getFiles(){
    return [$picture1, $picture2, $picture3].map($el=>$el.get(0).files[0]).filter(a=>!!a)
    // let files = Array.from($files.get(0).files);
    // if(mobileAndTabletCheck()){
    //   files = files.concat(...Array.from($capture.get(0).files));
    // }
    // return files;
  }

  async function register(){
    let name = $name.val();
    let phone = $phone.val();
    let date = $date.val();
    let email = $email.val();
    let fromEmail = $fromEmail.val();
    let password = $password.val();
    let files = getFiles();

    // console.error($check.get(0).checked);
    // return;
    // let password2 = $password2.val();
    // console.log(files);
    // return;

    let p = [
      [name, "이름을"],
      [phone, "핸드폰번호를", expgen("010-####-####"), "잘못된 핸드폰번호 형식입니다"],
      [date, "생년월일을"],
      [email, "이메일을", expgen('&email'), "잘못된 이메일 형식입니다"],
      [password, "비밀번호를"]
    ]


    for(let i=0; i<p.length; i++){
      // let chk;
      // if(p[i][2] !== undefined){
      //   chk = p[i][2].test(p[i][0]);
      // }else{
      //   chk = !!p[i][0];
      // }
      // if(!chk){
      //   modal("알림", p[i][3]||(p[i][1] + " 입력해주세요"));
      //   return;
      // }

      if(!p[i][0]){
        modal("알림", p[i][1] + " 입력해주세요");
        return;
      }else if(p[i][2] !== undefined && !p[i][2].test(p[i][0])){
        modal("알림", p[i][3] || (p[i][1] + " 입력해주세요"));
        return;
      }
    }

    if(!expgen('&email').test(email)){
      modal("알림", "잘못된 이메일 형식입니다");
      return;
    }

    // console.log(1, files)
    // console.log(2, $picture1.get(0).files);

    if(files.length != 3){
      modal("알림", "사진 수량이 너무 적습니다. 신분증 앞, 뒤 사진과 신분증 들고 찍은 셀카를 올려주세요");
      return;
    }

    if(!$check.get(0).checked){
      modal("알림", "개인정보 수집 및 이용 동의를 확인해주세요.")
      return;
    }

    // if(!password2){
    //   modal("알림", "password2를 입력해주세요");
    //   return;
    // }
    //
    // if(password !== password2){
    //   modal("알림", "비밀번호확인이 틀립니다.");
    //   return;
    // }



    const formData = new FormData();
    for(let i=0; i<files.length; i++){
      formData.append("photos", files[i]);
    }
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("fromEmail", fromEmail);
    formData.append("password", password);
    formData.append("birthday", date);

    // console.error({email, password});
    spinner.start();
    // axios.post('/event/regist/info', formData).then(res=>{
    let res;
    res = await axios({
      method: "post",
      url: '/event/member/regist/check',
      data: {email}
    })
    if(res.data.status == "success"){
      if(res.data.has == true){
        modal("알림", "이미 가입신청된 이메일입니다.");
        spinner.stop();
        return;
      }
    }else{
      modal("알림", "확인 오류, 다시 시도해주세요.");
      spinner.stop();
      return;
    }

    res = await axios({
      method: "post",
      url: '/event/member/regist/upload',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    })
    // .then(res=>{
    if(res.data.status == "success"){
      $(".page-1").addClass("hide");
      $(".page-2").removeClass("hide");
      spinner.stop();
      // modal("알림", "가입신청이 완료됐습니다. 2단계 톡 인증을 진행해주세요.").then(()=>{
      //   $(".page-1").addClass("hide");
      //   $(".page-2").removeClass("hide");
      //   spinner.stop();
      //   // window.location.href = '/login';
      // })
    }else{
      modal("알림", res.data.message).then(()=>{
        spinner.stop();
      });
      console.error(res);
    }
    // })
  }

  // function setupSocket(){
  //   // socket.on("", ()=>{
  //   //
  //   // })
  //
  // }

  init();
  // appReadyResolve();
})()
