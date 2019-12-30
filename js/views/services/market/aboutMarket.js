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

    $("#about").attr("href", "/market/about.html?id=" + urlParams.id.toString())
    $("#book").attr("href", "/market/market-page.html?id=" + urlParams.id.toString())

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
            $("#marketName2").html(data.marketName)
            $("#tentang").html(data.marketBio)
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

});