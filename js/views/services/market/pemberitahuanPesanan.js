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
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        timeout: 600000,
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

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/transactions/market/show",
        dataType: 'json',
        async: true,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            for(var i=data.length-1;i>=0;i--){
                var d = new Date(data[i].createdAt);
                var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                var cl;
                if(data[i].transferConfirm=="PENDING")cl="pembayaran-pending"
                else cl="pembayaran-success"
                var html = `
                <tr>
                    <td class="no-pemesanan" title="`+data[i].transactionId+`">`+data[i].transactionId+`</td>
                    <td class="nama-pemesan" title="`+data[i].userId+`">`+data[i].userId+`</td>
                    <td class="tgl-pemesanan" title="`+tgl+`">`+tgl+`</td>
                    <td class="`+cl+`" title="`+data[i].transferConfirm+`">`+data[i].transferConfirm+`</td>
                    <td><a href="detail_pemberitahuan.html?_i=`+data[i].transactionId+`" class="detail-pemesanan">Lihat</a></td>
                </tr>
                `
                $("#contentBody").append(html)
            }
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });

    if(checkTransaksi()!=0)$("#pemberitahuan").html(checkTransaksi())
});