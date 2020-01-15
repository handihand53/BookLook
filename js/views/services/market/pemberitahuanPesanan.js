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

    addToTable()

    function addToTable() {
        var tot = 0;
        $("#contentBody").html("")
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
                dataArray[i].username = username;
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
    }

    if (checkTransaksi() != 0) $("#pemberitahuan").html(checkTransaksi())

    $("#no").click(function () {
        $("#nama").html(`Nama Pemesan`)
        $("#tanggal").html(`Tanggal`)
        $("#status").html(`Status`)

        if ($(this).attr("data-set") == "0") {
            $(this).attr("data-set", "1")
            $(this).html(`No Pemesanan <i class="fas fa-sort-up"></i>`)
            dataArray.sort(noAsc);
            addToTable()
        } else {
            $(this).attr("data-set", "0")
            $(this).html(`No Pemesanan <i class="fas fa-sort-down"></i>`)
            dataArray.sort(noDesc);
            addToTable()
        }
    })

    $("#nama").click(function () {
        $("#no").html(`No Pemesanan`)
        $("#tanggal").html(`Tanggal`)
        $("#status").html(`Status`)

        if ($(this).attr("data-set") == "0") {
            $(this).attr("data-set", "1")
            $(this).html(`Nama Pemesan <i class="fas fa-sort-up"></i>`)
            dataArray.sort(namaAsc);
            addToTable()
        } else {
            $(this).attr("data-set", "0")
            $(this).html(`Nama Pemesan <i class="fas fa-sort-down"></i>`)
            dataArray.sort(namaDesc);
            addToTable()
        }
    })

    $("#tanggal").click(function () {
        $("#no").html(`No Pemesanan`)
        $("#nama").html(`Nama Pemesanan`)
        $("#status").html(`Status`)

        if ($(this).attr("data-set") == "0") {
            $(this).attr("data-set", "1")
            $(this).html(`Tanggal <i class="fas fa-sort-up"></i>`)
            dataArray.sort(tanggalAsc);
            addToTable()
        } else {
            $(this).attr("data-set", "0")
            $(this).html(`Tanggal <i class="fas fa-sort-down"></i>`)
            dataArray.sort(tanggalDesc);
            addToTable()
        }
    })

    $("#status").click(function () {
        $("#no").html(`No Pemesanan`)
        $("#tanggal").html(`Tanggal`)
        $("#status").html(`Status`)

        if ($(this).attr("data-set") == "0") {
            $(this).attr("data-set", "1")
            $(this).html(`Status <i class="fas fa-sort-up"></i>`)
            dataArray.sort(statusAsc);
            addToTable()
        } else {
            $(this).attr("data-set", "0")
            $(this).html(`Status <i class="fas fa-sort-down"></i>`)
            dataArray.sort(statusDesc);
            addToTable()
        }
    })

    function namaAsc(a, b) {
        var nameA = a.username.toUpperCase();
        var nameB = b.username.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function namaDesc(a, b) {
        var nameA = a.username.toUpperCase();
        var nameB = b.username.toUpperCase();
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function noAsc(a, b) {
        var nameA = a.transactionCode.toUpperCase();
        var nameB = b.transactionCode.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function noDesc(a, b) {
        var nameA = a.transactionCode.toUpperCase();
        var nameB = b.transactionCode.toUpperCase();
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function tanggalAsc(a, b) {
        var nameA = a.createdAt;
        var nameB = b.createdAt;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function tanggalDesc(a, b) {
        var nameA = a.createdAt;
        var nameB = b.createdAt;
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    function statusAsc(a, b) {
        var nameA = a.transferConfirm
        var nameB = b.transferConfirm
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    function statusDesc(a, b) {
        var nameA = a.transferConfirm
        var nameB = b.transferConfirm
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    }

    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Toko</span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.history.back();
    })
});