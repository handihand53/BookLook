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
            window.location.replace("/404.html")
        }
    });

    var trigger = false;

    $("#daftar").click(function () {
        $(".error").each(function () {
            $(this).html("");
        });

        var storeName = $("#storeName").val();
        var storeBio = $("#storeBio").val();
        var errorNama = $("#errorMsgNama");
        var errorBio = $("#errorMsgBio");
        var x, y, z;
        if (storeName.length < 6) {
            $("#storeName").addClass("is-invalid")
            errorNama.html("Nama toko minimal panjang 6 karakter");
            x = false;
        } else {
            $("#storeName").removeClass("is-invalid")
            x = true;
        }

        if (storeBio.length < 1) {
            $("#storeBio").addClass("is-invalid")
            errorBio.html("Deskripsi toko tidak boleh kosong");
            z = false;
        } else {
            $("#storeBio").removeClass("is-invalid")
            z = true;
        }

        if (x && z) {

            var data = {
                "marketName": storeName,
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
                    trigger = true
                    $("#fail-msg").html("Market Berhasil didaftarkan.")
                    $("#logo").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
                    $("#logo").addClass("c-blue")
                    $("#logo").removeClass("c-red")
                    $("#clk").click();
                },
                error: function (errMsg) {
                    $("#fail-msg").html(errMsg.responseJSON.message)
                    $("#logo").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
                    $("#logo").addClass("c-red")
                    $("#clk").click();
                    console.log(errMsg)
                }
            });
        }
    });

    $('#marketkuModal').on('hidden.bs.modal', function (e) {
        if (trigger) {
            window.location.replace("/market/store.html")
        }
    })

});