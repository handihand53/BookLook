import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';

$(document).ready(function () {
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
    function getDataTable(){
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/admin/products/unconfirmed",
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                console.log(data)
                if (data.length != 0) {
                    $("#jmlBukuMob").addClass("notif")
                    $("#jmlBuku").addClass("notif")
                    $("#jmlBukuMob").html(data.length)
                    $("#jmlBuku").html(data.length)
                    for (var i = 0; i < data.length; i++) {
                        var d = new Date(data[i].createdAt);
                        var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                        let html = `
                    <tr>
                        <td>` + (i + 1) + `</td>
                        <td class="text-table" title="` + data[i].title + `">` + data[i].title + `</td>
                        <td class="text-table" title="` + tgl + `">` + tgl + `</td>
                        <td class="text-table" title=></td>
                        <td class="text-table look" data-id="` + data[i].productId + `">Lihat</td>
                        <td class="center no-pad-left"><button id="acc" class="btn-acc" data-name="` + data[i].title + `" data-id="` + data[i].productId + `" type="button"><i class="fas fa-check f14 mb-2 mt-2"></i></button></td>
                        <td class="center no-pad-right"><button id="decline" class="btn-decline" data-id=` + data[i].productId + ` ><i class="fas fa-times"></i></button></td>
                    </tr>
                    `
                        $("#contentBody").append(html)
                    }
                } else {
                    $("#jmlBukuMob").html()
                    $("#jmlBuku").html()
                    $("#jmlBukuMob").removeClass("notif")
                    $("#jmlBuku").removeClass("notif")
                }
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    $(".btn-acc").click(function () {
        $("#bookName").html($(this).data("name"))
        $("#accProduct").attr("data-id", $(this).data("id"))
        $("#confirm").click()
    })
    
    $("#accProduct").click(function () {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/api/admin/products/"+$(this).data("id")+"/confirm",
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#contentBody").html("")
                getDataTable()
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    })

    $(".look").click(function () {
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/products/" + $(this).data("id"),
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                console.log(data)
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
                $("#deskripsi").html(short)
                $("#btn-modal").click()
                bindReadMore()
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    })

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


    $("#dash-konfirmasi").addClass("li-active")
    $("#dash-konfirmasi-link").addClass("link-list")
    $("#dash-konfirmasi-mob").addClass("li-active")
    $("#dash-konfirmasi-link-mob").addClass("link-list")
})