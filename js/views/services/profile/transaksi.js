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

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/user/show",
        dataType: 'json',
        headers: {
          'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
         console.log(data)
        },
        error: function (errMsg) {
        //   window.location.replace("/404.html")
        }
      });

      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/user/show/06debf2d-a5cc-4d72-b26b-29137931e2f9",
        dataType: 'json',
        headers: {
          'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
         console.log(data)
        },
        error: function (errMsg) {
        //   window.location.replace("/404.html")
        }
      });

});