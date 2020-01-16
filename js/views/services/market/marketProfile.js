import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {

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
                $("#loading").css("visibility", "hidden");
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
                $("#marketName").html(data.marketName)
                $("#marketName2").val(data.marketName)
                $("#marketSku").val(data.marketCode)
                $("#marketBio").val(data.marketBio)
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    $("#save").click(function () {

        var marketBio = $("#marketBio").val();
        var marketName = $("#marketName2").val();

        if (marketBio == "") {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Biodata tidak boleh kosong`);
            $("#editProf").click();
            return
        }

        var data = {
            "marketBio": marketBio,
            "marketName": marketName
        }

        $.ajax({
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            url: "http://127.0.0.1:8080/api/markets/edit/profile",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
                $("#modalMsgEdit").html(data.message)
                $("#editProf").click();
            },
            error: function (errMsg) {
                $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
                $("#modalMsgEdit").html(errMsg.responseJSON.message);
                $("#editProf").click();
            }
        });
    });
    checkJmlBukuTerjual()

    function checkJmlBukuTerjual() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/transactions/market/show",
            dataType: 'json',
            async: true,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                var tot = 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].transferConfirm == "PENDING") {} else tot++
                }
                $("#jmlBuku").html(tot)
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Toko</span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.history.back();
    })

});