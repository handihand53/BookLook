import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {

    getDataUser();

    function getDataUser() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/users",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                if (data.userPhoto == null)
                    $('#img').attr('src', "../assets/else/signature.png");
                else
                    $('#img').attr('src', data.userPhoto);
                $("#loading").removeClass("loading");
                $("#displayName").html(data.name);
            },
            error: function (errMsg) {
                window.location.replace("/404.html")
            }
        });
    }

    $("#save").click(function () {
        var oldPass = $("#old-pass").val();
        var newPass = $("#new-pass").val();
        var reNewPass = $("#re-new-pass").val();
        if (newPass != reNewPass) {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Password baru tidak sama`);
            $("#editProf").click();
            return
        }

        if (oldPass == "" || newPass == "" || reNewPass == "") {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Semua data harus diisi`);
            $("#editProf").click();
            return
        }

        var data = {
            "oldPassword": oldPass,
            "newPassword": newPass
        }

        $.ajax({
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            url: "http://127.0.0.1:8080/api/users/edit/password",
            dataType: 'json',
            timeout: 600000,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2">`)
                $("#modalMsgEdit").html(data.message)
                $("#editProf").click();
            },
            error: function (errMsg) {
                $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
                $("#modalMsgEdit").html(errMsg.responseJSON.message);
                $("#editProf").click();
            }
        });
    });

    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Profile</span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.location.href = "/user/user.html"
    })
});