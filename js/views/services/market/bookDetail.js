import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {
    getDataUser()

    $("#footers").html(`
  <div class="main-footer widgets-dark typo-light h">
  <div class="container">
    <div class="row">

      <div class="col-md-4 mb-5">
        <div class="bold f12 mb-2">BANTUAN</div>
        <p class="f12" id="footer-masuk"><a href="/kebijakan-privasi.html" class="bold alink">Kebijakan &amp;
            privasi</a></p>
        <p class="f12" id="footer-daftar"><a href="/syarat-dan-ketentuan.html" class="bold alink">Syarat &amp;
            ketentuan</a></p>
      </div>
      <div class="col-md-4 mb-5">
        <div class="bold f12 mb-2">CUSTOMER CARE</div>
        <p class="f12"><i class="fas fa-phone abu"></i> 082123456789</p>
        <p class="f12"><i class="fas fa-envelope abu"></i> customer.care@booklook.com</p>
      </div>
      <div class="col-md-4">
        <div class="bold f12 mb-2">TENTANG</div>
        <p class="f12"><a class="alink" href="/user/">BookLook</a> - Situs Jual Beli Online di Indonesia BookLook
          merupakan situs jual beli online di Indonesia yang memiliki ratusan buku digital. Baca buku online terasa
          semakin mudah dan menyenangkan saat ini karena apapun yang Anda ingin baca pasti bisa ditemukan di
          BookLook.<a href="/tentang.html" class="alink"> Lebih lanjut<span></span></a></p>
      </div>
    </div>
  </div>
</div>
<div class="copyright">
  <div class="col-9 mlr-auto">
    Copyright ©2019 BookLook toko buku online terlengkap. All right reserved
  </div>
</div>

  <div class="bottom-navigation fixed hide2">
    <div class="row col-12 no-padding no-margin">
      <div class="col-6 center mt-2 btn-read">
      Lihat
      </div>
      <a class="editlink col-6 btn-edit center mt-2">
        Edit
      </a>
    </div>
  </div>
`)

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
                <p class="judul-utama mt-2 pb-2 col-12 border-bottom" title="` + data.product.title + `">` + data.product.title + `</p>

            <div class="col-3-custom">
              <div class="content-border shadow-card no-border border-radius-4 max-min">
                <img src="` + data.product.productPhoto + `" alt=""
                  class="width-img ">
              </div>
            </div>
            <div class="col-9-custom mt-4">

              <div class="row no-margin list-i background-gray p-3">
                <p class="title-book col-5">Penulis Buku</p>
                <p class="title-book author-clr col-7" title="` + data.product.author + `">` + data.product.author + `</p>
              </div>
              <div class="row no-margin list-i p-3">
                <p class="title-book col-5">Penerbit Buku</p>
                <p class="title-book col-7" title="` + data.product.publisher + `">` + data.product.publisher + `</p>
              </div>
              <div class="row no-margin list-i background-gray p-3">
                <p class="title-book col-5">ISBN Buku</p>
                <p class="title-book col-7" title="` + data.product.isbn + `">` + data.product.isbn + `</p>
              </div>
              <div class="row no-margin list-i p-3">
                <p class="title-book col-5">SKU Buku</p>
                <p class="title-book col-7" title="` + data.product.sku + `">` + data.product.sku + `</p>
              </div>
              <div class="row no-margin list-i background-gray p-3">
                <p class="title-book col-5">Total Halaman</p>
                <p class="title-book col-7" title="` + data.product.pageTotal + ` Halaman">` + data.product.pageTotal + ` Halaman</p>
              </div>
              <div class="row no-margin list-i p-3">
                <p class="title-book col-5">Harga</p>
                <p class="title-book blue-3 col-7" title="Rp. ` + data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `">Rp. ` + data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
              </div>
              <p class="deskripsi mt-2 pl-1 ml-3">Deskripsi</p>
              <p class="mb-4 desk ml-3 pl-1" id="deskripsi">` + short + `</p>

            </div>
                `
                $("#bookContent").html(html)
                $(".editlink").attr("href", "/market/edit_buku.html?_i=" + data.product.productId)
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

    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Toko</span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.location.href = "/market/mybook_store.html"
    })
});