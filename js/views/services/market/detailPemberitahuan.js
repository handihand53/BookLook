import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {
    var marketId
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
            marketId = data.marketId
            if (data.marketId != null) {
                $("#loading").css("visibility", "hidden");
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

    var month = new Array();
    month[0] = "Januari";
    month[1] = "Februari";
    month[2] = "Maret";
    month[3] = "April";
    month[4] = "Mei";
    month[5] = "Juni";
    month[6] = "Juli";
    month[7] = "Agustus";
    month[8] = "September";
    month[9] = "Oktober";
    month[10] = "November";
    month[11] = "Desember";
    var confirmId = urlParams._i;

    function getDetailTrans() {
        checkJmlBukuTerjual()
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/transactions/market/show/" + urlParams._i,
            dataType: 'json',
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#content").html("")
                var d = new Date(data.transaction.createdAt);
                var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                $("#noDetailTransaksi").html(data.transaction.transactionCode)
                $("#tglTransaksi").html(tgl)
                var username = ""
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "http://127.0.0.1:8080/api/users/" + data.transaction.userId,
                    dataType: 'json',
                    async: false,
                    headers: {
                        'Authorization': `Bearer ` + getCookie("token"),
                    },
                    success: function (data) {
                        username = data.username
                    }
                });
                $("#namaPemesan").html(username)

                $("#price").html(data.transaction.checkout.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
                for (var i = data.transactionDetail.length - 1; i >= 0; i--) {
                    if (data.transactionDetail[i].marketId == marketId) {

                        if (data.transactionDetail[i].marketConfirm == "CONFIRMED") {
                            $("#proses").attr("disabled", true)
                            $("#proses").removeClass("btn-proses")
                            $("#proses").addClass("btn-finish")
                            $("#proses").html("Selesai")
                            $("#status").css("color", "rgb(0, 157, 0)")
                            $("#status").html(data.transactionDetail[i].marketConfirm)
                        } else {
                            $("#status").css("color", "#fc2803")
                            $("#status").html(data.transactionDetail[i].marketConfirm)
                        }

                        var html = `

                    <div class="col-12 plr-5">
                        <div class="shadow-card mb-3 p-3">
                        <div>
                            <p class="judul-utama" title="` + data.transactionDetail[i].product.title + `">` + data.transactionDetail[i].product.title + `</p>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-3-custom">
                            <div class="no-border border-radius-4 mb-3">
                                <img src="` + data.transactionDetail[i].product.productPhoto + `" alt=""
                                class="width-img ">
                            </div>
                            </div>
                            <div class="col-9-custom plr-25">
                            <div class="row border-bottom background-gray">
                                <p class="col-6 list-i">Penulis Buku</p>
                                <p class="col-6 list-i orange" title="` + data.transactionDetail[i].product.author + `">` + data.transactionDetail[i].product.author + `</p>
                            </div>
                            <div class="row border-bottom">
                                <p class="col-6 list-i">Penerbit</p>
                                <p class="col-6 list-i" title="` + data.transactionDetail[i].product.publisher + `">` + data.transactionDetail[i].product.publisher + `</p>
                            </div>
                            <div class="row border-bottom background-gray">
                                <p class="col-6 list-i">ISBN</p>
                                <p class="col-6 list-i" title="` + data.transactionDetail[i].product.isbn + `">` + data.transactionDetail[i].product.isbn + `</p>
                            </div>
                            <div class="row border-bottom">
                                <p class="col-6 list-i">SKU</p>
                                <p class="col-6 list-i" title="` + data.transactionDetail[i].product.sku + `">` + data.transactionDetail[i].product.sku + `</p>
                            </div>
                            <div class="row border-bottom background-gray">
                                <p class="col-6 list-i">Jumlah Halaman</p>
                                <p class="col-6 list-i" title="` + data.transactionDetail[i].product.pageTotal + `">` + data.transactionDetail[i].product.pageTotal + ` Halaman</p>
                            </div>
                            <div class="row border-bottom">
                                <p class="col-6 list-i">Harga</p>
                                <p class="col-6 blue list-i" title="Rp. ` + data.transactionDetail[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `">Rp. <span>` + data.transactionDetail[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</span></p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    `;
                        $("#content").append(html)
                    }

                }
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    }
    getDetailTrans()

    $("#proses").click(function () {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/transactions/market/confirm/" + confirmId,
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#modalInfo").click()
                if (checkTransaksi() != 0) {
                    $(".notif-toko").html(checkTransaksi())
                    $(".notif-toko").css("display", "inline-block")
                    $(".notif-toko-drop").html(checkTransaksi())
                    $(".notif-toko-drop").css("display", "inline-block")
                } else {
                    $(".notif-toko").css("display", "none")
                    $(".notif-toko-drop").css("display", "none")
                }
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })

    $('#showInfo').on('hidden.bs.modal', function (e) {
        getDetailTrans()
        $("#pemberitahuan").html("")
        $("#pemberitahuan").css("background", "transparent")
    })

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