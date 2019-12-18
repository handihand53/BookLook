import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'


$(window).load(function () {

    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);
    var productId;

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
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            productId = data.product.productId;
            $("#marketSeller").html(`<a class="market-link" href="/market/market-page.html?id=`+data.marketId+`"><u>`+data.marketName+`</u></a>`);
            $("#sku").html(data.product.sku);
            $("#price").html("Rp. " + data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''));
            $("#author").html(data.product.author);
            $("#publisher").html(data.product.publisher);
            $("#deskripsi").html(data.product.description);
            $("#bookimg").attr("src", data.product.productPhoto);
            $("#title").html(data.product.title)
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });

    $("#buy").click(function () {
        var data = {
            "productId": productId
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/buckets/add/",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            data: JSON.stringify(data),
            success: function (data) {
                getBuckets()
                $("#modalInfo").click()
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    })

    $("#wishlist").click(function () {
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
                $("#modalInfo").click()
            },
            error: function (errMsg) {
                console.log(errMsg)
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
                        <p style="col-2 trash-bucket" data-id="` + data[i].product.productId + `"><i class="fa fa-trash trash-hov-profile" aria-hidden="true"></i></p> 
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

});