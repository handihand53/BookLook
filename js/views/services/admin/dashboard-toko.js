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

    var user;
    var start = "-"
    var end = "-"
    var btn = "Blokir"
    var btnClass = "blokir-btn"
    getList()

    function getList() {
        user = new Array();
        $("#table-body").html("")
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/api/admin/list/users",
            async: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                user = data
                user.sort(usernameAsc);
                addToTable()
            }
        });
    }

    $('#search').on('input', function () {
        user.sort(usernameAsc);
        addToTable($(this).val())
    });

    function usernameAsc(a, b) {
        var nameA = a.username.toUpperCase(); // ignore upper and lowercase
        var nameB = b.username.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }

    function usernameDesc(a, b) {
        var nameA = a.username.toUpperCase(); // ignore upper and lowercase
        var nameB = b.username.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }

        if (nameA < nameB) {
            return 1;
        }

        return 0;
    }

    function statusAsc(a, b) {
        var nameA = a.status.toUpperCase(); // ignore upper and lowercase
        var nameB = b.status.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }

        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }

    function statusDesc(a, b) {
        var nameA = a.status.toUpperCase(); // ignore upper and lowercase
        var nameB = b.status.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
            return -1;
        }

        if (nameA < nameB) {
            return 1;
        }

        return 0;
    }

    sortName()

    function sortName() {
        $("#namaTabel").click(function () {
            $("#statusTabel").html(`Status`)
            if ($(this).attr("data-set") == "0") {
                $(this).attr("data-set", "1")
                $(this).html(`Nama Pengguna <i class="fas fa-sort-up"></i>`)
                user.sort(usernameAsc);
                addToTable($("#search").val())
            } else {
                $(this).attr("data-set", "0")
                $(this).html(`Nama Pengguna <i class="fas fa-sort-down"></i>`)
                user.sort(usernameDesc);
                addToTable($("#search").val())
            }
        })
    }

    sortStatus()

    function sortStatus() {
        $("#statusTabel").click(function () {
            $("#namaTabel").html(`Nama Pengguna`)
            if ($(this).attr("data-set") == "0") {
                $(this).attr("data-set", "1")
                $(this).html(`Status <i class="fas fa-sort-up"></i>`)
                user.sort(statusAsc);
                addToTable($("#search").val())
            } else {
                $(this).attr("data-set", "0")
                $(this).html(`Status <i class="fas fa-sort-down"></i>`)
                user.sort(statusDesc);
                addToTable($("#search").val())
            }
        })
    }

    function addToTable(str) {
        if (user.length != 0) {
            $("#table-body").html("")
            var f = false;
            for (var i = 0; i < user.length; i++) {
                if (str == "" || str == undefined) {
                    var d = new Date(user[i].createdAt);
                    var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                    var user_id = user[i].userId
                    var idx = i;
                    var statsMarket = "Aktif"
                    var color = "green"

                    $.ajax({
                        type: "GET",
                        url: "http://127.0.0.1:8080/api/admin/block/user",
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
                                for (var x = 0; x < data.length; x++) {
                                    if (user_id == data[x].user.userId) {
                                        user[idx].status = "1"
                                        var today = new Date();
                                        start = new Date(data[x].startAt);
                                        end = new Date(data[x].endAt);

                                        if (today >= start && today <= end) {
                                            statsMarket = "Blokir"
                                            color = "red"
                                            btn = "Buka Blokir"
                                            btnClass = "unblokir-btn"
                                            break
                                        } else {
                                            start = "-"
                                            end = "-"
                                            console.log(start)
                                            btn = "Blokir"
                                            btnClass = "blokir-btn"
                                        }
                                    } else {
                                        user[idx].status = "0"
                                        start = "-"
                                        end = "-"
                                        btn = "Blokir"
                                        btnClass = "blokir-btn"
                                    }
                                }
                            } else {
                                user.forEach(function (data) {
                                    data.status = "0"
                                });
                            }
                        },
                    });

                    var html = `
                    <tr>
                        <th class="center" scope="row">` + (i + 1) + `</th>
                        <td class="" title="` + user[i].username + `">` + user[i].username + `</a></td>
                        <td class="center" style="color: ` + color + `;">` + statsMarket + `</td>
                        <td class="center">` + tgl + `</td>
                        <td class="center detail" data-id="` + i + `" data-start="` + start + `" data-end="` + end + `">Detail</td>
                        <td class="center"><button data-id="` + user[i].userId + `" data-user="` + user[i].username + `" class="` + btnClass + `">` + btn + `</button></td>
                    </tr>
                    `

                    $("#table-body").append(html)
                } else if (str.toLowerCase() == user[i].username.substring(0, str.length).toLowerCase()) {
                    var count = 1;
                    if (f == false) $("#table-body").html("")
                    f = true
                    var d = new Date(user[i].createdAt);
                    var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
                    var user_id = user[i].userId
                    var statsMarket = "Aktif"
                    var color = "green"

                    $.ajax({
                        type: "GET",
                        url: "http://127.0.0.1:8080/api/admin/block/user",
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
                                for (var x = 0; x < data.length; x++) {
                                    if (user_id == data[x].user.userId) {
                                        var today = new Date();
                                        start = new Date(data[x].startAt);
                                        end = new Date(data[x].endAt);

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
                        <th class="center" scope="row">` + count + `</th>
                        <td class="" title="` + user[i].username + `">` + user[i].username + `</a></td>
                        <td class="center" style="color: ` + color + `;">` + statsMarket + `</td>
                        <td class="center">` + tgl + `</td>
                        <td class="center detail" data-id="` + i + `" data-start="` + start + `" data-end="` + end + `">Detail</td>
                        <td class="center"><button data-id="` + user[i].userId + `" data-user="` + user[i].username + `" class="` + btnClass + `">` + btn + `</button></td>
                    </tr>
                    `
                    $("#table-body").append(html)
                    count++;
                } else if (f == false) {
                    var html = `
                        <tr>
                            <td colspan="6" class="center txt">User tidak ditemukan</td>
                        </tr>
                        `
                    $("#table-body").html(html)
                }
            }

            $("#totMarket").html(user.length)

        } else {
            var html = `
            <tr>
                <td colspan="6" class="center txt">Belum ada user yang terdaftar</td>
            </tr>
            `
            $("#table-body").append(html)
        }

        bindListener()
    }

    $("#unblokirUser").click(function () {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/api/admin/unblock/user/" + $(this).attr("data-iduser"),
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

    $("#blokirUser").click(function () {
        if ($("#hari").val() == "") {
            $("#errText").html("Tolong isi durasi lama blokir")
            return
        }
        $('#confirmModal').modal('hide');
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/api/admin/block/user/" + $(this).attr("data-iduser") + "/" + $("#hari").val(),
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
            $("#userName").html($(this).attr("data-user"))
            $("#blokirUser").attr("data-iduser", $(this).attr("data-id"))
            $("#unblokirUser").attr("hidden", true)
            $("#durasi").html(`Durasi blokir: <input type="number" class="day" id="hari" min="1" width="50px"> Hari`)
            $("#blokirUser").attr("hidden", false)
        })

        $(".detail").click(function () {
            $("#btn-modal").click()

            var src
            if (user[$(this).attr("data-id")].userPhoto == null) {
                src = "../assets/else/signature.png";
            } else {
                src = user[$(this).attr("data-id")].userPhoto
            }
            var start = "-"
            if ($(this).attr("data-start") != "-")
                start = new Date($(this).attr("data-start"))

            var end = "-"
            if ($(this).attr("data-end") != "-")
                end = new Date($(this).attr("data-end"))
            var s = "-",
                e = "-"

            if (start != "-")
                s = start.getDate() + " " + month[start.getMonth()] + " " + start.getFullYear() + " - " + addZero(start.getHours()) + ":" + addZero(start.getMinutes()) + " WIB";

            if (end != "-")
                e = end.getDate() + " " + month[end.getMonth()] + " " + end.getFullYear() + " - " + addZero(end.getHours()) + ":" + addZero(end.getMinutes()) + " WIB";

            $("#blokirStart").html(s)
            $("#blokirEnd").html(e)
            $("#img-user").attr("src", src)
            $("#emailUser").html(user[$(this).attr("data-id")].email)
            $("#noTlpUser").html(user[$(this).attr("data-id")].numberPhone)
            $("#namaUser").html(user[$(this).attr("data-id")].username)
            var d = new Date(user[$(this).attr("data-id")].createdAt);
            var tgl = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
            $("#date").html(tgl)

        })

        $(".unblokir-btn").click(function () {
            $("#unblock").html("Buka blokir untuk pengguna " + $(this).attr("data-user") + " ?")
            $("#unblokirUser").attr("data-iduser", $(this).attr("data-id"))
            $("#unblokirUser").attr("hidden", false)
            $("#blokirUser").attr("hidden", true)
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