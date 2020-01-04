import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

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

var url = `http://127.0.0.1:8080/api/libraries/books/`
var key = urlParams.key
var id = urlParams.id
var book = urlParams.file

var fullPath = url + id + "/" + key + "/" + book +"#toolbar=0"
console.log(fullPath)
$("#iframe").attr("src", fullPath)