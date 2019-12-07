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
            console.log(errMsg);
            window.location.replace("/404.html")
        }
    });

    $('input[id="upload"]').change(function (file) {
        var fileName = file.target.files[0].name;
        var reader = new FileReader();
        reader.readAsDataURL(event.srcElement.files[0]);
        var me = this;
        reader.onload = function () {
          var fileContent = reader.result;
          console.log(fileContent);
          $('#img').attr('src', fileContent);
        }
        $('p[id="file-name"]').html(fileName + ' has been selected.');
      });

      var fileInput = document.querySelector("#input");

      fileInput.addEventListener("click", function (event) {
        document.querySelector("#upload").click();
        console.log("click");
      });

      for (var i = 1; i < 80; i++) {
        var year = 1980 + i;
        $('select[id="tahun"]').append("<option value='" + year + "'>" + year + "</option>");
      }
});