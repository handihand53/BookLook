import {
    setCookie,
    getCookie,
    checkCookie
} from '../../cookies.js'

$(window).load(function () {

    getDataUser();

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
                $("#loading").removeClass("loading");
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
    }


    getBuckets()

    function getBuckets() {
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/buckets/",
            timeout: 600000,
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                if (data.length != 0) {
                    var head = `
                <div class="col-md-6">
                <div class="bg-white-custom">
                    <div class="content-border p-3 shadow-card no-border">
                        <label class="container-checkbox" style="margin-top: auto; margin-bottom: auto;">
                            <input type="checkbox" id="main-checkbox">
                            <span class="checkmark" style="top: 20px;"></span>
                        </label>
                        <span class="ml-3">Pilih Semua Buku</span>
                    </div>
                </div>
                <div class="bg-white-custom">
                    <div class="content-border p-2 shadow-card no-border">
                        <span class="float-left ml-3 content-title">Keranjang anda</span>
                        <br><br>
                        <div>
                            <ul class="ul-keranjang" id="main-keranjang">
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>`
                    $("#main-content").append(head);
                    var tot = 0;
                    for (var i = 0; i < data.length; i++) {
                        var html = `
                                <li class="itm-keranjang">
                                    <div class="row">
                                        <div class="col-4 align-item-center" style="padding-right: 0;">
                                            <label class="container-checkbox center">
                                                <input type="checkbox" class="check">
                                                <span class="checkmark"></span>
                                            </label>
                                            <img src="` + data[i].productPhoto + `" alt="" class="width-img"
                                                style="margin-left: 20px;">
                                        </div>
                                        <div class="col-8">
                                            <h6 class="title-detail-keranjang">` + data[i].title + `</h6>
                                            <p class="author-keranjang">` + data[i].author + `</p>
                                            <p class="author-keranjang">` + data[i].sku + `</p>
                                            <p class="author-keranjang">` + data[i].isbn + `</p>
                                            <p class="price-keranjang">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</p>
                                            <p class="trash-keranjang" s="Sa" data-id="` + data[i].productId + `" style="float: right; margin-right: 20px;"><i class="fa fa-trash delete-icon" aria-hidden="true"></i></p>
                                        </div>
                                    </div>
                                </li>
                                <hr>
                            `
                        tot += data[i].price;
                        $("#main-keranjang").append(html)
                    }
                    var total = `<div class="col-md-6">
            <div class="content-border p-2 shadow-card detail-keranjang">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p>Total Belanja (<b>` + data.length + `</b>)</p>
                        <p class="price-keranjang">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</p>
                    </div>
                    <div>
                        <a href="/market/confirmation-page.html"><button class="btn-buy">Bayar</button></a>
                    </div>
                </div>
            </div>
        </div>`;
                    $("#main-content").append(total);
                    bindListener();
                } else {
                    $("#main-content").html(`
                    <div class="bg-blank"></div>
                    `);
                }
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    $("#main-checkbox").click(function () {
        $(".check").each(function () {
            let status = $("#main-checkbox").prop("checked");
            if (status)
                $(this).prop("checked", true);
            else
                $(this).prop("checked", false);
        })
    })

    function bindListener() {
        $(".trash-keranjang").on("click", function () {
            var id = $(this).data(id);
            var data = {
                "productId": id.id
            }

            $.ajax({
                type: "DELETE",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/buckets/delete",
                data: JSON.stringify(data),
                dataType: 'json',
                cache: false,
                timeout: 600000,
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                success: function (msg) {
                    $("#main-content").html("")
                    getBuckets()
                    refreshBuckets()
                },
                error: function (errMsg) {
                    console.log(errMsg)
                }
            });
        })
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
                    <img src="` + data[i].productPhoto + `" alt="" class="width-img-keranjang">
                  </div>
                  <div class="col-8 no-padding">
                      <h6 class="title-keranjang-header">` + data[i].title + `</h6>
                      <p class="author-header">` + data[i].author + `</p>
                      <p class="sku-header">` + data[i].sku + `</p>
                      <p class="isbn-header">` + data[i].isbn + `</p>
                      <div class="row">
                        <p class="price-header col-10">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</p>
                        <p style="col-2 trash-bucket" data-id="` + data[i].productId + `"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                      </div>
                  </div>
                </div>
              </li>
              <hr>
              `
                        $("#keranjang").append(html);
                        tot += data[i].price;
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
                <p class="p-1 keranjang bold center">Keranjang Anda kosong.</p>
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