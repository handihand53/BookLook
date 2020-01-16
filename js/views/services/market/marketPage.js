$(window).load(function () {
    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);
    var long = ""
    var short = ""
    var str
    var book = new Array();
    var f = false;

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

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/products/market/" + urlParams.id.toString(),
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {
            book = data
            f = false;
            listBook(book, str)
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });
    

    function listBook(data, str) {
        f = false
        if (data.length != 0) {
            $("#product-items").html("")
            if (str == "" || str == undefined) {

                for (let i = 0; i < data.length; i++) {
                    f = true
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
                
            } else {
                for (let i = 0; i < data.length; i++) {
                    if (str.toLowerCase() == data[i].title.substring(0, str.length).toLowerCase()) {
                        f = true;
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
            }

            if (f == false && data.length != 0) {
                $("#product-items").html("<div class='p-3'>Tidak ada buku dengan judul <b>" + str + "</b></div>");
            }
        } else {
            $("#product-items").removeClass("flex-row")
            $("#product-items").removeClass("border")
            $("#product-items").html(`<div class="bg-kosong"></div>
                                      <div class="center txt">Tidak ada buku untuk di tampilkan</div>
                                      <div class="center"><a href="/user/"><button class="btn-blue-utama">Halaman Utama</button></a></div>
            `)
            //market belum punya buku
        }

    }

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

            $(".marketName").html(data.marketName)
            if (data.marketBio.toString().length > 100) {
                long = data.marketBio + `<span class="read-more" id="less-more"> Lebih sedikit</span>`
                short = data.marketBio.substring(0, 100) + "..." + `<span class="read-more" id="read-more"> Lebih banyak</span>`
            } else {
                short = data.marketBio
            }
            $("#tentang").html(short)
            bindReadMore()
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    function bindReadMore() {
        $("#read-more").click(function () {
            $("#tentang").html(long)
            bindLess()
        })
    }

    function bindLess() {
        $("#less-more").click(function () {
            $("#tentang").html(short)
            bindReadMore()
        })
    }

    $("#sort").click(function () {
        if ($("#drop-sort").attr("data-status") == "0") {
            $("#drop-sort").addClass("show")
            $("#drop-sort").attr("data-status", "1")
        } else {
            $("#drop-sort").removeClass("show")
            $("#drop-sort").attr("data-status", "0")
        }
    })

    $(".sort-content").click(function () {
        $("#drop-sort").attr("data-status", "0")
        $("#drop-sort").removeClass("show")

        if ($(this).attr("data-sort") == "judulAsc")
            book.sort(judulAsc);
        else if ($(this).attr("data-sort") == "judulDesc")
            book.sort(judulDesc);
        else if ($(this).attr("data-sort") == "hargaAsc")
            book.sort(hargaAsc);
        else if ($(this).attr("data-sort") == "hargaDesc")
            book.sort(hargaDesc);
        listBook(book, $('#search').val())
    })

    $('#search').on('input', function () {
        listBook(book, $('#search').val())
    });

    $(".sort-content").click(function () {
        $("#drop-sort").attr("data-status", "0")
        $("#drop-sort").removeClass("show")

        if ($(this).attr("data-sort") == "judulAsc")
            book.sort(judulAsc);
        else if ($(this).attr("data-sort") == "judulDesc")
            book.sort(judulDesc);
        else if ($(this).attr("data-sort") == "hargaAsc")
            book.sort(hargaAsc);
        else if ($(this).attr("data-sort") == "hargaDesc")
            book.sort(hargaDesc);
        listBook(book, $('#search').val())
    })

    function judulAsc(a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function judulDesc(a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function hargaAsc(a, b) {
        var nameA = a.price
        var nameB = b.price
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function hargaDesc(a, b) {
        var nameA = a.price
        var nameB = b.price
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

});