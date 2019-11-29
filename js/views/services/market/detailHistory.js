import {
    setCookie,
    getCookie,
    checkCookie
  } from '../../../cookies.js'
  
  $(window).load(function() {
      $.ajax({
          type: "GET",
          contentType: "application/json",
          url: "http://127.0.0.1:8080/api/markets",
          dataType: 'json',
          timeout: 600000,
          headers: {
              'Authorization': `Bearer ` + getCookie("token"),
          },
          success: function (data) {
            console.log(data);
              if(data.marketId!=null){
                  $("#marketName").html(data.marketName)
              }
          },
          failure: function(errMsg) {
              console.log(errMsg); 
          }
      });
  });   