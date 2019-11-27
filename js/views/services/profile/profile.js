import {
    setCookie,
    getCookie,
    checkCookie
  } from '../../../cookies.js'

  import checkMarket from '../../../marketCheck.js';


$(window).load(function() {

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
            
          $("#displayName").html(data.name);
          $("#nama-lengkap").val(data.name);
          $("#email-prof").val(data.email)
          $("#nomor-prof").val(data.numberPhone)
        //   $("#biodata-profile").val(data.biodata)
        },
        failure: function(errMsg) {
          console.log(errMsg); 
        }
      });

      checkMarket();
});