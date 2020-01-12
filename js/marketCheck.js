import {
    setCookie,
    getCookie,
    checkCookie
} from './cookies.js'
export default function checkMarket() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.marketId != null) {
                $("#market").removeAttr("data-target")
                $("#market").click(function(){
                    window.location.href = "/market/store.html"
                })
            } else {
                $("#market").html(` <span>Daftar toko</span> `)
            }
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}