import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {
    getDataUser()

    var readKey
    var id

    function getDataUser() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/users",
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {

                console.log(data)
                id = data.userId
                readKey = data.readKey;
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
    }

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
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });

    var long = ""
    var short = ""
    var res
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/products/" + urlParams._i,
        dataType: 'json',
        async: false,
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.product.productConfirm == "UNCONFIRMED") {
                $("#bookContent").html("Buku yang kamu cari tidak ada / belum tersedia")
                window.location.replace("/404.html")
            } else {
                $("#loading").css("visibility", "hidden");
                res = data.product.productFile.split("/");
                if (data.product.description.toString().length > 400) {
                    long = data.product.description + `<span class="read-more" id="less-more"> Lebih sedikit</span>`
                    short = data.product.description.substring(0, 400) + "..." + `<span class="read-more" id="read-more"> Lebih banyak</span>`
                } else {
                    short = data.product.description
                }

                var html = `
                <div class="col-3-custom">
                <div class="content-border shadow-card no-border border-radius-4 max-min">
                  <img src="` + data.product.productPhoto + `" alt="" class="width-img ">
                </div>
              </div>
              <div class="col-9-custom mt-4">
                <div class="row">
                    <p class="title-book col-6">Judul Buku</p>
                    <p class="title-book col-6" title="` + data.product.title + `">` + data.product.title + `</p>
                </div>
                <hr>
                <div class="row">
                    <p class="title-book col-6">Penulis Buku</p>
                    <p class="title-book col-6" title="` + data.product.title + `">` + data.product.author + `</p>
                </div>
                <hr>
                <div class="row">
                    <p class="title-book col-6">Penerbit Buku</p>
                    <p class="title-book col-6" title="` + data.product.title + `">` + data.product.publisher + `</p>
                </div>
                <hr>
                <div class="row">
                    <p class="title-book col-6">ISBN Buku</p>
                    <p class="title-book col-6" title="` + data.product.title + `">` + data.product.isbn + `</p>
                </div>
                <hr>
                <div class="row">
                    <p class="title-book col-6">SKU Buku</p>
                    <p class="title-book col-6" title="` + data.product.sku + `">` + data.product.sku + `</p>
                </div>
                <hr>
                <div class="row">
                    <p class="title-book col-6">Harga</p>
                    <p class="title-book orange col-6" title="Rp. ` + data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `">Rp. ` + data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                </div>
                <hr>
                <p class="deskripsi">Deskripsi</p>
                <p class="mb-4 desk" id="deskripsi">` + short + `</p>
                <br>
                <button class="btn-read">Lihat</button>
                <a href="edit_buku.html?_i=` + data.product.productId + `"><button class="btn-edit">Edit</button></a>
              </div>
                `
                $("#bookContent").html(html)
                bindReadMore()
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    function bindReadMore() {
        $("#read-more").click(function () {
            $("#deskripsi").html(long)
            bindLess()
        })
    }

    function bindLess() {
        $("#less-more").click(function () {
            $("#deskripsi").html(short)
            bindReadMore()
        })
    }

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
    $(".btn-read").click(function () {
        getDataUser()
        window.open("/market/readbook.html?file=" + res[res.length - 1] + "&id=" + id + "&key=" + readKey)
    })
});