import {
    setCookie,
    getCookie,
    checkCookie
} from './cookies.js'

var id = ""
var readKey
getDataUser()

function getDataUser() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/users",
        async: false,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            id = data.userId
            readKey = data.readKey
        }
    });
}
var catName = new Array();
getCategory()

function getCategory() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/categories/",
        Accept: "application/json",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                catName.push(data[i].categoryName)
            }
        },
        failure: function (errMsg) {
            console.log(errMsg);
        }
    });
}

getBooks()

function getBooks() {

    catName.forEach(arr => {
        var coverTag = `
        <div class="col-5-custom mb-3">
            <div>
                <div class="float-left ml-3 content-title">`+arr+`</div>
                <div class="float-right mr-3 content-link"><a href="/market/category.html?kategori=`+arr+`">Lebih Banyak</a>
                </div>
            </div>
            <br>
            <br>
            <div class="row" id="`+arr+`">

            </div>
        </div>
        `
        $("#utama").append(coverTag)

        $.ajax({
            type: "GET",
            contentType: "application/json",
            async: false,
            url: "http://127.0.0.1:8080/api/products/category/"+arr,
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var html = `
                    <a href="/market/book.html?_i=` + data[i].productId + `">
                        <div class="col-4">
                            <div class="content-border select shadow-card max-min no-border border-radius-4">
                                <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                                <div class="p-1">
                                <p class="title no-margin no-padding">` + data[i].title + `</p>
                                <p class="author-main">` + data[i].author + `</p>
                                <p class="price">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                                </div>
                            </div>
                        </div>
                    <a>
                        `
                    $("#"+arr).append(html)
                }
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    });
}

getBook()

function getBook() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/libraries",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.length != 0) {
                console.log(data)
                var body = `
                    <div class="carousel-item active" style="border-bottom: none;">
                        <div class="row col-12 slider-container">
                        </div>
                    <br>
                    </div>
                    `
                $("#slider").append(body)
                var le = 0;
                if (data.length > 17) {
                    le = 17
                } else {
                    le = data.length
                }
                for (var i = 0; i < le; i++) {
                    var pro = data[i].product;
                    var res = pro.productFile.split("/");
                    if (i % 6 == 0 && i != 0) {
                        var body = `
                            <div class="carousel-item">
                                <div class="row col-12 slider-container">
                                </div>
                            <br>
                            </div>
                            `
                        $("#slider").append(body)
                    }
                    var content = `
                    <div class="col-2-mob-4-desk">
                        <div class="rb" data-file="` + res[res.length - 1] + `" data-id="` + id + `" target="#">
                            <div class="content-border border-radius-4 shadow-card max-min no-border border-radius-4 select2">
                                <img src="` + data[i].product.productPhoto + `" alt="` + data[i].product.title + `" class="width-img">
                                <div class="p-1">
                                    <p class="title no-margin no-padding" title="` + data[i].product.title + `">` + data[i].product.title + `</p>
                                    <p class="author-book" title="` + data[i].product.author + `">` + data[i].product.author + `</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                    $(".slider-container:last").append(content)
                }
                var content = `
                    <div class="col-2-mob-4-desk">
                        <a href="/user/mybook.html">
                            <div class="content-border border-radius-200 shadow-card max-min no-border select2">
                                <div class="center cst-icon"><i class="fas fa-plus"></i><br><span class="f-12">Lihat Lebih banyak</span></div>
                            </div>
                        </a>
                    </div>`
                $(".slider-container:last").append(content)
                klik()
            } else {
                var body = `
                            <div class="carousel-item">
                                <div class="row col-12 slider-container">
                                </div>
                            <br>
                            </div>
                            `
                $("#slider").append(body)
                $(".slider-container:last").append("Belum ada buku")
            }
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });

    function klik() {
        $(".rb").click(function () {
            getDataUser()
            $(this).attr("data-key", readKey)
            window.open("/user/readbook.html?file=" + $(this).attr("data-file") + "&id=" + $(this).attr("data-id") + "&key=" + readKey)
        })
    }
}