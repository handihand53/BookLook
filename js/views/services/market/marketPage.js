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

    $("#about").attr("href", "/market/about.html?id="+urlParams.id.toString())

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/products/market/" + urlParams.id.toString(),
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    var html = `
                    <div class="col-3-custom">
                    <div class="content-border shadow-card no-border border-radius-4">
                        <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                        <div class="p-2">
                            <p class="title-book">` + data[i].title + `</p>
                            <p class="author-book">` + data[i].author + `</p>
                            <p class="price-store">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                            <a href="book.html?_i=` + data[i].productId + `"><button class="btn-detail">Detail</button></a>
                        </div>
                    </div>
                </div>
                    `
                    $("#product-items").append(html)
                }
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/markets/" + urlParams.id.toString(),
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.marketPhoto != null)
                $("#img-market").attr("src", data.marketPhoto)
            else
                $("#img-market").attr("src", "../assets/else/signature.png")

            $("#marketName").html(data.marketName)
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

});