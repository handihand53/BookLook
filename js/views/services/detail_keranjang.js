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
                console.log(data)
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
                    <div id="main-keranjang">
                    </div>
                </div>
                `
                    $("#main-content").append(head);
                    var tot = 0;
                    for (var i = 0; i < data.length; i++) {
                        
                        var html = `
                        <div class="bg-white-custom">
                    <div class="content-border p-2 shadow-card no-border mb-3">
                    
                            <label class="container-checkbox center">
                                <input type="checkbox" class="check" style="position:absolute">
                                <span style="margin-top: -4px;" class="checkmark"></span>
                            </label>
                            <span class="market-text">`+ data[i].marketName+`</span>
                            <hr>
                                <li class="itm-keranjang mb-3">
                                    <div class="row">
                                        <div class="col-4 align-item-center" style="padding-right: 0;">
                                            <img src="` + data[i].product.productPhoto + `" alt="" class="width-img">
                                        </div>
                                        <div class="col-8">
                                            <h6 class="title-detail-keranjang" title="` + data[i].product.title + `">` + data[i].product.title + `</h6>
                                            <p class="author-keranjang">` + data[i].product.author + `</p>
                                            <p class="author-keranjang">` + data[i].product.sku + `</p>
                                            <p class="author-keranjang">` + data[i].product.isbn + `</p>
                                            <p class="price-keranjang">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</p>
                                            <p class="trash-keranjang" data-id="` + data[i].product.productId + `" style="float: right; margin-right: 20px;"><i class="fa fa-trash delete-icon" aria-hidden="true"></i></p>
                                        </div>
                                    </div>
                                </li>
                                </div>
                            </div>
                            `
                        tot += data[i].product.price;
                        $("#main-keranjang").append(html)
                    }
                    var total = `
        <div class="col-md-6">
            <div class="content-border p-2 shadow-card detail-keranjang">
                <div class="b-bot">
                    <p>Rincian</p>
                </div>
                <div>
                    <div class="row mt-3">
                        <div class="col-6 price-pembelian">Total Pembelian </div>
                        <div class="col-6 center price-pembelian">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</div>
                    </div>
                    <hr>
                    <div class="row mb-3">
                        <div class="col-6">Total Pembayaran </div>
                        <div class="col-6 center price-keranjang">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</div>
                    </div>
                </div>
                
            </div>

            <div class="content-border p-2 shadow-card detail-keranjang2">
                <button class="pay">Bayar Sekarang</button>
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
                    <img src="` + data[i].product.productPhoto + `" alt="" class="width-img-keranjang">
                  </div>
                  <div class="col-8 no-padding">
                      <h6 class="title-keranjang-header">` + data[i].product.title + `</h6>
                      <p class="author-header">` + data[i].product.author + `</p>
                      <p class="sku-header">` + data[i].product.sku + `</p>
                      <p class="isbn-header">` + data[i].product.isbn + `</p>
                      <div class="row">
                        <p class="price-header col-10">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + `</p>
                        <p style="col-2 trash-bucket" data-id="` + data[i].product.productId + `"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
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