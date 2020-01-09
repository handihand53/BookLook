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

    var urlString = window.location.href;
    var urlParams = parseURLParams(urlString);

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

    $("#aprevious").attr("href", "/admin/dashboard_toko.html?page=" + (parseInt(urlParams.page) - 1))
    $("#anext").attr("href", "/admin/dashboard_toko.html?page=" + (parseInt(urlParams.page) + 1))

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

    var market;
    var start = "-"
    var end = "-"
    var btn = "Blokir"
    var btnClass = "blokir-btn"
    getList()

    function getList() {
        market = new Array();
        $("#table-body").html("")
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/admin/list/market",
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                market = data
                addToTable()
            }
        });
    }

    function addToTable() {
        if (market.length != 0) {
            var totPage = urlParams.page.toString() * 10
            var first = totPage - 10
            if (market.length < totPage) {
                totPage -= 10 - market.length
            }
            var x = "";
            var jmlPecah = Math.ceil(market.length / 10)
            if (jmlPecah < 4) {
                for (var i = 1; i <= jmlPecah; i++) {
                    x += i + " "
                }
            } else {
                x = (jmlPecah - 1) + " " + jmlPecah + " " + (jmlPecah + 1)
            }
            $("#page").html(x)

            if (urlParams.page.toString() < 4) {
                $("#previous").attr("hidden", true)
            }

            if (urlParams.page.toString() == jmlPecah) {
                $("#next").attr("hidden", true)
            }
            $("#currentShow").html(totPage)
            $("#allShow").html(market.length)
            for (var i = first; i < totPage; i++) {
                var d = new Date(market[i].createdAt);
                var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                var market_id = market[i].marketId
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
                        start = "-"
                        end = "-"
                        btn = "Blokir"
                        btnClass = "blokir-btn"
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
                                        break
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
                    <td class="" title="` + market[i].marketName + `"><a class="alink" href="/market/market-page.html?id=` + market[i].marketId + `">` + market[i].marketName + `</a></td>
                    <td class="center" style="color: ` + color + `;">` + statsMarket + `</td>
                    <td class="center">` + tgl + `</td>
                    <td class="center detail" data-id="` + i + `">Detail</td>
                    <td class="center"><button data-start="` + start + `" data-end="` + end + `" data-id="` + market[i].marketId + `" data-market="` + market[i].marketName + `" class="` + btnClass + `">` + btn + `</button></td>
                </tr>
                `
                $("#table-body").append(html)
            }
            $("#totMarket").html(market.length)
        } else {
            var html = `
                    <tr>
                        <td colspan="6" class="center txt">Belum ada toko yang terdaftar</td>
                    </tr>
                    `
            $("#table-body").append(html)
        }
        bindListener()
    }

    $("#unblokirMarket").click(function () {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/api/admin/unblock/market/" + $(this).attr("data-idMarket"),
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                console.log(data)
                $('#confirmModal').modal('hide');
            },
            error: function (data) {
                console.log(data)
            }
        });
    })

    $("#blokirMarket").click(function () {
        if ($("#hari").val() == "") {
            $("#errText").html("Tolong isi durasi lama blokir")
            return
        }
        $('#confirmModal').modal('hide');
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
                console.log("faile")
            }
        });
    })

    function bindListener() {
        $(".blokir-btn").click(function () {
            $("#confirm").click()
            $("#marketName").html($(this).data("market"))
            $("#blokirMarket").attr("data-idMarket", $(this).data("id"))
            $("#unblokirMarket").attr("hidden", true)
            $("#durasi").html(`Durasi blokir: <input type="number" class="day" id="hari" min="1" width="50px"> Hari`)
            $("#blokirMarket").attr("hidden", false)
        })

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

        $(".unblokir-btn").click(function () {
            $("#unblock").html("Buka blokir untuk market " + $(this).data("market") + " ?")
            $("#unblokirMarket").attr("data-idMarket", $(this).data("id"))
            $("#unblokirMarket").attr("hidden", false)
            $("#blokirMarket").attr("hidden", true)
            $("#durasi").html("")
            $("#errText").html("")
            $("#confirm").click()
        })
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    $("#dash-toko").addClass("li-active")
    $("#dash-toko-link").addClass("link-list")
    $("#dash-toko-mob").addClass("li-active")
    $("#dash-toko-link-mob").addClass("link-list")

    $('#confirmModal').on('hidden.bs.modal', function (e) {
        $("#hari").val("")
        getList()
    })
})