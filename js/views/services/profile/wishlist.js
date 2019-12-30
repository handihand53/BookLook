import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';

$(window).load(function () {

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
    getBook()

    function getBook() {

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
                $("#wishlist-item").html("")
                if (data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        let idBook=data[i].product.productId;
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "http://127.0.0.1:8080/api/libraries",
                            dataType: 'json',
                            async: false,
                            headers: {
                                'Authorization': `Bearer ` + getCookie("token"),
                            },
                            success: function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].product.productId == idBook)
                                        deleteWish(idBook)
                                }
                                console.log("a")
                            }
                        });
                        var html = `
                    <div class="col-3-custom max-min">
                        <div class="content-border shadow-card no-border border-radius-4">
                        <img src="` + data[i].product.productPhoto + `" alt="" class="width-img">
                        <div class="p-2">
                            <p class="title-book" title="` + data[i].product.title + `">` + data[i].product.title + `</p>
                            <p class="author-book" title="` + data[i].product.author + `">` + data[i].product.author + `</p>
                            <p class="price-book">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                            <p class="trash-wishlist" data-id="` + data[i].product.productId + `" id="` + data[i].product.productId + `" onclick="bindDeleteWishlist(this.id)"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                            <button class="btn-tambah t" data-id="` + data[i].product.productId + `">Beli</button>
                        </div>
                        </div>
                    </div>
                    `
                        $("#wishlist-item").append(html);
                        bindListener();
                    }

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
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
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

    function deleteWish(id){
        var id = {
            "productId": id
          } 
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/wishlists/delete",
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            data: JSON.stringify(id),
            success: function (data) {
                console.log("sukses")
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
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
});