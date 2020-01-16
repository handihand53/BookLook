import {
    setCookie,
    getCookie,
    checkCookie
} from './cookies.js';

$(document).ready(function () {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/users",
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            window.location.assign("user/index.html");
        },
        error: function (errMsg) {

        }
    });

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validate() {
        var email = $("#email").val();

        if (validateEmail(email)) {
            return true;
        } else {
            $("#login-fail").append('Format Email salah')
        }
        return false;
    }

    var numRegex = "//d+";

    var nama
    var username
    var email
    var password
    var phoneNumber

    $('input[type=number]').on('focus', function (e) {
        $(this).on('wheel', function (e) {
            e.preventDefault();
        });
    });

    $('input[type=number]').on('keydown', function (e) {
        if (e.which == 38 || e.which == 40)
            e.preventDefault();
    });

    var flag = false

    document.getElementById("password2").addEventListener("input", function () {
        var s = $("#password").val().toString()
        if (s != $(this).val()) {
            $("#hint-password2").html("Kata sandi tidak sama")
            flag = false
        } else {
            flag = true
            $("#hint-password2").html("")
        }
    })

    document.getElementById("phoneNumber").addEventListener("keypress", function (evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    });

    document.getElementById("phoneNumber").addEventListener("input", function () {
        var s = $("#phoneNumber").val().toString()
        if (s.length < 9) {
            $("#errPhone").html("Panjang minimal nomor telepone adalah 10 karakter")
        } else {
            $("#errPhone").html("")
        }
    })

    $("#daftar").click(function () {
        $("#login-fail").html("");
        nama = $("#name").val();
        username = $("#username").val();
        email = $("#email").val();
        password = $("#password").val();
        phoneNumber = $("#phoneNumber").val();
        var cek = true;


        if (nama == "") {
            $("#login-fail").append(`<li>Nama harus di isi</li>`)
            cek = false;
        } else if (nama.length < 4) {
            $("#login-fail").append(`<li>Panjang nama lengkap tidak valid</li>`)
            cek = false;
        }

        if (username == "") {
            $("#login-fail").append(`<li>Nama Pengguna harus di isi</li>`)
            cek = false;
        } else if (username.length < 3) {
            $("#login-fail").append(`<li>Panjang nama pengguna tidak valid</li>`)
            cek = false;
        }

        if (email == "") {
            $("#login-fail").append(`<li>Email harus di isi</li>`)
            cek = false;
        }

        if (password == "") {
            $("#login-fail").append(`<li>Kata sandi harus di isi</li>`)
            cek = false;
        } else if (password.length < 6 || password.length > 20) {
            $("#login-fail").append(`<li>Panjang password tidak valid</li>`)
            cek = false;
        }

        if (flag == false) {
            $("#hint-password2").html("Silahkan ketik ulang kata sandi anda")
        }

        if (phoneNumber == "") {
            $("#login-fail").append(`<li>No telepon harus di isi</li>`)
            cek = false;
        } else if (phoneNumber.match(numRegex)) {
            cek = false;
        }

        if (!validate()) {
            return;
        };

        if (cek && flag) {
            var data = {
                "name": nama,
                "username": username,
                "email": email,
                "password": password,
                "numberPhone": phoneNumber
            };

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://127.0.0.1:8080/api/auth/signup",
                data: JSON.stringify(data),
                dataType: 'json',
                async: false,
                success: function (msg) {
                    login();
                },
                error: function (errMsg) {
                    console.log(errMsg)
                    alert(errMsg.responseJSON.message);
                }
            });
        }
    });

    function login() {
        var dataIn = {
            "usernameOrEmail": email,
            "password": password
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/auth/signin",
            data: JSON.stringify(dataIn),
            dataType: 'json',
            success: function (a) {
                var token = a.result;
                setCookie("token", token, 1);
                window.location.assign("user/index.html");
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            $("#daftar").click()
        }
    });
});