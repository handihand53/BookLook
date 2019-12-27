import { setCookie, getCookie, checkCookie } from './cookies.js';

$(document).ready(function () {

    
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validate() {
        var email = $("#email").val();

        if (validateEmail(email)) {
            console.log("valid");
            return true;
        } else {
            $("#login-fail").append('Format Email salah')
            console.log("invalid")
        }
        return false;
    }

    var numRegex="//d+";

    var nama
    var username
    var email
    var password
    var phoneNumber

    $("#daftar").click(function () {
        $("#login-fail").html("");
        nama = $("#name").val();
        username = $("#username").val();
        email = $("#email").val();
        password = $("#password").val();
        phoneNumber = $("#phoneNumber").val();
        var cek=true;
        

        if (nama == "") {
            $("#login-fail").append(`<li>Nama harus di isi</li>`)
            cek=false;
            console.log ("kosong");
        }
        else if (nama.length < 4) {
            $("#login-fail").append(`<li>Panjang nama lengkap tidak valid</li>`)
            cek=false;
        }

        if (username == "") {
            $("#login-fail").append(`<li>Nama Pengguna harus di isi</li>`)
            cek=false;
        }
        else if (username.length < 3) {
            $("#login-fail").append(`<li>Panjang nama pengguna tidak valid</li>`)
            cek=false;
        }

        if (email == "") {
            $("#login-fail").append(`<li>Email harus di isi</li>`)
            cek=false;
        }
        if (password == ""){
            $("#login-fail").append(`<li>Kata sandi harus di isi</li>`)
            cek = false;
        } else if (password.length < 6 || password.length > 20){
            $("#login-fail").append(`<li>Panjang password tidak valid</li>`)
            cek=false;
        }

        if(phoneNumber == ""){
            $("#login-fail").append(`<li>No telepon harus di isi</li>`)
            cek = false;
        }else if(phoneNumber.match(numRegex)){
            cek=false;
        }
        
        if (!validate()) {
            return;
        };

        if(cek){
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
                cache: false,
                timeout: 600000,
                success: function (msg) {
                    login();
                },
                error: function (errMsg) {
                    console.log(errMsg)
                    alert("gagal");
                }
            });
        }
    });

    function login() {
        var dataIn = {
            "usernameOrEmail": email,
            "password": password
        };

        console.log(JSON.stringify(dataIn));
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/auth/signin",
            data: JSON.stringify(dataIn),
            dataType: 'json',
            timeout: 600000,
            success: function (a) {
                console.log(a)
                var token = a.result;
                setCookie("token", token, 1);
                window.location.assign("user/index.html");
            },
            error: function (errMsg) {
                console.log(errMsg)
            }
        });
    }

    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            $("#daftar").click()
        }
    });
});