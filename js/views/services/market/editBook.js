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
    $("#detail-book").attr("href", "./detail-buku.html?_i=" + urlParams._i[0])
    $("#edit-file-buku").attr("href", "./edit-file.html?_i=" + urlParams._i[0])

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/products/" + urlParams._i[0],
        dataType: 'json',
        success: function (data) {
            console.log(data)

            $("#img").attr("src", data.product.productPhoto)
            $("#title").val(data.product.title)
            $("#author").val(data.product.author)
            $("#publisher").val(data.product.publisher)
            $("#skuMarket").val(data.product.sku)
            $("#isbn").val(data.product.isbn)
            $("#price").val(data.product.price)
            $("#description").val(data.product.description)
            $("#page").val(data.product.pageTotal)
            $("#edit-foto-buku").attr("href", "./edit-foto-buku.html?_i=" + urlParams._i[0])
        },
        error: function (errMsg) {
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });

    $("#save").click(function () {
        var data = {
            "description": $("#description").val(),
            "price": $("#price").val(),
            "productId": urlParams._i[0]
        }

        if ($("#price").val() == "") {
            var html = `
                <div id="icon"><i class="fas fa-times-circle f14-red mb-2 mt-2"></i> </div>
                <div class="prof" id="modalMsgEdit">Harga tidak boleh kosong</div>
                <label class="prof-ok" data-dismiss="modal"><button class="modal-btn-ok">Oke</button></label>
            `
            $("#modal-body").html(html)
            $("#modalInfo").click()
            return;
        }

        if ($("#description").val() == "") {
            var html = `
                <div id="icon"><i class="fas fa-times-circle f14-red mb-2 mt-2"></i> </div>
                <div class="prof" id="modalMsgEdit">Deskripsi tidak boleh kosong</div>
                <label class="prof-ok" data-dismiss="modal"><button class="modal-btn-ok">Oke</button></label>
            `
            $("#modal-body").html(html)
            $("#modalInfo").click()
            return;
        }


        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/products/edit",
            dataType: 'json',
            data: JSON.stringify(data),
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                var html = `
                    <div id="icon"><i class="fas fa-check f14 mb-2 mt-2"></i> </div>
                    <div class="prof" id="modalMsgEdit">Item berhasil diperbaharui</div>
                    <label class="prof-ok" data-dismiss="modal"><button class="modal-btn-ok">Oke</button></label>
                `
                $("#modal-body").html(html)
                $("#modalInfo").click()

            },
            error: function (errMsg) {
                // window.location.replace("/404.html")
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
});