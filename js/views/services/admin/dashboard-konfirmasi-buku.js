import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';

$(document).ready(function () {
    var book = new Array()

    var readKey
    var id
    getDataAdmin()

    function getDataAdmin() {
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/admin/profile",
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                id = data.userId
                readKey = data.readKey
            },
            error: function (err) {
                window.location.assign("/admin_login.html");
            }
        });
    }

    var long = ""
    var short = ""
    var month = new Array();
    month[0] = "Januari";
    month[1] = "Februari";
    month[2] = "Maret";
    month[3] = "April";
    month[4] = "Mei";
    month[5] = "Juni";
    month[6] = "Juli";
    month[7] = "Agustus";
    month[8] = "September";
    month[9] = "Oktober";
    month[10] = "November";
    month[11] = "Desember";
    getDataTable()

    function getDataTable() {
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/admin/products/unconfirmed",
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                book = data
                addBook(book)
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    function addBook(data) {
        $("#contentBody").html("")
        if (data.length == 0)
            $("#jmlBuku").html("")
        else
            $("#jmlBuku").html(data.length)

        if (data.length != 0) {
            $("#jmlBukuMob").addClass("notif")
            $("#jmlBuku").addClass("notif")
            $("#jmlBukuMob").html(data.length)
            $("#jmlBuku").html(data.length)
            for (var i = 0; i < data.length; i++) {
                var d = new Date(data[i].product.createdAt);
                var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                let html = `
                    <tr>
                        <td>` + (i + 1) + `</td>
                        <td class="text-table" title="` + data[i].product.title + `">` + data[i].product.title + `</td>
                        <td class="text-table" title="` + tgl + `">` + tgl + `</td>
                        <td class="text-table" title="` + data[i].marketName + `"><a target="#" href=/market/market-page.html?id=` + data[i].marketId + `>` + data[i].marketName + `</a></td>
                        <td class="text-table look center" data-id="` + data[i].product.productId + `">Lihat</td>
                        <td class="center no-pad-left"><button id="acc" class="btn-acc" data-name="` + data[i].product.title + `" data-id="` + data[i].product.productId + `" type="button"><i class="fas fa-check f14 mb-2 mt-2"></i></button></td>
                        <td class="center no-pad-right"><button id="decline" class="btn-decline" data-name="` + data[i].product.title + `" data-id=` + data[i].product.productId + ` ><i class="fas fa-times"></i></button></td>
                    </tr>
                    `
                $("#contentBody").append(html)
            }
        } else {
            var html = `
                    <tr>
                        <td colspan="6" class="center txt">Belum ada permintaan buku baru</td>
                    </tr>
                    `
            $("#contentBody").append(html)
            $("#jmlBukuMob").html()
            $("#jmlBuku").html()
            $("#jmlBukuMob").removeClass("notif")
            $("#jmlBuku").removeClass("notif")
        }
        accept()
        decline()
        lihatListener()
        accListener()
    }

    accept()
    decListener()

    function accept() {
        $(".btn-acc").click(function () {
            $("#bookName").html($(this).data("name"))
            $("#msg").html(`Apakah anda yakin akan mengkonfirmasi buku <span id="bookName">` + $(this).attr("data-name") + `</span>?`)
            $("#accProduct").attr("data-id", $(this).attr("data-id"))
            $("#accProduct").html("Konfirmasi")
            $("#decProduct").css("display", "none")
            $("#accProduct").css("display", "block")
            $("#confirm").click()
        })

    }

    function decline() {
        $(".btn-decline").click(function () {
            $("#msg").html(`Apakah anda yakin akan menolak buku <span id="bookName">` + $(this).attr("data-name") + `</span>?`)
            $("#decProduct").attr("data-id", $(this).attr("data-id"))
            $("#decProduct").css("display", "block")
            $("#accProduct").css("display", "none")
            $("#decProduct").html("Tolak")
            $("#confirm").click()
        })
    }

    function decListener() {
        $("#decProduct").click(function () {
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:8080/api/admin/products/" + $(this).attr("data-id") + "/decline",
                async: false,
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                success: function (data) {
                    $("#contentBody").html("")
                    getDataTable()
                    $('#confirmModal').modal('hide');
                },
                error: function (errMsg) {
                    console.log(errMsg)
                }
            });
        })
    }

    function accListener() {
        $("#accProduct").click(function () {
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:8080/api/admin/products/" + $(this).attr("data-id") + "/confirm",
                async: false,
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                success: function (data) {
                    $("#contentBody").html("")
                    getDataTable()
                    $('#confirmModal').modal('hide');
                }
            });
        })
    }

    function lihatListener() {
        $(".look").click(function () {
            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:8080/api/products/" + $(this).attr("data-id"),
                async: false,
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                success: function (data) {
                    var res = data.product.productFile.split("/");
                    $("#img-book").attr("src", data.product.productPhoto)
                    $("#bookModal").html(data.product.title)
                    $("#penulis").html(data.product.author)
                    $("#penerbit").html(data.product.publisher)
                    $("#isbn").html(data.product.isbn)
                    $("#sku").html(data.product.sku)
                    $("#price").html(data.product.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\.00/g, ''))
                    if (data.product.description.toString().length > 400) {
                        long = data.product.description + `<span class="read-more" id="less-more"> Kurangi</span>`
                        short = data.product.description.substring(0, 400) + "..." + `<span class="read-more" id="read-more"> Lebih banyak</span>`
                    } else {
                        short = data.product.description
                    }
                    $("#readBook").attr("data-file", res[res.length - 1])
                    $("#deskripsi").html(short)
                    $("#btn-modal").click()
                    bindReadMore()
                },
                error: function (errMsg) {
                    console.log(errMsg)
                }
            });
        })
    }

    function bindReadMore() {
        $("#read-more").click(function () {
            $("#deskripsi").html(long)
            bindLess()
        })
    }

    function bindLess() {
        $("#less-more").click(function () {
            $("#deskripsi").html(short)
            bindReadMore()
        })
    }

    $("#readBook").click(function () {
        getDataAdmin()
        window.open("/admin/readbook.html?file=" + $(this).attr("data-file") + "&id=" + id + "&key=" + readKey)
    })

    function judulAsc(a, b) {
        var nameA = a.product.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.product.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }

    function judulDesc(a, b) {
        var nameA = a.product.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.product.title.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }

        if (nameA < nameB) {
            return 1;
        }

        return 0;
    }

    function tanggalAsc(a, b) {
        var nameA = a.product.createdAt.toUpperCase(); // ignore upper and lowercase
        var nameB = b.product.createdAt.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }

    function tanggalDesc(a, b) {
        var nameA = a.product.createdAt.toUpperCase(); // ignore upper and lowercase
        var nameB = b.product.createdAt.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }

        if (nameA < nameB) {
            return 1;
        }

        return 0;
    }

    function tokoAsc(a, b) {
        var nameA = a.marketName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.marketName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }

    function tokoDesc(a, b) {
        var nameA = a.marketName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.marketName.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }

        if (nameA < nameB) {
            return 1;
        }

        return 0;
    }

    sortJudul()

    function sortJudul() {
        $("#judul").click(function () {
            $("#tanggal").html(`Tanggal`)
            $("#toko").html(`Toko`)
            if ($(this).attr("data-set") == "0") {
                $(this).attr("data-set", "1")
                $(this).html(`Judul Buku <i class="fas fa-sort-up"></i>`)
                book.sort(judulAsc);
                addBook(book)
            } else {
                $(this).attr("data-set", "0")
                $(this).html(`Judul Buku <i class="fas fa-sort-down"></i>`)
                book.sort(judulDesc);
                addBook(book)
            }
        })
    }

    sortTanggal()

    function sortTanggal() {
        $("#tanggal").click(function () {
            $("#judul").html(`Judul Buku`)
            $("#toko").html(`Toko`)
            if ($(this).attr("data-set") == "0") {
                $(this).attr("data-set", "1")
                $(this).html(`Tanggal <i class="fas fa-sort-up"></i>`)
                book.sort(tanggalAsc);
                addBook(book)
            } else {
                $(this).attr("data-set", "0")
                $(this).html(`Tanggal <i class="fas fa-sort-down"></i>`)
                book.sort(tanggalDesc);
                addBook(book);
            }
        })
    }

    sortToko()

    function sortToko() {
        $("#toko").click(function () {
            $("#tanggal").html(`Tanggal`)
            $("#judul").html(`Judul`)
            if ($(this).attr("data-set") == "0") {
                $(this).attr("data-set", "1")
                $(this).html(`Status <i class="fas fa-sort-up"></i>`)
                book.sort(tokoAsc);
                addBook(book)
            } else {
                $(this).attr("data-set", "0")
                $(this).html(`Status <i class="fas fa-sort-down"></i>`)
                book.sort(tokoDesc);
                addBook(book);
            }
        })
    }

    $("#dash-konfirmasi").addClass("li-active")
    $("#dash-konfirmasi-link").addClass("link-list")
    $("#dash-konfirmasi-mob").addClass("li-active")
    $("#dash-konfirmasi-link-mob").addClass("link-list")
})