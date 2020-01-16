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
                    $(".notif-keranjang").html(data.length)
                    $(".notif-keranjang").css("display", "block")
                    $(".notif-bucket").html(data.length)
                    $(".notif-bucket").css("display", "block")
                    var headUtama = `
                    <div class="col-md-6-custom" id="book-confirm">
                    </div>`
                    $("#kontent").append(headUtama)

                    var head = `
                    <div class="content-border p-3 shadow-card no-border">
                        <label class="container-checkbox" style="margin-top: auto; margin-bottom: auto;">
                            <input type="checkbox" id="main-checkbox">
                            <span class="checkmark checkmark-head" ></span>
                        </label>
                        <span class="ml-3">Pilih Semua Buku</span>
                    </div>

                    <div id="main-content">
                    </div>
                    `

                    $("#book-confirm").append(head)
                    var tot = 0;
                    for (var i = 0; i < data.length; i++) {
                        // var cat = ""
                        // for (var j = 0; j < data[i].product.categories.length; j++) {
                        //     if (j == 0)
                        //         cat = data[i].product.categories[i].categoryName
                        //     else {
                        //         cat += ", " + data[i].product.categories[i].categoryName
                        //     }
                        // }

                        var html = `
                        <div class="content-border shadow-card no-border border-radius-4 mb-4">
                            <div class="judul-utama pl-2 pt-2 pb-2">
                                <label class="container-checkbox center">
                                    <input data-price="` + data[i].product.price + `" data-id="` + data[i].product.productId + `"
                                        type="checkbox" class="check" style="position:absolute">
                                    <span class="checkmark top-2"></span>
                                </label>
                                <span class="bold market-text" title="` + data[i].product.title + `">` + data[i].product.title + `</span>
                                <span><i data-id="` + data[i].product.productId + `" class="fa fa-trash float-right mt-1 fs-trash" aria-hidden="true"></i></span>
                            </div>
                            <hr>
                            <div class="row" style="margin: 0px!important; padding: 10px;">
                                <div class="col-md-4">
                                    <img src="` + data[i].product.productPhoto + `"
                                        alt="" class="width-img">
                                </div>
                                <div class="col-md-8 no-padding mobile p-2" style="margin: 0px!important;">

                                    <div class="row border-bot bg-gray no-margins">
                                        <div class="col-6 sub-list ">
                                            Author
                                        </div>
                                        <div class="col-6 orange sub-list ">
                                        ` + data[i].product.author + `
                                        </div>
                                    </div>

                                    <div class="row border-bot no-margins">
                                        <div class="col-6 sub-list ">
                                            Penerbit
                                        </div>
                                        <div class="col-6 sub-list ">
                                        ` + data[i].product.publisher + `
                                        </div>
                                    </div>

                                    <div class="row border-bot bg-gray no-margins">
                                        <div class="col-6 sub-list ">
                                            ISBN
                                        </div>
                                        <div class="col-6 sub-list ">
                                        ` + data[i].product.isbn + `
                                        </div>
                                    </div>

                                    <div class="row border-bot no-margins">
                                        <div class="col-6 sub-list ">
                                            SKU
                                        </div>
                                        <div class="col-6 sub-list ">
                                        ` + data[i].product.sku + `
                                        </div>
                                    </div>

                                    <div class="row border-bot bg-gray no-margins">
                                        <div class="col-6 sub-list ">
                                            Jumlah Halaman
                                        </div>
                                        <div class="col-6 sub-list ">
                                        ` + data[i].product.pageTotal + ` Halaman
                                        </div>
                                    </div>

                                    <div class="row border-bot no-margins">
                                        <div class="col-6 sub-list">
                                            Harga
                                        </div>
                                        <div class="col-6 sub-list blue-2">
                                            Rp ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `
                                        </div>
                                    </div>

                                    <div class="row border-bot bg-gray  no-margins">
                                        <div class="col-6 sub-list">
                                            Toko Penjual
                                        </div>

                                        <div class="col-6 sub-list blue-2">
                                            <a href="/market/market-page.html?id=` + data[i].marketId + `">
                                                <div class="blue link">` + data[i].marketName + `</div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                        $("#main-content").append(html)
                        tot += data[i].product.price;
                        deletewish()
                    }

                    var hitungan = `
                    <div class="col-md-3-custom">
                    <!-- rincian -->
                    <div class="content-border shadow-card no-border border-radius-4 p-2 fit-height">
                        <div class="judul-utama">Rincian</div>
                        <hr>
                        <div class="row pr-2 pl-2 mb-2">
                            <div class="col-6 sub-list no-margin">
                                Total Belanja
                            </div>
                            <div class="col-6 sub-list blue-content right no-margin">
                                Rp. <span class="totPrice"></span>
                            </div>
                        </div>
                        <div class="row pr-2 pl-2">
                            <div class="col-6 sub-list no-margin">
                                Potongan Voucher
                            </div>
                            <div class="col-6 sub-list blue-content right no-margin">
                                -
                            </div>
                        </div>
                        <hr>
                        <div class="row pr-2 pl-2">
                            <div class="col-6 sub-list no-margin">
                                Total Pembayaran
                            </div>
                            <div class="col-6 sub-list blue-content right no-margin">
                                Rp. <span class="totPrice"></span>
                            </div>
                        </div>
                    </div>
                    <div class="content-border shadow-card no-border border-radius-4  p-2 fit-height mt-3">
                        <div class="row pr-2 pl-2">
                            <div class="col-6 sub-list no-margin">
                                Jumlah
                            </div>
                            <div class="col-6 sub-list blue-content right no-margin">
                                Rp. <span class="totPrice"></span>
                            </div>
                        </div>
                        <button class="pay" id="pay">Bayar</button>
                    </div>
                    <!--  -->
                </div>
                    `
                    $("#kontent").append(hitungan)

                    bindListener();
                } else {
                    $(".notif-keranjang").html(data.length)
                    $(".notif-keranjang").css("display", "none")
                    $(".notif-bucket").html(data.length)
                    $(".notif-bucket").css("display", "none")
                    $("#kontent").html("")
                    var html = `
                    <div id="main-content" class="mlr-auto col-12"></div>
                    `
                    $("#kontent").html(html)
                    $("#main-content").html(`
                        <div class="bg-blank"></div>
                        <div class="center bold">Keranjang Kamu kosong.</div>
                        <div class="mb-4 center">Waah keranjang kamu kosong nih, ayo <a class="alink" href="/user/"><u>isi</u></a> buat nambah koleksi buku kamu!</div>
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

    var total = 0;
    var tot = 0;

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
                        <p style="col-2 trash-bucket" data-id="` + data[i].product.productId + `" data-price="` + data[i].product.price + `"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
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
                  <p class="price-header">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>    
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

    $("#main-checkbox").change(function () {
        total = 0;
        $(".check").each(function () {
            let status = $(this).prop("checked");
            if (status) {
                total += $(this).data("price")
            }
        })
        $(".totPrice").html(total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
    });

    var jml = 0;
    $(".check").change(function () {
        jml = 0;
        total = 0;
        $(".check").each(function () {
            let status = $(this).prop("checked");
            if (status) {
                jml++;
                total += $(this).data("price")
            }
        })

        if (jml != $(".check").length) {
            $("#main-checkbox").prop("checked", false)
        } else {
            $("#main-checkbox").prop("checked", true)
        }
        $(".totPrice").html(total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
    })

    var data_book = {
        products: []
    }


    function deletewish() {
        $(".fs-trash").click(function () {
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

    $("#pay").click(function () {
        data_book = {
            products: []
        }

        $(".check").each(function () {
            let status = $(this).prop("checked");
            if (status) {
                data_book.products.push($(this).data("id"))
            }
        })
        if (data_book.products.length == 0) {
            $("#modalBayar").click()
            return
        }
        localStorage.setItem('dataBook', JSON.stringify(data_book));
        location.href = "/market/confirmation-page.html";
    })

    $("#main-checkbox").prop("checked", true)
    var totalHarga=0
    $(".check").each(function () {
        totalHarga += parseInt($(this).attr("data-price"))
        $(this).prop("checked", true);
    })
    $(".totPrice").html(totalHarga.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
    $("#keranjang-i").addClass("bottom-active")
    $("#keranjang-t").addClass("bottom-active border-active")

});