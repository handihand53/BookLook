import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {
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
            if (data.marketId != null) {
                $("#loading").css("visibility", "hidden");
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
                $("#marketName").html(data.marketName)
                $("#marketName2").val(data.marketName)
                $("#marketSku").val(data.marketSKU)
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
                console.log(data);
                $("#modalMsgEdit").html(data.message)
                $("#editProf").click();
            },
            error: function (errMsg) {
                console.log(errMsg)
                console.log(errMsg.responseJSON.message)
                $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
                $("#modalMsgEdit").html(errMsg.responseJSON.message);
                $("#editProf").click();
            }
        });
    });
});