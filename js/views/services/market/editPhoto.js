import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'
import checkTransaksi from '../../../notifMarket.js';
$(window).load(function () {

    if (checkTransaksi() != 0) $("#pemberitahuan").html(checkTransaksi())
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        async: false,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            if (data.marketId != null) {
                $("#loading").css("visibility", "hidden");
                $("#marketName").html(data.marketName)
                if (data.marketPhoto == null)
                    $('#display').attr('src', "../assets/else/signature.png");
                else
                    $('#display').attr('src', data.marketPhoto);
            }
        },
        error: function (errMsg) {
            window.location.replace("/404.html")
        }
    });

    $("#input").click(function () {
        $("#upload-photo").click();
    })

    $('input[id="upload-photo"]').change(function (file2) {
        if ($("#upload-photo").get(0).files[0] == null) {
            $("#img-display").attr("src", "")
            return
        } else {
            var _URL = window.URL || window.webkitURL
            var fileExtension = ['jpeg', 'jpg', 'png'];
            if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                alert("Format foto yang diperbolehkan : " + fileExtension.join(', '));
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
            
            if (fileName == "") {
            }
        }
    });

    $("#save").click(function () {
        var pict = $("#upload-photo").get(0).files[0];
        if (pict == null) {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Foto masih kosong`);
            $("#editProf").click();
            return
        }
        var today = new Date();
        var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
        var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds() + "" + today.getMilliseconds();
        var dateTime = date + '' + time;
        var berkasName = dateTime + pict.name
        var fd = new FormData();
        fd.append('picture', pict, berkasName);



        $.ajax({
            type: "PUT",
            url: "http://127.0.0.1:8080/api/markets/edit/profile/photo",
            timeout: 600000,
            data: fd,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                $("#icon").html(`<i class="fas fa-check f14 mb-2 mt-2"></i>`)
                $("#modalMsgEdit").html(`Perubahan foto berhasil disimpan`);
                $("#editProf").click();
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })

    checkJmlBukuTerjual()

    function checkJmlBukuTerjual() {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://127.0.0.1:8080/api/transactions/market/show",
            dataType: 'json',
            async: true,
            headers: {
                'Authorization': `Bearer ` + getCookie("token"),
            },
            success: function (data) {
                var tot = 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].transferConfirm == "PENDING") {} else tot++
                }
                $("#jmlBuku").html(tot)
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    $("#iconback").html(`<i class="fas fa-chevron-left mt-1 ml-auto"></i> <span class="bold">Toko</span>`)
    $("#logoBooklook").addClass("h")
    $("#iconback").click(function () {
        window.location.href = "/market/store.html"
    })
});