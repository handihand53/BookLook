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
            if(!data.success)
                window.location.replace("/user/user.html")
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });
    
    if (checkTransaksi() != 0) $("#pemberitahuan").html(checkTransaksi())
    let id;
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        async: false,
        success: function (data) {
            id = data.marketId;
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
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://localhost:8080/api/products/market/auth/all",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token")
        },
        success: function (data) {
            console.log(data)
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    var btn = ""
                    var disableBook = ""
                    var opp = ""
                    if (data[i].productConfirm == "UNCONFIRMED") {
                        disableBook = `class="disable-book"`;
                        opp = `opacity`
                        btn = `
                        <button class="btn-detail disabled" disabled>Tunggu konfirmasi</button></a>
                        `;
                    } else {
                        btn = `
                        <a href="detail-buku.html?_i=` + data[i].productId + `"><button class="btn-detail">Detail</button></a>
                        `
                    }

                    var html = `
                        <div class="col-3-custom max-min">
                        <div class="content-border shadow-card no-border border-radius-4">
                            <div ` + disableBook + `>
                                <img src="` + data[i].productPhoto + `" alt="" class="width-img ` + opp + `">
                            </div>
                            <div class="p-2">
                            <p class="title-book" title="` + data[i].title + `">` + data[i].title + `</p>
                            <p class="author-book">` + data[i].author + `</p>
                            <p class="price-store">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                            ` + btn + `
                            </div>
                        </div>
                        </div>
                        `
                    $("#product-content").append(html)
                }
            } else {
                $("#product-content").removeClass("flex-row")
                var html = `
                <div class="bg-products"></div>
                <div class="center book">Belum Ada Buku.</div>
                <div class="center book-12">Ayo mulai <a href="/market/tambah_buku.html"><span class="link">tambah</span></a> buku.</div>
              `
                $("#product-content").append(html)

            }
        },
        error: function (errMsg) {
            console.log(errMsg);
            // window.location.replace("/404.html")
        }
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