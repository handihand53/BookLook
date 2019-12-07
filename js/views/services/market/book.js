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
        url: "http://127.0.0.1:8080/api/products/" + urlParams.sku.toString(),
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log("sukses")
            console.log(data)
            // productId = data.;
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });

    $("#buy").click(function () {
        var data = productId;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/buckets/add/",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            data: data,
            success: function (data) {
                console.log("sukses")
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    })

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/buckets/",
        timeout: 600000,
        headers: {
              'Authorization': `Bearer ` + getCookie("token"),
          },
        success: function (data) {
          console.log("sukses")
        },
        error: function (errMsg) {
          console.log(errMsg)
        }
      });

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/wishlists/",
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log("sukses")
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });

    $("#wishlist").click(function () {
        var data = "19bf2543-2f03-4ac0-982f-ad4f36325e3a";
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/wishlists/add/",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            data: data,
            success: function (data) {
                console.log("sukses")
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    })

});