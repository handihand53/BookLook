import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {

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

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.marketId != null) {
                $("#loading").css("visibility", "hidden");
                $("#marketName").html(data.marketName)
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
            }
        },
        error: function (errMsg) {
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/products/"+urlParams._i,
        dataType: 'json',
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            var html = `
            <div class="col-3-custom">
                <div class="content-border shadow-card no-border border-radius-4">
                  <img src="`+data.product.productPhoto+`" alt="" class="width-img">
                </div>
              </div>
              <div class="col-9-custom">
                <p class="title-book" title="`+data.product.title+`">`+data.product.title+`</p>
                <p class="author-book">`+data.product.author+`</p>
                <p class="publish-book">Penerbit :`+data.product.publisher+`</p>
                <p class="publish-book">`+data.product.isbn+`</p>
                <p class="publish-book">`+data.product.sku+`</p>
                <p class="deskripsi">Deskripsi</p>
                <p class="deskripsi-content mb-4">`+data.product.description+`</p>
                <p class="price-detail orange">Rp. `+data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+`</p>
                <br>
                <a href="edit_buku.html?_i=`+data.product.productId+`"><button class="btn-edit">Edit</button></a>
              </div>
            `
            $("#bookContent").html(html)
        },
        error: function (errMsg) {
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });
});