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
                        if (!data.success) {
                            $("#market").attr("data-toggle", "modal")
                            $("#market").attr("data-target", "#blokir")
                            $("#market").html($("#market").html()+ ` <span style="font-weight: bold; color: #ff5447; ">Terblokir</span>`)
                        } else {
                            $("#market").click(function () {
                                window.location.assign("/market/store.html");
                            })
                        }
                    }
                });
            }else{
                $("#market").html($("#market").html()+ ` <span style="color: #7d7d7d; ">Daftar</span>`)
            }
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}