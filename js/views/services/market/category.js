import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'
$(window).load(function () {
  var urlString = window.location.href;
  var urlParams = parseURLParams(urlString);
  // console.log(urlParams.kategori.toString())
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

    console.log(urlParams.kategori.toString())
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/products/category/" + urlParams.kategori.toString(),
    dataType: 'json',
    timeout: 600000,
    success: function (data) {
      if (data.length != 0)
        listBook(data);
      else
        $("main").addClass("bg-product")
      $(".cat-name").html(urlParams.kategori.toString());
    },
    error: function (errMsg) {
      console.log(errMsg)
      $("main").addClass("bg-product")
    }
  });

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  })

  function listBook(data) {
    console.log(data)
    var html;
    var html2;
    for (let i = 0; i < data.length; i++) {
      html = `
            <div class="col-3-custom">
              <div class="content-border shadow-card no-border border-radius-4">
                <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                <div class="p-2">
                  <p class="title-book" title="` + data[i].title + `">` + data[i].title + `</p>
                  <p class="author-book">` + data[i].author + `</p>
                  <p class="price-store">Rp. ` + formatter.format(data[i].price).substr(3, data[i].price.length) + `</p>
                  <a href="book.html?sku=`+data[i].sku+`"><button class="btn-detail">Lihat  </button></a>
                </div>
              </div>
            </div>
            `;

      html2 = `
      <div class="mb-2">
                <div class="content-border shadow-card no-border border-radius-4">
                  <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                  <div class="p-2">
                    <p class="title-book" title="` + data[i].title + `">` + data[i].title + `</p>
                    <p class="author-book">Manusia</p>
                    <p class="price-store">` + data[i].author + `</p>
                    <p class="price-store">Rp. ` + formatter.format(data[i].price).substr(3, data[i].price.length) + `</p>
                    <a href="book.html?sku=`+data[i].sku+`"><button class="btn-detail">Lihat  </button></a>
                  </div>
                </div>
              </div>
              `
      $("#content").append(html);
      if (i % 2 == 0) {
        $("#mob1").append(html2);
      } else
        $("#mob2").append(html2);
    }

  }
});