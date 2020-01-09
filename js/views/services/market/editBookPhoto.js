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
    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);
    var fileName = "";

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
        async: false,
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
        $("#upload-photo").click();
    })

    $('input[id="upload-photo"]').change(function (file2) {
        var _URL = window.URL || window.webkitURL
        var photoInput = document.querySelector("#input");
        if ($("#upload-photo").get(0).files[0] == null) {
            $("#img").attr("src", "")
        } else {
            var fileExtension = ['jpeg', 'jpg', 'png'];
            if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                alert("Format foto yang diperbolehkan : " + fileExtension.join(', '));
                return;
            }

            // checker for img size
            // ==========================================================
            var file = $(this)[0].files[0];

            var img = new Image();
            var imgwidth = 0;
            var imgheight = 0;
            var maxwidth = 600;
            var maxheight = 900;
            fileName = file2.target.files[0].name;

            img.src = _URL.createObjectURL(file);
            img.onload = function () {
                imgwidth = this.width;
                imgheight = this.height;
                if (imgwidth % 2 != 0 || imgheight % 3 != 0 || imgwidth / imgheight > 0.7 || imgwidth / imgheight < 0.6) {
                    alert("Ukuran Foto tidak valid")
                    $("#img").attr("src", "");
                    fileName = ""
                    return
                }
            }

            var reader = new FileReader();
            reader.readAsDataURL(event.srcElement.files[0]);
            // var me = this;
            reader.onload = function () {
                var fileContent = reader.result;
                $('#img').attr('src', fileContent);
            }
        }
    });

    var today = new Date();
    var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
    var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds() + "" + today.getMilliseconds();
    var dateTime = date + '' + time;

    $("#save").click(function () {
        var pict = $("#upload-photo").get(0).files[0];

        if (pict == null || fileName == "") {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Foto masih kosong`);
            $("#editProf").click();
            return
        }

        var berkasName = dateTime + pict.name
        var fd = new FormData();
        fd.append('picture', pict, berkasName);
        fd.append('productId', urlParams._i[0])

        $.ajax({
            type: "PUT",
            url: "http://127.0.0.1:8080/api/products/edit/photo",
            timeout: 600000,
            data: fd,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                console.log(data)
                $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
                $("#modalMsgEdit").html(`Perubahan foto berhasil disimpan`);
                $("#editProf").click();
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })

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
});