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
      $("main").addClass("bg-product")
    }
  });

  function listBook(data) {
    var html;
    var html2;
    for (let i = 0; i < data.length; i++) {
      html = `
            <div class="col-3-custom">
              <a href="book.html?_i=`+data[i].productId+`">
                <div class="content-border shadow-card no-border border-radius-4">
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

      html2 = `
      <div class="mb-2">
        <a href="book.html?_i=`+data[i].productId+`">
          <div class="content-border shadow-card no-border border-radius-4">
            <img src="` + data[i].productPhoto + `" alt="" class="width-img">
            <div class="p-2">
              <p class="title-book" title="` + data[i].title + `">` + data[i].title + `</p>
              <p class="author-book">` + data[i].author + `</p>
              <p class="price-store">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
            </div>
          </div>
        </a>
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