$(window).load(function () {
  var urlString = window.location.href;
  var urlParams = parseURLParams(urlString);
  var book = new Array()
  var f = false;

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
  if (typeof urlParams == 'undefined')
    urlParams = {
      "kategori": ""
    };

  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/products/category/" + urlParams.kategori.toString(),
    dataType: 'json',
    success: function (data) {
      if (data.length != 0) {
        book = data
        book.sort(judulAsc);
        listBook(book, $('#search').val());
      } else {
        $("#content").html("")
        $("main").addClass("bg-product")
      }

      $(".cat-name").html(urlParams.kategori.toString());
    },
    error: function (errMsg) {
      $("main").addClass("bg-product")
    }
  });

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
    listBook(book, $('#search').val())
  })

  $('#search').on('input', function () {
    listBook(book, $('#search').val())
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
    listBook(book, $('#search').val())
  })

  function listBook(data, str) {
    var html;
    $("#content").html("")
    if (str == "" || str == undefined) {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        html = `
        <div class="mlr-auto-mob">
          <a href="book.html?_i=fbf64352-3c19-4ee3-ab65-3a31cea00512">
            <div class="row no-margin border">
              <div class="img-book">
                <img src="` + data[i].productPhoto + `" alt=""
                  class="width-img">
              </div>
              <div class="width-desc">
                <div class="p-2 width-desc">
                  <div class="">
                    <p class="title-book" title="` + data[i].title + `">` + data[i].title + `</p>
                    <p class="author-book" title="` + data[i].author + `">` + data[i].author + `</p>
                    <p class="price-store" title="Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                  </div>
                  <p class="desk">Deskripsi </p>
                  <p class="truncate-overflow" title="` + data[i].description + `">` + data[i].description + `</p>
                </div>
              </div>
            </div>
          </a>
        </div>
        `;
        $("#content").append(html);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (str.toLowerCase() == data[i].title.substring(0, str.length).toLowerCase()) {
          f = true;
          html = `
              <div class="col-3-custom">
                <a href="book.html?_i=` + data[i].productId + `">
                  <div class="content-border border-book no-border max-min border-radius-4">
                    <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                    <div class="p-2">
                      <p class="title-book" title="` + data[i].title + `">` + data[i].title + `</p>
                      <p class="author-book">` + data[i].author + `</p>
                      <p class="price-store">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                    </div>
                  </div>
                </a>
              </div>
              `;
          $("#content").append(html);
        }
      }
      if (f == false && data.length != 0) {
        $("#content").html("<div class='p-3'>Tidak ada buku dengan judul <b>" + str + "</b></div>");
      }
    }
  }

  function judulAsc(a, b) {
    var nameA = a.title.toUpperCase(); // ignore upper and lowercase
    var nameB = b.title.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  function judulDesc(a, b) {
    var nameA = a.title.toUpperCase(); // ignore upper and lowercase
    var nameB = b.title.toUpperCase(); // ignore upper and lowercase
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  }

  function hargaAsc(a, b) {
    var nameA = a.price
    var nameB = b.price
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  function hargaDesc(a, b) {
    var nameA = a.price
    var nameB = b.price
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  }

  $("#kategori-i").addClass("bottom-active")
  $("#kategori-t").addClass("bottom-active border-active")
});