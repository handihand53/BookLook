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
        success: function (data) {
            console.log(data)
        },
        error: function (err) {
            window.location.assign("/admin_login.html");
        }
    });


    $("#daftar").click(function () {

        var nama = $("#nama").val()
        var username = $("#username").val()
        var email = $("#email").val()
        var password1 = $("#password1").val()
        var password2 = $("#password2").val()
        var nomor = $("#nomor").val()

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function validate() {
            var email = $("#email").val();

            if (validateEmail(email)) {
                return true;
            } else {
                return false;
            }
            return false;

        }

        if (nama == "") {
            $("#namaErr").addClass("show")
            $("#namaErr").html("Nama harus di isi")
            return
        } else if (nama.length < 3 || nama.length > 40) {
            $("#namaErr").addClass("show")
            $("#namaErr").html("Nama lengkap terdiri dari 3 - 40 karakter")
            return
        }

        if (username == "") {
            $("#usernameErr").addClass("show")
            $("#usernameErr").html("Nama pengguna harus di isi")
            return
        } else if (username.length < 4 || username.length > 15) {
            $("#usernameErr").addClass("show")
            $("#usernameErr").html("Nama pengguna terdiri dari 4 - 15 karakter")
            return
        }

        if (email == "") {
            $("#emailErr").addClass("show")
            $("#emailErr").html("Email harus di isi")
            return
        } else if (!validate()) {
            $("#emailErr").addClass("show")
            $("#emailErr").html('Format Email salah')
            return
        }

        if (password1 == "") {
            $("#passwordErr1").addClass("show")
            $("#passwordErr1").html("Kata sandi harus di isi")
            return
        } else if (password1.length < 6 || password1.length > 20) {
            $("#passwordErr1").addClass("show")
            $("#passwordErr1").html("Kata sandi terdiri dari 6 - 20 karakter")
            return
        }

        if (password2 == "") {
            $("#passwordErr2").addClass("show")
            $("#passwordErr2").html("Tolong konfirmasi Kata sandi")
            return
        } else if (password2 != password1) {
            $("#passwordErr2").addClass("show")
            $("#passwordErr2").html("Kata sandi tidak sama")
            return
        }

        if (nomor == "") {
            $("#nomorErr").addClass("show")
            $("#nomorErr").html("Nomor Telepon harus di isi")
            return
        } else if (nomor.length < 10 || nomor.length > 14) {
            $("#nomorErr").addClass("show")
            $("#nomorErr").html("No telepon terdiri dari 10 - 14 angka")
            return
        }

        var data = {
            "email": email,
            "name": nama,
            "numberPhone": nomor,
            "password": password1,
            "username": username
        };

        console.log(data)
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/api/admin/add-admin",
            data: JSON.stringify(data),
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                console.log(data)
            },
            error: function (err) {
                console.log(err)
            }
        });
    })

    $('input[type=number]').on('focus', function (e) {
        $(this).on('wheel', function (e) {
            e.preventDefault();
        });
    });

    $('input[type=number]').on('keydown', function (e) {
        if (e.which == 38 || e.which == 40)
            e.preventDefault();
    });

    document.getElementById("nomor").addEventListener("keypress", function (evt) {
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    });

    $("#dash-add").addClass("li-active")
    $("#dash-add-link").addClass("link-list")
    $("#dash-add-mob").addClass("li-active")
    $("#dash-add-link-mob").addClass("link-list")
    $("#ok").click(function () {
        location.reload();
    })
})