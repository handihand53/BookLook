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
  var dataArray = new Array();

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
      console.log(data)
      if (data.length != 0) {
        var table = `
        <table class="table table-hover ">
            <thead>
              <th scope="col">No Pemesanan</th>
              <th scope="col">Tanggal Transaksi</th>
              <th scope="col">Status Pembayaran</th>
              <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody id="tableBody">

            </tbody>
          </table>
        `;
        $("#table").html(table)
        for (var i = data.length - 1; i >= 0; i--) {

          var d = new Date(data[i].createdAt);
          var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
          var color
          if (data[i].transferConfirm == "SUCCESS") {
            color = "pembayaran-success";
          } else color = "pembayaran-unsuccess"
          var html = `
            <tr>
              <td class="no-pemesanan" title="` + data[i].transactionCode + `">` + data[i].transactionCode + `</td>
              <td class="tgl-pemesanan" title="` + tgl + `">` + tgl + `</td>
              <td class="` + color + `" title="` + data[i].transferConfirm + `">` + data[i].transferConfirm + `</td>
              <td><a href="detail_transaksi.html?_i=` + data[i].transactionCode + `" title="" class="detail-pemesanan">Lihat Detail</a></td>
            </tr>
            `
          $("#tableBody").append(html)
        }
      } else {
        var html = `
          <div class="bg-products"></div>
          <div class="center book">Belum Ada Transaksi.</div>
          <div class="center book-12">ayo <a href="/user/"><span class="link">belanja</span></a> biar list transaksimu ada lagi.</div>
        `
        $("#table").append(html)
      }

    },
    error: function (errMsg) {
      //   window.location.replace("/404.html")
    }
  });

});