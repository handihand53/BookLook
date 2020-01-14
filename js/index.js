import {
    setCookie,
    getCookie,
    checkCookie
} from './cookies.js'

var id = ""
var readKey
var book = new Array()
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

        $.ajax({
            type: "GET",
            contentType: "application/json",
            async: false,
            url: "http://127.0.0.1:8080/api/products/category/" + arr,
            success: function (data) {
                if (data.length != 0) {
                    var coverTag = `
                <div class="mtb-20 hide-border">
                    <div class="col-5-custom border-content">
                        <div>
                            <div class="float-left ml-3 content-title">` + arr + `</div>
                            <div class="float-right mr-3 content-link"><a href="/market/category.html?kategori=` + arr + `" style="color: #055dff!important;">Lebih Banyak</a>
                        </div>
                    </div>
                    <br>
                    <br>
                    <div class="row" id="` + arr + `">

                    </div>
                </div>
                `
                    $("#utama").append(coverTag)
                }
                for (var i = 0; i < data.length; i++) {
                    book.push(data[i])
                    if (i < 3) {
                        var html = `
                    <div class="col-4">
                        <a href="/market/book.html?_i=` + data[i].productId + `">
                            <div class="content-border select shadow-card max-min no-border border-radius-4">
                                <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                                <div class="p-1">
                                <p class="title no-margin no-padding">` + data[i].title + `</p>
                                <p class="author-main">` + data[i].author + `</p>
                                <p class="price">Rp. ` + data[i].price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, '') + `</p>
                                </div>
                            </div>
                        <a>
                    </div>
                        `
                        $("#" + arr).append(html)
                    }
                }
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    });
}



$.ajax({
    type: "GET",
    contentType: "application/json",
    async: false,
    url: "http://127.0.0.1:8080/api/products/dashboard/header/18",
    success: function (data) {
        getBook(data)
    },
    error: function (data) {
        console.log(data)
    }
});


function getBook(data) {

    if (data.length != 0) {
        var body = `
            <div class="carousel-item active no-border-bottom">
                <div class="row col-12 slider-container">
                </div>
            <br>
            </div>
            `
        $("#slider").append(body)
        var le = 0;

        if (data.length % 6 != 0) {
            le += data.length + (6 - data.length % 6)
        }
        console.log(le)
        var i = 0

        for (var j = 0; j < le; j++, i++) {
            if (i % data.length == 0) {
                i = 0
            }
            console.log(i)
            if (j % 6 == 0 && j != 0) {
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
                <a href="/market/book.html?_i=` + data[i].productId + `">
                    <div class="content-border select shadow-card max-min no-border border-radius-4">
                        <img src="` + data[i].productPhoto + `" alt="" class="width-img">
                        <div class="p-1">
                        <p class="title no-margin no-padding">` + data[i].title + `</p>
                        <p class="author-main">` + data[i].author + `</p>
                        </div>
                    </div>
                <a>
            </div>
            `
            $(".slider-container:last").append(content)
        }
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

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/libraries",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {

        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });


}

$(document).ready(function () {
    $("#beranda-i").addClass("bottom-active")
    $("#beranda-t").addClass("bottom-active border-active")
})