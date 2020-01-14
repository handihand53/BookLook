import {
    setCookie,
    getCookie,
    checkCookie,
    deleteCookie
} from './cookies.js'

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
            console.log(data)
            $("#nama").html(data.name)
            if (data.userPhoto == null)
                $("#img").attr("src", `/assets/else/signature.png`)
            else
                $("#img").attr("src", data.userPhoto)
        },
        error: function (data) {
            var html = `
            <div class="bg-white row mt-2 p-2">
                <a href="/login.html" class="row col-12">
                    <div class="akun-mob-nav row" style="width: 100%;">
                        <span class="float-left ml-3">Login</span>
                        <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
                    </div>
                </a>
                <a href="/signup.html" class="row col-12">
                    <div class="akun-mob-nav row" style="width: 100%;">
                        <span class="float-left ml-3">Daftar</span>
                        <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
                    </div>
                </a>
            </div>
            `
            $("#inti").html("")
            $("#inti").html(html)
            // console.log(data)
            // window.location.assign("/user/")
        }
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
            $("#jml-buku").html(data.length)
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });
}

getMarket()

var unregistered_market = `
    <a href="/market/open-store.html" class="row col-12">
        <div class="akun-mob-nav row" style="width: 100%;">
            <span class="float-left ml-3">Daftar Toko</span>
            <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
        </div>
    </a>
`

var registered_market = `
    <a href="/market/pemberitahuan_toko.html" class="row col-12">
        <div class="akun-mob-nav row" style="width: 100%;">
            <span class="float-left ml-3">Pemberitahuan Pesanan <span class="notif-toko-drop"
            style="display: none; height: auto;"></span></span>
            <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
        </div>
    </a>
    <a href="/market/store.html" class="row col-12">
        <div class="akun-mob-nav row" style="width: 100%;">
            <span class="float-left ml-3">Toko </span>
            <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
        </div>
    </a>
    <a href="/market/tambah_buku.html" class="row col-12">
        <div class="akun-mob-nav row" style="width: 100%;">
            <span class="float-left ml-3">Tambah Buku </span>
            <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
        </div>
    </a>
    <a href="/market/mybook_store.html" class="row col-12">
        <div class="akun-mob-nav row" style="width: 100%;">
            <span class="float-left ml-3">Buku</span>
            <i id="icon2" class="fas fa-chevron-right mt-1 ml-auto"></i>
        </div>
    </a>
`

function getMarket() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            $("#toko").html(registered_market)
        },
        error: function (errMsg) {
            $("#toko").html(unregistered_market)
        }
    });
}

$("#logout").click(function () {
    deleteCookie()
})

$(window).load(function () {
    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto" style="color: white;"></i> <span class="bold"></span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.history.back();
    })
})