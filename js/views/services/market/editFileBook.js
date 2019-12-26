import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {
    if (checkTransaksi() != 0) $("#pemberitahuan").html(checkTransaksi())
    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);
    var fileName = ""

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

    $("#edit-book").attr("href", "./edit_buku.html?_i=" + urlParams._i[0])
    $("#detail-book").attr("href", "./detail-buku.html?_i=" + urlParams._i[0])

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/products/" + urlParams._i,
        dataType: 'json',
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.product.productConfirm == "UNCONFIRMED") {
                window.location.replace("/404.html")
            } else {
                $("#loading").css("visibility", "hidden");
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

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
                $("#marketName").html(data.marketName)
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    $("#input").click(function () {
        $("#upload-file").click();
    })

    $('input[id="upload-file"]').change(function (file2) {
        var _URL = window.URL || window.webkitURL
        var photoInput = document.querySelector("#input");
        if ($("#upload-file").get(0).files[0] == null) {
            $("#file-name").html("")
        } else {
            var fileExtension = ['pdf'];
            if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                alert("Format file yang diperbolehkan : " + fileExtension.join(', '));
                return;
            }
            fileName = file2.target.files[0].name;

            var maxSize = 200 * 1024 * 1024;
            if (file2.target.files[0].size > maxSize) {
                alert("Ukuran File terlalu besar")
                $("#file-name").html("")
                fileName = ""
                return
            }
            $("#file-name").html(fileName)
        }
    });

    var today = new Date();
    var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
    var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds() + "" + today.getMilliseconds();
    var dateTime = date + '' + time;

    $("#save").click(function () {
        var berkas = $("#upload-file").get(0).files[0];
        if (berkas == null || fileName == "") {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`File masih kosong`);
            $("#editProf").click();
            return
        }

        var berkasName = dateTime + berkas.name

        var fd = new FormData();
        fd.append('book', berkas, berkasName);
        fd.append('productId', urlParams._i[0])

        $.ajax({
            type: "PUT",
            url: "http://127.0.0.1:8080/api/products/edit/book",
            timeout: 600000,
            data: fd,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
                $("#modalMsgEdit").html(`Perubahan file berhasil disimpan`);
                $("#editProf").click();
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })



});