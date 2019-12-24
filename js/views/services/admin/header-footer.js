$(document).ready(function () {
    let header=`
    <nav class="navbar navbar-expand-md navbar-dark bg-custom-admin" >
        <div class="dashboard-title col-8"><span class="side-icon" onclick="openNav()">&#9776;</span>Dashboard</div>
        <div class="dashboard-title" style="margin-left:auto; margin-right:15px;"><i class="fas fa-bell"></i></div>
        <div class=" float-right dashboard-title"><img src="../assets/else/profile_picture_example.png" alt="pp" width="30px"> <i class="fa fa-fw fa-chevron-down"></i></div>
    </nav>
    `;

    let footer=`
    <div class="center p-2" style="color: white; font-size: 12px;">
        &copy; BookLook 2019
    </div>
    `;
    console.log("a")
    $("#header").html(header)
    $("#footer").html(footer)
})