import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'


$(document).ready(function () {
  var long = ""
  var short = ""
  var urlString = window.location.href;
  var urlParams = parseURLParams(urlString);
  var productId;

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
    <div class="row col-12 no-padding no-margin" style="height: 40px;">
      <button class="col-6 center btn-buy buy border-right">
        Beli
      </button>
      <button class="col-6 center btn-wishlist wishlist" style="height: 40px;">
        Wishlist
      </button>
    </div>
  </div>
`)

  getBook()
  var transId = new Array();
  getTransaction()
  getBookTransaction()

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
    url: "http://127.0.0.1:8080/api/products/" + urlParams._i.toString(),
    async: false,
    success: function (data) {
      productId = data.product.productId;
      $(".penjual").html(`<a class="market-link" href="/market/market-page.html?id=` + data.marketId + `"><u>` + data.marketName + `</u></a>`);
      $("#sku").html(data.product.sku);
      $("#isbn").html(data.product.isbn);
      $("#price").html("Rp. " + data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''));
      $("#author").html(data.product.author);
      $("#page").html(data.product.pageTotal + " Halaman");

      $("#publisher").html(data.product.publisher);

      if (data.product.description.toString().length > 400) {
        long = data.product.description + `<span class="read-more" id="less-more"> Lebih sedikit</span>`
        short = data.product.description.substring(0, 400) + "..." + `<span class="read-more" id="read-more"> Lebih banyak</span>`
      } else {
        short = data.product.description
      }

      $("#deskripsi").html(short);
      $("#bookimg").attr("src", data.product.productPhoto);
      $("#title").html(data.product.title)
      bindReadMore()
    },
    error: function (errMsg) {
      console.log(errMsg)
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

  $(".buy").click(function () {
    var data = {
      "productId": productId
    }
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/buckets/add/",
      dataType: 'json',
      async: false,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      data: JSON.stringify(data),
      success: function (data) {
        getBuckets()
        $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
        $("#modalMsgEdit").html(`Item berhasil ditambahkan`)
        $("#ok").html(`<button class="modal-btn-ok">Oke</button>`)
        $("#modalInfo").click()
      },
      error: function (errMsg) {
        if (errMsg.status == "403" || errMsg.status == "401") {
          $("#icon").html(`<img class="mb-4"src="../assets/else/not-login.png" alt="" width="100px">`)
          $("#modalMsgEdit").html("Untuk menambahkan item ini, kamu harus login dulu nih.")
          $("#btn-login").html("<a href='/login.html'><button class='mt-3 btn-buy'>Login</button></a>")
          $("#modalInfo").click()
        } else if (errMsg.status == "400") {
          $("#icon").html(`<i class="fas fa-times-circle f14 mb-2 mt-2" style="color: #ff3729; margin-botton: 20px;"></i>`)
          $("#modalMsgEdit").html("Tidak bisa membeli buku dari toko sendiri !")
          $("#btn-login").html(`<button class="modal-btn-ok"  data-dismiss="modal">Oke</button>`)
          $("#modalInfo").click()
        }

      }
    });
  })

  $(".wishlist").click(function () {
    var data = {
      "productId": productId
    }

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/wishlists/add/",
      dataType: 'json',
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      data: JSON.stringify(data),
      success: function (data) {
        getWishlist()
        $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
        $("#modalMsgEdit").html(`Item berhasil ditambahkan`)
        $("#ok").html(`<button class="modal-btn-ok">Oke</button>`)
        $("#modalInfo").click()
      },
      error: function (errMsg) {
        if (errMsg.status == "400") {
          $("#icon").html(`<i class="fas fa-times-circle f14 mb-2 mt-2" style="color: #ff3729; margin-botton: 20px;"></i>`)
          $("#modalMsgEdit").html("Tidak bisa menambah buku ke wishlist dari toko sendiri !")
          $("#btn-login").html(`<button class="modal-btn-ok"  data-dismiss="modal">Oke</button>`)
          $("#modalInfo").click()
        } else if (errMsg.responseJSON.status) {
          $("#icon").html(`<img class="mb-4"src="../assets/else/not-login.png" alt="" width="100px">`)
          $("#modalMsgEdit").html("Untuk menambahkan item ini, kamu harus login dulu nih.")
          $("#btn-login").html("<a href='/login.html'><button class='mt-3 btn-buy'>Login</button></a>")
          $("#modalInfo").click()
        }
      }
    });
  })

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
        $("#keranjang").html("")
        if (data.length != 0) {
          $("#notif-keranjang").html(data.length)
          $("#notif-keranjang").css("display", "inline-block")
          $("#notif-bucket").html(data.length)
          $("#notif-bucket").css("display", "inline-block")
          var tot = 0;
          for (var i = 0; i < data.length; i++) {
            if (data[i].product.productId == productId) {
              $(".buy").removeClass("btn-buy")
              $(".buy").addClass("btn-already")
              $(".buy").html("Sudah dikeranjang")
              $(".buy").attr("disabled", true)
            }
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
                  <p class="price-header">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>    
                </div>
                <div class="col-6">
                  <a href="/user/detail_keranjang.html"><button class="btn-look">Lihat</button></a>
                </div>
              </div>
            </li>`
          $("#keranjang").append(total)
        } else {
          $("#notif-bucket").html("")
          $("#notif-bucket").css("display", "none")
          $("#notif-keranjang").html("")
          $("#notif-keranjang").css("display", "none")
          $("#keranjang").html(`
                <div class="bg-blank-keranjang"></div>
                <p class="p-1 keranjang bold center">Keranjang Anda kosong.</p>
                <div class="center">
                  <p class="t12">Waah keranjang kamu kosong nih, ayo isi buat nambah koleksi buku kamu!</p>
                </div>
              `);
        }
      }
    });
  }
  getBuckets()
  getWishlist()

  function getWishlist() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/wishlists",
      dataType: 'json',
      async: false,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        $(".wishlist-item").html("")
        if (data.length != 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].product.productId == productId) {
              $(".wishlist").removeClass("btn-wishlist")
              $(".wishlist").addClass("btn-already")
              $(".wishlist").html("Sudah diwishlist")
              $(".wishlist").attr("disabled", true)
            }
          }
        }
      }
    });
  }

  function getBook() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/libraries",
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        if (data.length != 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].product.productId == urlParams._i.toString()) {
              $(".buy").removeClass("btn-buy")
              $(".buy").addClass("btn-already")
              $(".buy").html("Sudah dibeli")
              $(".buy").attr("disabled", true)
              $(".wishlist").removeClass("btn-wishlist")
              $(".wishlist").addClass("btn-already")
              $(".wishlist").attr("disabled", true)
              $(".wishlist").html("Sudah dibeli")
            }
          }
        }
      }
    });
  }

  function getTransaction() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/transactions/user/show",
      dataType: 'json',
      async: false,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {
        for (var i = 0; i < data.length; i++)
          transId.push(data[i].transactionId)
      }
    });
  }

  function getBookTransaction() {
    for (var i = 0; i < transId.length; i++) {
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/user/show/" + transId[i],
        dataType: 'json',
        headers: {
          'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
          for (var i = 0; i < data.transactionDetail.length; i++) {
            if (data.transactionDetail[i].product.productId == urlParams._i) {
              $(".buy").removeClass("btn-buy")
              $(".buy").addClass("btn-already")
              if (data.transactionDetail[i].marketConfirm == "CONFIRMED")
                $(".buy").html("Sudah dibeli")
              else
                $(".buy").html("Sedang diproses")
              $(".buy").attr("disabled", true)
            }
          }
        }
      });
    }
  }

  $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold"></span>`)
  $("#logoBooklook").addClass("h")
  $("#iconback").click(function () {
    window.history.back();
  })

});