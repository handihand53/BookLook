import { setCookie, getCookie, checkCookie } from './cookies.js';

$(document).ready(function () {
    // if(localStorage.getItem("token")!=null) window.location.replace("user/index.html");
    // console.log(getCookie("token"));
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validate() {
        var email = $("#username").val();

        if (validateEmail(email)) {
            console.log("valid");
            return true;
        } else {
            $("#login-fail").html('Format Email salah')
            console.log("invalid")
        }
        return false;
    }

    $("#masuk").click(function () {
        $("#login-fail").html("");

        if (!validate()) {
            return;
        };

        var username = $("#username").val();
        var password = $("#password").val();
        if (username == "" && password == "") {
            $("#login-fail").html(`
            <ul>
                <li>Alamat email harus di isi</li>
                <li>Kata sandi harus di isi</li>
            </ul>`)
        } else if (username == "") {
            $("#login-fail").html('Alamat email harus diisi')
        } else if (password == "") {
            $("#login-fail").html('Password harus diisi')
        } else {
            var data = {
                "usernameOrEmail": username,
                "password": password
            };

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/auth/signin",
                data: JSON.stringify(data),
                dataType: 'json',
                timeout: 600000,
                success: function (data) {
                    var token = data.accessToken;
                    var type = data.tokenType;
                    setCookie("token", token, 1);
                    window.location.assign("user/index.html");
                },
                error: function (errMsg) {
                    console.log(errMsg)
                    if (errMsg.responseJSON.status == 401)
                        $("#login-fail").html('Email atau password salah, Silahkan coba lagi')
                }
            });
        }
    });
});