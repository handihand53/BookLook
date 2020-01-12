import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';

$(window).load(function () {
    var book = new Array();
    var str
    var f = true
    getDataUser();
    checkMarket();
    getWishlist();

    function getDataUser() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/users",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                if (data.userPhoto == null)
                    $('#img').attr('src', "../assets/else/signature.png");
                else
                    $('#img').attr('src', data.userPhoto);
                $("#loading").removeClass("loading");
                $("#displayName").html(data.name);
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
    }

    function getWishlist() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/wishlists",
            dataType: 'json',
            timeout: 600000,
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                book = data
                f = true;
                addBook(book, str)
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
    }

    function addBook(data, str) {
        $("#wishlist-item").html("")
        if (data.length != 0) {
            f = true;
            if (str == "" || str == undefined) {
                for (let i = 0; i < data.length; i++) {
                    let idBook = data[i].product.productId;
                    var stats = false
                    $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url: "http://127.0.0.1:8080/api/buckets",
                        async: false,
                        dataType: 'json',
                        headers: {
                            'Authorization': `Bearer ` + getCookie("token"),
                        },
                        success: function (data) {
                            data.forEach(function (arr) {
                                if (arr.product.productId == idBook) {
                                    stats = true;
                                    console.log("sama")
                                }
                            });
                        }
                    });
                    var btn
                    if (stats == true) {
                        btn = `<button class="btn-tambah disable t" disabled>Sudah di keranjang</button>`
                    } else {
                        btn = `<button class="btn-tambah t" data-id="` + data[i].product.productId + `">Beli</button>`
                    }

                    var html = `
                <div class="col-3-custom max-min">
                    <div class="content-border shadow-card no-border border-radius-4">
                    <img src="` + data[i].product.productPhoto + `" alt="" class="width-img">
                    <div class="p-2">
                        <p class="title-book" title="` + data[i].product.title + `">` + data[i].product.title + `</p>
                        <p class="author-book" title="` + data[i].product.author + `">` + data[i].product.author + `</p>
                        <p class="price-book">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                        <p class="trash-wishlist" data-id="` + data[i].product.productId + `" id="` + data[i].product.productId + `" onclick="bindDeleteWishlist(this.id)"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                        ` + btn + `
                    </div>
                    </div>
                </div>
                `
                    $("#wishlist-item").append(html);

                }
            } else {
                f = false;
                for (let i = 0; i < data.length; i++) {
                    if (str.toLowerCase() == data[i].product.title.substring(0, str.length).toLowerCase()) {
                        f = true;
                        var stats = false
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "http://127.0.0.1:8080/api/buckets",
                            async: false,
                            dataType: 'json',
                            headers: {
                                'Authorization': `Bearer ` + getCookie("token"),
                            },
                            success: function (data) {
                                data.forEach(function (arr) {
                                    if (arr.product.productId == idBook) {
                                        stats = true;
                                        console.log("sama")
                                    }
                                });
                            }
                        });
                        var btn
                        if (stats == true) {
                            btn = `<button class="btn-tambah disable t" disabled>Sudah di keranjang</button>`
                        } else {
                            btn = `<button class="btn-tambah t" data-id="` + data[i].product.productId + `">Beli</button>`
                        }
                        let idBook = data[i].product.productId;
                        var html = `
                        <div class="col-3-custom max-min">
                            <div class="content-border shadow-card no-border border-radius-4">
                            <img src="` + data[i].product.productPhoto + `" alt="" class="width-img">
                            <div class="p-2">
                                <p class="title-book" title="` + data[i].product.title + `">` + data[i].product.title + `</p>
                                <p class="author-book" title="` + data[i].product.author + `">` + data[i].product.author + `</p>
                                <p class="price-book">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                                <p class="trash-wishlist" data-id="` + data[i].product.productId + `" id="` + data[i].product.productId + `" onclick="bindDeleteWishlist(this.id)"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                                ` + btn + `
                            </div>
                            </div>
                        </div>
                        `
                        $("#wishlist-item").append(html);

                    }

                }
            }
            if (f == false && data.length != 0) {
                $("#wishlist-item").html("<div class='p-3'>Tidak ada buku dengan judul <b>" + str + "</b></div>");
            }
            bindListener();
        } else {
            $("#wishlist-item").removeClass("flex-row")
            $("#wishlist-item").html(`
            <div style="margin-top: 90px; margin-bottom: 100px;">
                <div class="bg-blank-wishlist"></div>
                    <p class="p-1 keranjang bold center">Wishlist Kamu masih kosong.</p>
                <div class="center">
                    <p class="t12">Ayo <a class="alink" href="/user/"><u>belanja</u></a> sekarang!</p>
                </div>
            </div>
            `);
        }
        trahsWish()
    }

    trahsWish()
    trashListen()

    function trashListen() {
        $(".trash-buckets").click(function () {
            addBook(book, str)
        })
    }


    function trahsWish() {
        $(".trash-wishlist").click(function () {
            for (var i = 0; i < book.length; i++) {
                if ($(this).attr("data-id") == book[i].product.productId) {
                    book.splice(i, 1)
                }
            }
        })
    }

    function deleteWishlist(data) {
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/wishlists/delete",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            data: JSON.stringify(data),
            success: function (data) {
                getWishlist()
                refreshBuckets()
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    function refreshBuckets() {
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/buckets/",
            timeout: 600000,
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#keranjang").html("")
                if (data.length != 0) {
                    $("#notif-bucket").html(data.length)
                    $("#notif-bucket").css("display", "inline-block")
                    var tot = 0;
                    for (var i = 0; i < data.length; i++) {
                        var html = `
                            <li class="itm-keranjang">
                                <div class="row">
                                <div class="col-4">
                                    <img src="` + data[i].product.productPhoto + `" alt="" class="width-img-keranjang">
                                </div>
                                <div class="col-8 no-padding">
                                    <h6 class="title-keranjang-header">` + data[i].product.title + `</h6>
                                    <p class="author-header">` + data[i].product.author + `</p>
                                    <p class="sku-header">` + data[i].product.sku + `</p>
                                    <p class="isbn-header">` + data[i].product.isbn + `</p>
                                    <div class="row">
                                        <p class="price-header col-10">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                                        <p class="trash-buckets" data-id="` + data[i].product.productId + `" id="` + data[i].product.productId + `" onclick="bindDeleteData(this.id)"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                                    </div>
                                </div>
                                </div>
                            </li>
                            <hr>
              `
                        $("#keranjang").append(html);
                        tot += data[i].product.price;
                    }

                    var total = `<li>
              <div class="row">
                <div class="col-6">
                  <p>Total (<span class="bold-header">` + data.length + `</span>)</p>
                  <p class="price-header">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</p>    
                </div>
                <div class="col-6">
                  <a href="/user/detail_keranjang.html"><button class="btn-look">Lihat</button></a>
                </div>
              </div>
            </li>`
                    $("#keranjang").append(total)
                } else {
                    $("#keranjang").html(`
                <div class="bg-blank-keranjang"></div>
                <p class="p-1 keranjang bold center">Keranjang Kamu kosong.</p>
                <div class="center">
                  <p class="t12">Waah keranjang kamu kosong nih, ayo isi buat nambah koleksi buku kamu!</p>
                </div>
              `);
                }
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
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
        addBook(book, $('#search').val())
    })

    $('#search').on('input', function () {
        f = true;
        addBook(book, $('#search').val())
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
        addBook(book, $('#search').val())
    })

    function judulAsc(a, b) {
        var nameA = a.product.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.product.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function judulDesc(a, b) {
        var nameA = a.product.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.product.title.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function hargaAsc(a, b) {
        var nameA = a.product.price
        var nameB = b.product.price
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function hargaDesc(a, b) {
        var nameA = a.product.price
        var nameB = b.product.price
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function bindListener() {
        $("button.btn-tambah.t").click(function () {
            var id = $(this).data(id);
            var data2 = {
                "productId": id.id
            }
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/buckets/add/",
                dataType: 'json',
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                data: JSON.stringify(data2),
                success: function (data) {
                    deleteWishlist(data2);
                    $("#modalInfo").click()
                },
                error: function (errMsg) {
                    console.log(errMsg)
                }
            });
        })
    }
});