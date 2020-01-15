import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';


$(window).load(function () {
  getDataUser();
  checkMarket();

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
        if (data.userPhoto == null)
          $('#img').attr('src', "../assets/else/signature.png");
        else
          $('#img').attr('src', data.userPhoto);
        $("#loading").removeClass("loading");
        $("#nama-pengguna").val(data.username)
        $("#displayName").html(data.name);
        $("#nama-lengkap").val(data.name);
        $("#email-prof").val(data.email)
        $("#nomor-prof").val(data.numberPhone)
      },
      error: function (errMsg) {
        window.location.replace("/404.html")
      }
    });
  }

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
  var x;
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/transactions/user/show/" + urlParams._i,
    dataType: 'json',
    headers: {
      'Authorization': `Bearer ` + getCookie("token"),
    },
    success: function (data) {
      var d = new Date(data.transaction.createdAt);
      var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
      $("#noDetailTransaksi").html(data.transaction.transactionCode)
      $("#tglTransaksi").html(tgl)
      $("#statusPembayaran").html(data.transaction.transferConfirm)
      var color
      if (data.transaction.transferConfirm == "SUCCESS") color = "pembayaran-success";
      else color = "pembayaran-unsuccess"
      $("#statusPembayaran").addClass(color)
      $("#totalTransaksi").html(data.transaction.checkout.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
      console.log(data)
      for (var i = 0; i < data.transactionDetail.length; i++) {
        var nama

        $.ajax({
          type: "GET",
          contentType: "application/json",
          url: "http://127.0.0.1:8080/api/markets/" + data.transactionDetail[i].marketId,
          async: false,
          dataType: 'json',
          success: function (data) {
            x = data.marketName
          },
          error: function (errMsg) {}
        });
        var stats

        if (data.transactionDetail[i].marketConfirm == "CONFIRMED") {
          stats = `<i class="fas fa-check" style="color: green;"></i>`
        } else {
          stats = `<i class="fas fa-times" style="color: red;"></i>`
        }

        var html = `
        <div class="shadow-card p-3 mb-4">
              <div class="bold border-bottom"><span>` + stats + `</span> Toko : <a href="/market/market-page.html?id=` + data.transactionDetail[i].marketId + `"
                  class="alink"> ` + x + `</a></div>
              <div class="row">
                <div class="col-3-custom">
                  <div class="content-border no-border border-radius-4">
                    <img src="` + data.transactionDetail[i].product.productPhoto + `" alt=""
                      class="width-img">
                  </div>
                </div>

                <div class="col-9-custom mt-3">
                  <div class="row border-bottom-gray">
                    <p class="col-6 list-i">Judul</p>
                    <p class="list-i col-6" title="` + data.transactionDetail[i].product.title + `"> ` + data.transactionDetail[i].product.title + `</p>
                  </div>
                  <div class="row border-bottom-gray background-gray">
                    <p class="col-6 list-i">Penulis Buku</p>
                    <p class="list-i col-6 orange" title="` + data.transactionDetail[i].product.author + `">` + data.transactionDetail[i].product.author + `</p>
                  </div>
                  <div class="row border-bottom-gray">
                    <p class="col-6 list-i">Penerbit</p>
                    <p class="list-i col-6" title="` + data.transactionDetail[i].product.publisher + `">` + data.transactionDetail[i].product.author + `</p>
                  </div>
                  <div class="row border-bottom-gray background-gray">
                    <p class="col-6 list-i">ISBN</p>
                    <p class="list-i col-6" title="` + data.transactionDetail[i].product.isbn + `">` + data.transactionDetail[i].product.isbn + `</p>
                  </div>
                  <div class="row border-bottom-gray">
                    <p class="col-6 list-i">SKU</p>
                    <p class="list-i col-6" title="` + data.transactionDetail[i].product.sku + `">` + data.transactionDetail[i].product.sku + `</p>
                  </div>
                  <div class="row border-bottom-gray background-gray">
                    <p class="col-6 list-i">Jumlah halaman</p>
                    <p class="list-i col-6" title="` + data.transactionDetail[i].product.pageTotal + ` Halaman">` + data.transactionDetail[i].product.pageTotal + ` Halaman</p>
                  </div>
                  <div class="row border-bottom-gray">
                    <p class="col-6 list-i">Harga</p>
                    <p class="list-i col-6 blue-2" title="Rp. ` + data.transactionDetail[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g,
          '$&,').replace(/\.00/g, '') + `">Rp.
                      <span>` + data.transactionDetail[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g,
          '$&,').replace(/\.00/g, '') + `</span></p>
                  </div>
                </div>
              </div>
            </div>`
        $("#bookContent").append(html)
      }
      if (data.transaction.transferConfirm != "SUCCESS") {
        let btnPay = `
        <a href="/market/pay.html?i=` + data.transaction.transactionCode + `"><button id="pay" class="float-right btn-pay">Bayar</button></a>
        `
        $("#bookContent").append(btnPay)
      }

      if (data.transaction.transferConfirm == "PENDING") {
        $("#pay").css("cursor", "not-allowed")
        $("#pay").addClass("disable")
        $("#pay").attr("disabled", true)
        $("#pay").html("Sudah Dibayar")
      }
    },
    error: function (errMsg) {
      window.location.replace("/404.html")
    }
  });

  $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Profile</span>`)
  $("#logoBooklook").addClass("h")
  $("#iconback").click(function () {
    window.location.href = "/user/transaksi.html"
  })

});