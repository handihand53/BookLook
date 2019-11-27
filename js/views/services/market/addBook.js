import {
  setCookie,
  getCookie,
  checkCookie
} from '../../../cookies.js'

$(window).load(function () {
  var _URL = window.URL || window.webkitURL;
  $('input[id="upload"]').change(function (file2) {

    var fileExtension = ['jpeg', 'jpg', 'png'];
    if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
      alert("Only formats are allowed : " + fileExtension.join(', '));
      return;
    }

    // checker for img size
    // ==========================================================
    // var file = $(this)[0].files[0];

    // var img = new Image();
    // var imgwidth = 0;
    // var imgheight = 0;
    // var maxwidth = 640;
    // var maxheight = 640;

    // img.src = _URL.createObjectURL(file);
    // img.onload = function () {
    //   imgwidth = this.width;
    //   imgheight = this.height;
    //   console.log(imgwidth);
    //   console.log(imgheight);
    // }
    var fileName = file2.target.files[0].name;
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
      console.log(data);
      if (data.marketId != null) {
        $("#marketName").html(data.marketName)
        $("#marketSku").val(data.marketSKU)
      }
    },
    failure: function (errMsg) {
      console.log(errMsg);
    }
  });

  $("#addBook").click(function () {
    var judulBuku = $("#judulBuku").val()
    var penulisBuku = $("#penulisBuku").val()
    var penerbitBuku = $("#penerbitBuku").val()
    var kategoriBuku = $("#kategoriBuku").val()
    var skuBuku = $("#skuToko").val() + $("#skuBuku").val()
    var hargaBuku = $("#hargaBuku").val()
    var deskripsiBuku = $("#deskripsiBuku").val()
    // var judulBuku = $("#judulBuku").val()
    // var judulBuku = $("#judulBuku").val()
    // var judulBuku = $("#judulBuku").val()
    // var judulBuku = $("#judulBuku").val()

    var data = {
      "marketName": storeName,
      "marketSKU": storeSku,
      "marketBio": storeBio
    };

    console.log(JSON.stringify(data));

    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "http://127.0.0.1:8080/api/users",
      data: JSON.stringify(data),
      dataType: 'json',
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ` + getCookie("token"),
      },
      success: function (data) {},
      failure: function (errMsg) {
        console.log(errMsg);
      }
    });
  })

});