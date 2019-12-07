import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';


$(window).load(function () {

  getDataUser();

  function getDataUser() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/users",
      dataType: 'json',
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        if(data.userPhoto==null)
          $('#img').attr('src', "../assets/else/signature.png");
        else
          $('#img').attr('src', data.userPhoto);
        $("#loading").removeClass("loading");
        $("#nama-pengguna").val(data.username)
        $("#displayName").html(data.name);
        $("#nama-lengkap").val(data.name);
        $("#email-prof").val(data.email)
        $("#nomor-prof").val(data.numberPhone)
      },
      error: function (errMsg) {
        window.location.replace("/404.html")
      }
    });
  }

  $("#save").click(editProfile);

  function editProfile() {
    var username = $("#nama-pengguna").val()
    var fullname = $("#nama-lengkap").val();
    var email = $("#email-prof").val()
    var numPhone = $("#nomor-prof").val()

    var numCheck = "^[0-9]";

    if (fullname == "") {
      $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
      $("#modalMsgEdit").html(`Nama lengkap tidak boleh kosong`);
      $("#editProf").click();
      return
    } else if (fullname.length < 4) {
      $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
      $("#modalMsgEdit").html(`Nama lengkap minimal 4 karakter`);
      $("#editProf").click();
      return
    }

    if (email == "") {
      $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
      $("#modalMsgEdit").html(`Email tidak boleh kosong`);
      $("#editProf").click();
      return
    } else if (!validate()) {
      $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
      $("#modalMsgEdit").html(`Format email salah`);
      $("#editProf").click();
      return
    }

    if (numPhone == "") {
      $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
      $("#modalMsgEdit").html(`Nomor telepon tidak boleh kosong`);
      $("#editProf").click();
      return
    } else if (!numPhone.match(numCheck)) {
      $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
      $("#modalMsgEdit").html(`Format no telepon salah!`);
      $("#editProf").click();
      return
    }

    var data = {
      "email": email,
      "name": fullname,
      "numberPhone": numPhone,
      "username": username,
    }


    $.ajax({
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
      url: "http://127.0.0.1:8080/api/users/edit/profile",
      dataType: 'json',
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        $("#editProf").click();
        getDataUser();
      },
      error: function (errMsg) {
        console.log(errMsg)
      }
    });
  }

  checkMarket();

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function validate() {
    var email = $("#email-prof").val()

    if (validateEmail(email)) {
      return true;
    }
    return false;
  }

});