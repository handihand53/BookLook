import {
    getCookie,
    deleteCookie
} from '../../../cookies.js';

$(document).ready(function () {
    let header = `
    <nav class="navbar navbar-expand-md navbar-dark bg-custom-admin" >
        <div class="dashboard-title col-8"><span class="side-icon" onclick="openNav()">&#9776;</span>Dashboard</div>
        <div class="float-right dashboard-title" style="margin-left:auto;">
            <div class="dropdown profile-setting" id="drop">
                <span class="profile-setting" id="dropdownMenuButton">
                    <i class="fas fa-user"></i>
                    <i class="fa fa-fw fa-chevron-down"></i>
                </span>
                <div class="dropdown-menu" style="left: -120px; top: 20px" id="dropdown-content" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" id="logout" href="#">Keluar</a>
                </div>
            </div>
        </div>
    </nav>
    `;

    let footer = `
    <div class="center p-2" style="color: white; font-size: 12px;">
        &copy; BookLook 2019
    </div>
    `;
    $("#header").html(header)
    $("#footer").html(footer)

    $("#drop").mouseover(function () {
        $("#drop").addClass("show")
        $("#dropdown-content").addClass("show")
    })

    $("#drop").mouseout(function () {
        $("#drop").removeClass("show")
        $("#dropdown-content").removeClass("show")
    })

    $("#logout").click(function () {
        logout()
    })

    function logout() {
        deleteCookie()
        window.location.href = "/admin_login.html"

        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:8080/api/auth/signout",
          headers: {
            'Authorization': `Bearer ` + getCookie("token"),
          },
          success: function (data) {
            console.log(data)
            deleteCookie()
            location.reload()
          },
          error: function(data){
            console.log(data)
          }
        });
      }
})