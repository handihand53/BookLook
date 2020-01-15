import {
    setCookie,
    getCookie,
    checkCookie
  } from './cookies.js'

export default function checkTransaksi(){
    let count=0;
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/market/show",
        async: false,
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            for(var i=0;i<data.length;i++){
                if(data[i].transferConfirm=="PENDING")count++
            }
        }
    });
    return count;
}