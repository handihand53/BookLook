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
        success: function (data) {
        },
        error:function (err){
            window.location.assign("/admin_login.html");
        }
    });
    

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/dashboard/statistic",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log(data)
        },
        error:function (err){
            window.location.assign("/admin_login.html");
        }
    });
    $("#dash-home").addClass("li-active")
    $("#dash-home-link").addClass("link-list")
    $("#dash-home-mob").addClass("li-active")
    $("#dash-home-link-mob").addClass("link-list")
})