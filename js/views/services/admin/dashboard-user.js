$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/api/admin/profile",
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
        },
        error:function (err){
            window.location.assign("/admin_login.html");
        }
    });
    
    $("#dash-user").addClass("li-active")
    $("#dash-user-link").addClass("link-list")
    $("#dash-user-mob").addClass("li-active")
    $("#dash-user-link-mob").addClass("link-list")
})