import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';


$(document).ready(function () {
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

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

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

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/block/user",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    var d = new Date(data[i].user.createdAt);
                    var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                    var start = new Date(data[i].startAt);
                    var startAt = start.getDate() + " " + month[start.getMonth()] + " " + start.getFullYear() + " - " + addZero(start.getHours()) + ":" + addZero(start.getMinutes()) + " WIB";;
                    var end = new Date(data[i].endAt);
                    var endAt = end.getDate() + " " + month[end.getMonth()] + " " + end.getFullYear() + " - " + addZero(end.getHours()) + ":" + addZero(end.getMinutes()) + " WIB";;
                    var html = `
                <tr>
                    <th class="center">` + (i + 1) + `</th>
                    <td class="" title="` + data[i].user.username + `">` + data[i].user.username + `</td>
                    <td class="center">` + tgl + `</td>
                    <td class="center">` + startAt + `</td>
                    <td class="center">` + endAt + `</td>

                </tr>
                `
                    $("tbody").append(html)
                }
            } else {
                var html = `
                    <tr>
                        <td colspan="5" class="center txt">Belum ada list pengguna yang terblokir</td>
                    </tr>
                    `
                $("tbody").append(html)
            }
        },
        error: function (err) {
            console.log(err)
            // window.location.assign("/admin_login.html");
        }
    });

    $("#dash-blokir").addClass("li-active")
    $("#dash-blokir-link").addClass("link-list")
    $("#dash-blokir-mob").addClass("li-active")
    $("#dash-blokir-link-mob").addClass("link-list")
})