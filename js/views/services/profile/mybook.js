import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';


$(window).load(function () {
  var book = new Array();
  var str
  var f = false
  getDataUser();
  checkMarket();
  getBook();
  var id;
  var readKey;

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
        book = data
        f = false;
        addBook(book, str)
      },
      error: function (errMsg) {
        console.log(errMsg)
      }
    });
  }

  function addBook(data, str) {
    $("#contentBook").html("")
    if (data.length != 0) {
      f = true;
      if (str == "" || str == undefined) {
        for (var i = 0; i < data.length; i++) {
          var pro = data[i].product;
          var res = pro.productFile.split("/");
          var html = `
            <div class="col-3-custom max-min">
            <a data-id="` + id + `" data-file="` + res[res.length - 1] + `" target="#" class="rb">
                <div class="content-border no-border border-radius-4 border-book">
                <img src="` + pro.productPhoto + `" alt="" class="width-img">
                <div class="p-2">
                    <p class="title-book" title="+` + pro.title + `+">` + pro.title + `</p>
                    <p class="author-book">` + pro.author + `</p>
                </div>
                </div>
            </a>
            </div>
            `

          $("#contentBook").append(html)
        }
      } else {
        f = false;
        for (var i = 0; i < data.length; i++) {
          if (str.toLowerCase() == data[i].product.title.substring(0, str.length).toLowerCase()) {
            var pro = data[i].product;
            var res = pro.productFile.split("/");
            var html = `
            <div class="col-3-custom max-min">
            <a data-id="` + id + `" data-file="` + res[res.length - 1] + `" target="#" class="rb">
                <div class="content-border no-border border-radius-4 border-book">
                <img src="` + pro.productPhoto + `" alt="" class="width-img">
                <div class="p-2">
                    <p class="title-book" title="+` + pro.title + `+">` + pro.title + `</p>
                    <p class="author-book">` + pro.author + `</p>
                </div>
                </div>
            </a>
            </div>
            `

            $("#contentBook").append(html)
          }
        }
      }
      if (f == false && data.length != 0) {
        $("#contentBook").html("<div class='p-3'>Tidak ada buku dengan judul <b>" + str + "</b></div>");
      }
      klik()
    } else {
      $("#contentBook").removeClass("flex-row")
      var html = `
      <div class="bg-products"></div>
      <div class="center book">Buku Kamu Kosong.</div>
      <div class="center book-12">ayo <a href="/user/"><span class="link">belanja</span></a> biar bisa nambah ilmu lagi.</div>
      `
      $("#contentBook").append(html)
    }

  }

  function klik() {
    $(".rb").click(function () {
      getDataUser()
      $(this).attr("data-key", readKey)
      window.open("/user/readbook.html?file=" + $(this).attr("data-file") + "&id=" + $(this).attr("data-id") + "&key=" + readKey)
    })
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
});