import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';


$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/profile",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {},
        error: function (err) {
            window.location.assign("/admin_login.html");
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

    var market = new Array();
    var start = "-"
    var end = "-"
    var btn = "Blokir"
    var btnClass = "blokir-btn"
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/list/market",
        async: false,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log(data)
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    market.push(data[i])
                    var d = new Date(data[i].createdAt);
                    var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                    var market_id = data[i].marketId
                    var statsMarket = "Aktif"
                    var color = "green"

                    $.ajax({
                        type: "GET",
                        url: "http://127.0.0.1:8080/api/admin/block/market",
                        async: false,
                        headers: {
                            'Authorization': `Bearer ` + getCookie("token"),
                        },
                        success: function (data) {
                            if (data.length != 0) {
                                for (var i = 0; i < data.length; i++) {
                                    if (market_id == data[i].market.marketId) {
                                        var today = new Date();
                                        start = new Date(data[i].startAt);
                                        end = new Date(data[i].endAt);

                                        if (today >= start && today <= end) {
                                            statsMarket = "Blokir"
                                            color = "red"
                                            btn = "Buka Blokir"
                                            btnClass = "unblokir-btn"
                                            break;
                                        } else {
                                            start = "-"
                                            end = "-"
                                            btn = "Blokir"
                                            btnClass = "blokir-btn"
                                        }
                                    } else {
                                        start = "-"
                                        end = "-"
                                        btn = "Blokir"
                                        btnClass = "blokir-btn"
                                    }
                                }
                            }
                        },
                    });


                    var html = `
                    <tr>
                        <th class="center" scope="row">` + (i + 1) + `</th>
                        <td class="center" title="` + data[i].marketName + `"><a class="alink" href="/market/market-page.html?id=` + data[i].marketId + `">` + data[i].marketName + `</a></td>
                        <td class="center" style="color: ` + color + `;">` + statsMarket + `</td>
                        <td class="center">` + tgl + `</td>
                        <td class="center detail" data-id="` + i + `">Detail</td>
                        <td class="center"><button data-start="` + start + `" data-end="` + end + `" data-id="` + data[i].marketId + `" data-market="` + data[i].marketName + `" class="` + btnClass + `">` + btn + `</button></td>
                    </tr>
                    `
                    $("#table-body").append(html)
                }
            }
        }
    });

    $(".blokir-btn").click(function () {
        $("#confirm").click()
        $("#marketName").html($(this).data("market"))
        $("#blokirMarket").attr("data-idMarket", $(this).data("id"))
        console.log($(this).data("id"))
    })

    $("#blokirMarket").click(function () {
        if ($("#hari").val() == "") {
            $("#errText").html("Tolong isi durasi lama blokir")
            return
        }

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/api/admin/block/market/" + $(this).attr("data-idMarket") + "/" + $("#hari").val(),
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                console.log("sukses")
            },
            error: function (data) {
                console.log(data)
                console.log("faile")
            }
        });
    })

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    $(".detail").click(function () {
        $("#btn-modal").click()
        var src
        if (market[$(this).data("id")].marketPhoto == null) {
            src = "../assets/else/signature.png";
        } else {
            src = market[$(this).data("id")].marketPhoto
        }
        console.log(start)
        if (start != "-")
            start = start.getDate() + " " + month[start.getMonth()] + " " + start.getFullYear() + " - " + addZero(start.getHours()) + ":" + addZero(start.getMinutes()) + " WIB";

        if (end != "-")
            end = end.getDate() + " " + month[end.getMonth()] + " " + end.getFullYear() + " - " + addZero(end.getHours()) + ":" + addZero(end.getMinutes()) + " WIB";

        $("#blokirStart").html(start)
        $("#blokirEnd").html(end)
        $("#img-market").attr("src", src)
        $("#namaToko").html(market[$(this).data("id")].marketName)
        var d = new Date(market[$(this).data("id")].createdAt);
        var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
        $("#date").html(tgl)
        $("#deskripsiToko").html(market[$(this).data("id")].marketBio)

    })

    // /api/admin/block/market/
    $("#dash-toko").addClass("li-active")
    $("#dash-toko-link").addClass("link-list")
    $("#dash-toko-mob").addClass("li-active")
    $("#dash-toko-link-mob").addClass("link-list")
})