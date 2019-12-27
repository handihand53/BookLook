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
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
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
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/market/show/" + urlParams._i,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            var d = new Date(data.transaction.createdAt);
            var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
            $("#noDetailTransaksi").html(data.transaction.transactionId)
            $("#tglTransaksi").html(tgl)
            $("#namaPemesan").html(data.transaction.userId)
            $("#status").html(data.transaction.transferConfirm)
            $("#price").html(data.transaction.checkout.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
            if(data.transaction.transferConfirm=="SUCCESS") {
                $("#proses").attr("disabled", true)
                $("#proses").removeClass("btn-proses")
                $("#proses").addClass("btn-finish")
                $("#proses").html("Selesai")
                $("#status").css("color", "rgb(0, 157, 0)")
            }
            for (var i = 0; i < data.transactionDetail.length; i++) {
                var html = `
                <div class="col-12 plr-5">
                    <div class="row shadow-card mb-3">
                    <div class="col-3-custom">
                        <div class="no-border border-radius-4">
                        <img src="`+data.transactionDetail[i].product.productPhoto+`" alt="" class="width-img">
                        </div>
                    </div>
                    <div class="col-9-custom plr-25">
                        <div class="row border-bottom">
                        <p class="col-md-6 title-text">Judul</p>
                        <p class="title-book col-md-6">`+data.transactionDetail[i].product.title+`</p>
                        </div>
                        <div class="row border-bottom">
                        <p class="col-md-6 title-text">Penulis</p>
                        <p class="author-book col-md-6 ">`+data.transactionDetail[i].product.author+`</p>
                        </div>
                        <div class="row border-bottom">
                        <p class="col-md-6 title-text">ISBN</p>
                        <p class="title-book col-md-6">`+data.transactionDetail[i].product.isbn+`</p>
                        </div>
                        <div class="row border-bottom">
                        <p class="col-md-6 title-text">SKU</p>
                        <p class="title-book col-md-6">`+data.transactionDetail[i].product.sku+`</p>
                        </div>
                        <div class="row border-bottom">
                        <p class="col-md-6 title-text">Harga</p>
                        <p class="title-book col-md-6 blue">Rp. <span>`+data.transactionDetail[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '')+`</span></p>
                        </div>
                    </div>
                    </div>
                </div>
                `;
                $("#content").append(html)
            }
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });


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
                console.log(data)
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })
});