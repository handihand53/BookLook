import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(document).ready(function () {

    function checkMarket() {
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
                window.location.replace("/market/store.html")
            },
            error: function (errMsg) {
                $("#loading").css("visibility", "hidden");
            }
        });
    }

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
            checkMarket()
        },
        error: function (errMsg) {
            
        }
    });


    $("#daftar").click(function () {
        $(".error").each(function () {
            $(this).html("");
        });

        var storeName = $("#storeName").val();
        var storeSku = $("#storeSku").val();
        var storeBio = $("#storeBio").val();
        var errorNama = $("#errorMsgNama");
        var errorSku = $("#errorMsgSku");
        var errorBio = $("#errorMsgBio");
        var x, y, z;
        if (storeName.length < 6) {
            errorNama.html("Nama toko minimal panjang 6 karakter");
            x = false;
        } else x = true;

        if (storeSku.length < 2 || storeSku.length > 5) {
            errorSku.html("Sku toko terdiri dari 2-5 karakter");
            y = false;
        } else y = true

        if (storeBio.length < 1) {
            errorBio.html("Deskripsi toko tidak boleh kosong! ");
            z = false;
        } else z = true;
        if (x && y && z) {

            var data = {
                "marketName": storeName,
                "marketSKU": storeSku,
                "marketBio": storeBio
            };

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/markets/create",
                data: JSON.stringify(data),
                dataType: 'json',
                cache: false,
                timeout: 600000,
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                success: function (msg) {
                    $("#clk").click();
                    setTimeout(function () {
                        window.location.replace("/market/store.html")
                    }, 1000);
                },
                error: function (errMsg) {
                    console.log(errMsg);
                }
            });
        }
    });
});