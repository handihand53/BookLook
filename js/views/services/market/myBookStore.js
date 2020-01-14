import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {

    var book = new Array()
    var f = false;
    var str

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
            book = data
            listBook(book, str)
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

    function listBook(data, str) {
        f == false
        $("#product-content").html("")
        if (data.length != 0) {
            if (str == "" || str == undefined) {
                for (var i = 0; i < data.length; i++) {
                    var btn = ""
                    var disableBook = ""
                    var opp = ""
                    f = true
                    if (data[i].productConfirm == "UNCONFIRMED") {
                        disableBook = `class="disable-book"`;
                        opp = `opacity`
                        btn = `
                    <button class="btn-detail disabled" disabled style="padding: 0px!important">Tunggu konfirmasi</button></a>
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
                for (var i = 0; i < data.length; i++) {
                    if (str.toLowerCase() == data[i].title.substring(0, str.length).toLowerCase()) {
                        f = true;
                        var btn = ""
                        var disableBook = ""
                        var opp = ""
                        if (data[i].productConfirm == "UNCONFIRMED") {
                            disableBook = `class="disable-book"`;
                            opp = `opacity`
                            btn = `
                    <button class="btn-detail disabled" disabled style="padding: 0px!important">Tunggu konfirmasi</button></a>
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
                }
            }

            if (f == false && data.length != 0) {
                $("#product-content").html("<div class='p-3'>Tidak ada buku dengan judul <b>" + str + "</b></div>");
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
    }

    $("#sort").click(function () {
        if ($("#drop-sort").attr("data-status") == "0") {
            $("#drop-sort").addClass("show")
            $("#drop-sort").attr("data-status", "1")
        } else {
            $("#drop-sort").removeClass("show")
            $("#drop-sort").attr("data-status", "0")
        }
    })

    $(".sort-content").click(function () {
        $("#drop-sort").attr("data-status", "0")
        $("#drop-sort").removeClass("show")

        if ($(this).attr("data-sort") == "judulAsc")
            book.sort(judulAsc);
        else if ($(this).attr("data-sort") == "judulDesc")
            book.sort(judulDesc);
        else if ($(this).attr("data-sort") == "hargaAsc")
            book.sort(hargaAsc);
        else if ($(this).attr("data-sort") == "hargaDesc")
            book.sort(hargaDesc);
        listBook(book, $('#search').val())
    })

    $('#search').on('input', function () {
        listBook(book, $('#search').val())
    });

    $(".sort-content").click(function () {
        $("#drop-sort").attr("data-status", "0")
        $("#drop-sort").removeClass("show")

        if ($(this).attr("data-sort") == "judulAsc")
            book.sort(judulAsc);
        else if ($(this).attr("data-sort") == "judulDesc")
            book.sort(judulDesc);
        else if ($(this).attr("data-sort") == "hargaAsc")
            book.sort(hargaAsc);
        else if ($(this).attr("data-sort") == "hargaDesc")
            book.sort(hargaDesc);
        listBook(book, $('#search').val())
    })

    function judulAsc(a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function judulDesc(a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function hargaAsc(a, b) {
        var nameA = a.price
        var nameB = b.price
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function hargaDesc(a, b) {
        var nameA = a.price
        var nameB = b.price
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }
});