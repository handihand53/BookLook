function bindDeleteData(data_id) {
  var id = data_id
  var data = {
    "productId": id
  }

  try {
    if (id == urlParams._i) {
      $("#buy").removeClass("btn-already")
      $("#buy").addClass("btn-buy")
      $("#buy").html("Beli")
      $("#buy").attr("disabled", false)
    }
  } catch (error) {

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
      refreshBuckets()
      getB()
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  });
}

function bindDeleteWishlist(data_id) {
  var id = data_id
  var data = {
    "productId": id
  }

  $.ajax({
    type: "DELETE",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/wishlists/delete",
    data: JSON.stringify(data),
    dataType: 'json',
    cache: false,
    timeout: 600000,
    headers: {
      'Authorization': `Bearer ` + getCookie("token"),
    },
    success: function (msg) {
      $("#main-content").html("")
      getWishlist()
    },
    error: function (errMsg) {
      console.log(errMsg)
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

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


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
        $("#notif-bucket").html(data.length)
        $("#notif-bucket").css("display", "inline-block")
        var tot = 0;
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

function getB() {
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
        var head = `
            <div class="col-md-6">
            <div class="bg-white-custom">
                <div class="content-border p-3 shadow-card no-border">
                    <label class="container-checkbox" style="margin-top: auto; margin-bottom: auto;">
                        <input type="checkbox" id="main-checkbox">
                        <span class="checkmark" style="top: 20px;"></span>
                    </label>
                    <span class="ml-3">Pilih Semua Buku</span>
                </div>
            </div>
            <div class="bg-white-custom">
                <div class="content-border p-2 shadow-card no-border">
                    <span class="float-left ml-3 content-title">Keranjang anda</span>
                    <br><br>
                    <div>
                        <ul class="ul-keranjang" id="main-keranjang">
                        </ul>
                        </div>
                    </div>
                </div>
            </div>`
        $("#main-content").append(head);
        var tot = 0;
        for (var i = 0; i < data.length; i++) {
          var html = `
                            <li class="itm-keranjang">
                                <div class="row">
                                    <div class="col-4 align-item-center" style="padding-right: 0;">
                                        <label class="container-checkbox center">
                                            <input type="checkbox" class="check">
                                            <span class="checkmark"></span>
                                        </label>
                                        <img src="` + data[i].product.productPhoto + `" alt="" class="width-img"
                                            style="margin-left: 20px;">
                                    </div>
                                    <div class="col-8">
                                        <h6 class="title-detail-keranjang">` + data[i].product.title + `</h6>
                                        <p class="author-keranjang">` + data[i].product.author + `</p>
                                        <p class="author-keranjang">` + data[i].product.sku + `</p>
                                        <p class="author-keranjang">` + data[i].product.isbn + `</p>
                                        <p class="price-keranjang">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                                        <p class="trash-keranjang" s="Sa" data-id="` + data[i].product.productId + `" style="float: right; margin-right: 20px;"><i class="fa fa-trash delete-icon" aria-hidden="true"></i></p>
                                    </div>
                                </div>
                            </li>
                            <hr>
                        `
          tot += data[i].product.price;
          $("#main-keranjang").append(html)
        }
        var total = `<div class="col-md-6">
        <div class="content-border p-2 shadow-card detail-keranjang">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p>Total Belanja (<b>` + data.length + `</b>)</p>
                    <p class="price-keranjang">Rp. ` + tot.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                </div>
                <div>
                    <a href="/market/confirmation-page.html"><button class="btn-buy">Bayar</button></a>
                </div>
            </div>
        </div>
    </div>`;
        $("#main-content").append(total);
      } else {
        $("#main-content").html(`
                <div class="bg-blank"></div>
                `);
      }
    },
    error: function (errMsg) {
      console.log(errMsg)
    }
  });
}

function getWishlist() {
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: "http://127.0.0.1:8080/api/wishlists",
    dataType: 'json',
    timeout: 600000,
    async: false,
    headers: {
      'Authorization': `Bearer ` + getCookie("token"),
    },
    success: function (data) {
      $("#wishlist-item").html("")
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          var html = `
              <div class="col-3-custom">
                  <div class="content-border shadow-card no-border border-radius-4">
                  <img src="` + data[i].product.productPhoto + `" alt="" class="width-img">
                  <div class="p-2">
                      <p class="title-book" title="` + data[i].product.title + `">` + data[i].product.title + `</p>
                      <p class="author-book" title="` + data[i].product.author + `">` + data[i].product.author + `</p>
                      <p class="price-book">Rp. ` + data[i].product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                      <p class="trash-wishlist" data-id="` + data[i].product.productId + `" id="` + data[i].product.productId + `" onclick="bindDeleteWishlist(this.id)"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
                      <button class="btn-tambah t" data-id="` + data[i].product.productId + `">Beli</button>
                  </div>
                  </div>
              </div>
              `
          $("#wishlist-item").append(html);
        }

      } else {
        $("#wishlist-item").removeClass("flex-row")
        $("#wishlist-item").html(`
              <div style="margin-top: 90px; margin-bottom: 100px;">
                  <div class="bg-blank-wishlist"></div>
                      <p class="p-1 keranjang bold center">Wishlist Kamu masih kosong.</p>
                  <div class="center">
                      <p class="t12">Ayo <a class="alink" href="/user/"><u>belanja</u></a> sekarang!</p>
                  </div>
              </div>
              `);
      }
    },
    error: function (errMsg) {
      window.location.replace("/404.html")
    }
  });
}