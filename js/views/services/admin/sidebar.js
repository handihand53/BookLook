import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';


$(document).ready(function () {
    // <li id="dash-user" class="p-3 li"><a href="dashboard_user.html" id="dash-user-link" class="list-color"><i class="fa fa-user" aria-hidden="true"></i> User</a></li>
    // <li class="p-3 li"><a href="" class="list-color"><i class="fa fa-exchange-alt" aria-hidden="true"></i> Transaksi</a></li>

    let sidebar=`
    
    <ul class="navbar-nav">
        <li id="dash-home" class="p-3 li"><a id="dash-home-link" href="dashboard.html" class="list-color"><i class="fa fa-home"
                    aria-hidden="true"></i> Home</a></li>
        <li id="dash-toko" class="p-3 li"><a href="dashboard_user.html?page=1" id="dash-toko-link" class="list-color"><i class="fa fa-user"
                    aria-hidden="true"></i> Pengguna</a></li>
        <li id="dash-blokir" class="p-3 li"><a href="dashboard_blokir.html" id="dash-blokir-link" class="list-color"><i class="fa fa-ban"
                    aria-hidden="true"></i> Blokir</a></li>
        <li id="dash-konfirmasi" class="p-3 li"><a href="dashboard_konfirmasi.html" id="dash-konfirmasi-link" class="list-color"><i class="fa fa-envelope"
                    aria-hidden="true"></i> Konfirmasi Buku<span id="jmlBuku"> </span></a></li>
    </ul>
    <ul class="navbar-nav sidenav" id="mySidenav">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <li id="dash-home-mob" class="li"><a href="dashboard.html" id="dash-home-link-mob" class="list-color"><i class="fa fa-home"
                    aria-hidden="true"></i> Home</a></li>
        <li id="dash-toko-mob" class="li"><a href="dashboard_user.html?page=1" id="dash-toko-link" class="list-color"><i class="fa fa-user"
                    aria-hidden="true"></i> PEngguna</a></li>
        <li id="dash-blokir-mob" class="li"><a href="dashboard_blokir.html" id="dash-blokir-link-mob" class="list-color"><i class="fa fa-ban"
                    aria-hidden="true"></i> Blokir</a></li>
        <li id="dash-konfirmasi-mob" class="li"><a href="dashboard_konfirmasi.html" id="dash-konfirmasi-link-mob" class="list-color"><i class="fa fa-envelope"
                    aria-hidden="true"></i> Konfirmasi Buku<span id="jmlBukuMob" class="notif"> </span></a></li>
    </ul>
    `;
    $("#sidebar").html(sidebar)
    getBookRequest()
    function getBookRequest() {
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
                } else {
                    $("#jmlBukuMob").html("")
                    $("#jmlBuku").html("")
                    $("#jmlBukuMob").removeClass("notif")
                    $("#jmlBuku").removeClass("notif")
                }
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }
    
});