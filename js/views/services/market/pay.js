import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {
    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);

    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {},
            i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/user/show/" + urlParams.i,
        dataType: 'json',
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.transaction.transferConfirm == "PENDING")
                window.location.replace("/user/")
            $(".totPrice").html(data.transaction.checkout.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    var phnm = false;

    document.getElementById("numphone").addEventListener("input", function () {
        var s = $("#numphone").val().toString()
        if (s.length < 9 || s.length > 14) {
            $("#errPhone").html("Panjang nomor telepone adalah 10 - 14 angka")
            phnm = false
        } else {
            phnm = true
            $("#errPhone").html("")
        }
    })

    $("#bayar").click(function () {
        if ($("#customRadioInline1").prop("checked") == true) {
            bayar()
        } else if ($("#customRadioInline2").prop("checked") == true) {
            if ($("#numphone").val() == "" || $("#numphone").val() == undefined) {
                $("#feedback").html("Tolong isi nomor telepon terlebih dahulu")
            } else if (phnm == false) {} else if (phnm == true) {
                bayar()
            }
        } else {
            $("#feedback").html("Tolong pilih metode pembayaran terlebih dahulu")
        }
    })

    function bayar() {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/transactions/user/confirm/" + urlParams.i,
            dataType: 'json',
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#modalBayar").click()
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    $('#marketkuModal').on('hidden.bs.modal', function (e) {
        window.location.replace("/user/")
    })

    $(".code").html(Math.floor(100000000000 + Math.random() * 900000000000))

    $("#customRadioInline1").click(function () {
        $("#trans").addClass("show")
        $("#trans").removeClass("hide")
        $("#ovo").addClass("hide")
        $("#ovo").removeClass("show")
    })

    $("#customRadioInline2").click(function () {
        $("#ovo").addClass("show")
        $("#ovo").removeClass("hide")
        $("#trans").addClass("hide")
        $("#trans").removeClass("show")
    })

    $('#numphone').on('focus', function (e) {
        $(this).on('wheel', function (e) {
            e.preventDefault();
        });
    });

    $('#numphone').on('keydown', function (e) {
        if (e.which == 38 || e.which == 40)
            e.preventDefault();
    });

    document.getElementById("numphone").addEventListener("keypress", function (evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    });
})