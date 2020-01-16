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
      if (data.length != 0) {
        var table = `
        <table class="table table-hover ">
            <thead>
              <th scope="col" id="no">No Pemesanan</th>
              <th scope="col" id="tanggal">Tanggal</th>
              <th scope="col" id="status">Status</th>
              <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody id="tableBody">

            </tbody>
          </table>
        `;
        dataArray = data
        $("#table").html(table)
        addToTable(dataArray)
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

  function addToTable(data) {
    $("#tableBody").html("")
    for (var i = 0; i < data.length; i++) {

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
  }

  $("#no").click(function () {
    $("#nama").html(`Nama Pemesan`)
    $("#tanggal").html(`Tanggal`)
    $("#status").html(`Status`)

    if ($(this).attr("data-set") == "0") {
      $(this).attr("data-set", "1")
      $(this).html(`No Pemesanan <i class="fas fa-sort-up"></i>`)
      dataArray.sort(noAsc);
      addToTable(dataArray)
    } else {
      $(this).attr("data-set", "0")
      $(this).html(`No Pemesanan <i class="fas fa-sort-down"></i>`)
      dataArray.sort(noDesc);
      addToTable(dataArray)
    }
  })

  $("#tanggal").click(function () {
    $("#no").html(`No Pemesanan`)
    $("#nama").html(`Nama Pemesanan`)
    $("#status").html(`Status`)

    if ($(this).attr("data-set") == "0") {
      $(this).attr("data-set", "1")
      $(this).html(`Tanggal <i class="fas fa-sort-up"></i>`)
      dataArray.sort(tanggalAsc);
      addToTable(dataArray)
    } else {
      $(this).attr("data-set", "0")
      $(this).html(`Tanggal <i class="fas fa-sort-down"></i>`)
      dataArray.sort(tanggalDesc);
      addToTable(dataArray)
    }
  })

  $("#status").click(function () {
    $("#no").html(`No Pemesanan`)
    $("#tanggal").html(`Tanggal`)
    $("#status").html(`Status`)

    if ($(this).attr("data-set") == "0") {
      $(this).attr("data-set", "1")
      $(this).html(`Status <i class="fas fa-sort-up"></i>`)
      dataArray.sort(statusAsc);
      addToTable(dataArray)
    } else {
      $(this).attr("data-set", "0")
      $(this).html(`Status <i class="fas fa-sort-down"></i>`)
      dataArray.sort(statusDesc);
      addToTable(dataArray)
    }
  })

  function noAsc(a, b) {
    var nameA = a.transactionCode.toUpperCase();
    var nameB = b.transactionCode.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  function noDesc(a, b) {
    var nameA = a.transactionCode.toUpperCase();
    var nameB = b.transactionCode.toUpperCase();
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  }

  function tanggalAsc(a, b) {
    var nameA = a.createdAt;
    var nameB = b.createdAt;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  function tanggalDesc(a, b) {
    var nameA = a.createdAt;
    var nameB = b.createdAt;
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  }

  function statusAsc(a, b) {
    var nameA = a.transferConfirm
    var nameB = b.transferConfirm
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  function statusDesc(a, b) {
    var nameA = a.transferConfirm
    var nameB = b.transferConfirm
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  }

  $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Profile</span>`)
  $("#logoBooklook").addClass("h")
  $("#iconback").click(function () {
    window.history.back();
  })
});