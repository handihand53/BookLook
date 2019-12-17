import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

import checkMarket from '../../../marketCheck.js';

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


    $("#input").click(function () {
        $("#upload-photo").click();
    })

    $('input[id="upload-photo"]').change(function (file2) {
        if ($("#upload-photo").get(0).files[0] == null) {
            $("#img-display").attr("src", "")
        } else {
            var _URL = window.URL || window.webkitURL
            var fileExtension = ['jpeg', 'jpg', 'png'];
            if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                alert("Only formats are allowed : " + fileExtension.join(', '));
                return;
            }

            var fileName = file2.target.files[0].name;
            var reader = new FileReader();
            reader.readAsDataURL(event.srcElement.files[0]);
            // var me = this;
            reader.onload = function () {
                var fileContent = reader.result;
                $('#img-display').attr('src', fileContent);
            }
        }

    });




    $("#save").click(function () {
        var pict = $("#upload-photo").get(0).files[0];
        var fd = new FormData();
        var today = new Date();
        var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
        var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds() + "" + today.getMilliseconds();
        var dateTime = date + '' + time;
        var berkasName = dateTime + pict.name
        fd.append('picture', pict, berkasName);
        console.log(pict)
        if (pict == null) {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Foto masih kosong`);
            $("#editProf").click();
        } else {
            $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
            $("#modalMsgEdit").html(`Perubahan profile berhasil disimpan`);
            $("#editProf").click();

        }

        $.ajax({
            type: "PUT",
            url: "http://127.0.0.1:8080/api/users/edit/profile/photo",
            timeout: 600000,
            data: fd,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#editProf").click();
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })

    checkMarket();
});