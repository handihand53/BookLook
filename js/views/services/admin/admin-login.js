import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js';

$(document).ready(function () {

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validate() {
        var email = $("#username").val();

        if (validateEmail(email)) {
            return true;
        } else {
            $("#login-fail").html('Format Email salah')
        }
        return false;
    }

    $("#masuk").click(function () {
        $("#login-fail").html("");
        var username = $("#username").val();
        var password = $("#password").val();
        if (username == "") {
            $("#login-fail").html('Email Tidak boleh kosong')
            return;
        }

        if (!validate()) {
            return;
        };

        if (password == "") {
            $("#login-fail").html('Password Tidak boleh kosong')
            return;
        }

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
                url: "http://127.0.0.1:8080/api/auth/admin/signin",
                data: JSON.stringify(data),
                dataType: 'json',
                timeout: 600000,
                success: function (data) {
                    console.log(data)
                    var token = data.result;
                    setCookie("token", token, 1);
                    window.location.assign("admin/dashboard.html");
                },
                error: function (errMsg) {
                    console.log(errMsg)
                    if (errMsg.responseJSON.status == 401)
                        $("#login-fail").html('Email atau password salah, Silahkan coba lagi')
                }
            });
        }
    });


    //Untuk deteksi menekan tombol enter
    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            $("#masuk").click()
        }
    });
});