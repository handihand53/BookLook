import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets/block/check",
        dataType: 'json',
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (!data.success)
                window.location.replace("/user/user.html")
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });

    if (checkTransaksi() != 0) $("#pemberitahuan").html(checkTransaksi())
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.marketId != null) {
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
                $("#loading").css("visibility", "hidden");
                $("#marketName").html(data.marketName)
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });
});