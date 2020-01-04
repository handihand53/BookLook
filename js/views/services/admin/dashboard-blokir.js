import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';


$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/profile",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {},
        error: function (err) {
            window.location.assign("/admin_login.html");
        }
    });

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/block/market",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log(data)
        },
        error: function (err) {
            console.log(err)
            // window.location.assign("/admin_login.html");
        }
    });



    $("#dash-blokir").addClass("li-active")
    $("#dash-blokir-link").addClass("link-list")
    $("#dash-blokir-mob").addClass("li-active")
    $("#dash-blokir-link-mob").addClass("link-list")
})