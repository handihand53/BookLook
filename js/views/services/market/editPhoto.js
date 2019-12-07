import {
    setCookie,
    getCookie,
    checkCookie
} from '../../../cookies.js'

$(window).load(function () {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://127.0.0.1:8080/api/markets",
        dataType: 'json',
        timeout: 600000,
        headers: {
            'Authorization': `Bearer ` + getCookie("token"),
        },
        success: function (data) {
            console.log(data)
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

        var _URL = window.URL || window.webkitURL
        var fileExtension = ['jpeg', 'jpg', 'png'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            alert("Only formats are allowed : " + fileExtension.join(', '));
            return;
        }

        var file = $(this)[0].files[0];

        var img = new Image();
        var imgwidth = 0;
        var imgheight = 0;
        var maxwidth = 600;
        var maxheight = 900;

        img.src = _URL.createObjectURL(file);
        img.onload = function () {
            imgwidth = this.width;
            imgheight = this.height;
            // if(imgwidth>maxwidth && imgheight>maxheight){
            //   alert("Ukuran Foto tidak valid")
            // }
            console.log(imgwidth);
            console.log(imgheight);
        }

        var fileName = file2.target.files[0].name;
        var reader = new FileReader();
        reader.readAsDataURL(event.srcElement.files[0]);
        // var me = this;
        reader.onload = function () {
            var fileContent = reader.result;
            $('#img-display').attr('src', fileContent);
        }

        $('#photo-name').html(fileName + ' has been selected.');

    });

    $("#save").click(function () {
        var pict = $("#upload-photo").get(0).files[0];
        var fd = new FormData();
        console.log(pict)
        fd.append('picture', pict);

        if (pict == null) {
            $("#icon").html(`<i class="far fa-times-circle f14-red mt-2"></i>`)
            $("#modalMsgEdit").html(`Foto masih kosong`);
            $("#editProf").click();
        }

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
                $("#editProf").click();
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    })
    


});