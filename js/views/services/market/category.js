$(window).load(function () {
    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);
    console.log(urlParams.kategori.toString())
    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;
    
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
        url: "http://127.0.0.1:8080/api/products/"+urlParams.kategori.toString(),
        dataType: 'json',
        timeout: 600000,
        success: function (data) {
          console.log(data);
          console.log("sukses")
        },
        failure: function(errMsg) {
            console.log(errMsg); 
        }
    });
});