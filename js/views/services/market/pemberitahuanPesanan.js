import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

import checkTransaksi from '../../../notifMarket.js';

$(window).load(function () {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets/block/check",
        dataType: 'json',
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (!data.success)
                window.location.replace("/user/user.html")
        },
        error: function (errMsg) {
            console.log(errMsg)
        }
    });

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.marketId != null) {
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
                $("#loading").css("visibility", "hidden");
                $("#marketName").html(data.marketName)
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

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
    //digunakan untuk menampung data dari request array
    //karena hasil dari request datang tidak serial, maka diperlukan untuk sorting
    var dataArray = new Array();

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/market/show",
        dataType: 'json',
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            var tot = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                dataArray.push(data[i])
            }

            dataArray.sort(function (a, b) {
                return b.createdAt.toString().localeCompare(a.createdAt);
            });

        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
    var tot = 0;

    if (dataArray.length != 0) {
        for (var i = 0; i < dataArray.length; i++) {
            var username = ""
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/users/" + dataArray[i].userId,
                dataType: 'json',
                async: false,
                headers: {
                    'Authorization': `Bearer ` + getCookie("token"),
                },
                success: function (data) {
                    username = data.username
                }
            });
            var d = new Date(dataArray[i].createdAt);
            var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
            var cl;
            if (dataArray[i].transferConfirm == "PENDING") cl = "pembayaran-pending"
            else {
                cl = "pembayaran-success"
                tot++
            }

            var html = `
                    <tr>
                        <td class="no-pemesanan" title="` + dataArray[i].transactionCode + `">` + dataArray[i].transactionCode + `</td>
                        <td class="nama-pemesan" title="` + username + `">` + username + `</td>
                        <td class="tgl-pemesanan" title="` + tgl + `">` + tgl + `</td>
                        <td class="` + cl + `" title="` + dataArray[i].transferConfirm + `">` + dataArray[i].transferConfirm + `</td>
                        <td><a href="detail_pemberitahuan.html?_i=` + dataArray[i].transactionCode + `" class="detail-pemesanan">Lihat</a></td>
                    </tr>
                    `
            $("#contentBody").append(html)
        }
    } else {
        var html = `
                <tr>
                    <td class="center" colspan="5" style="color: gray">Belum ada pemberitahuan terbaru</td>
                </tr>
                `
        $("#contentBody").html(html)
    }
    $("#jmlBuku").html(tot)

    if (checkTransaksi() != 0) $("#pemberitahuan").html(checkTransaksi())
});