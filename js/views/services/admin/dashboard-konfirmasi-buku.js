import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';

$(document).ready(function () {
    console.log(getCookie("token"))
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/products/unconfirmed",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log(data)
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });



    $("#dash-konfirmasi").addClass("li-active")
    $("#dash-konfirmasi-link").addClass("link-list")
    $("#dash-konfirmasi-mob").addClass("li-active")
    $("#dash-konfirmasi-link-mob").addClass("link-list")
})